import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { consumePasswordResetToken } from "@/lib/password-reset";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const resetToken = String(body.resetToken || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { message: "Email, reset token, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired password reset request." },
        { status: 400 }
      );
    }

    const tokenIsValid = await consumePasswordResetToken(
      email,
      resetToken
    );

    if (!tokenIsValid) {
      return NextResponse.json(
        { message: "Invalid or expired password reset request." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { message: "Unable to reset your password. Please try again." },
      { status: 500 }
    );
  }
}