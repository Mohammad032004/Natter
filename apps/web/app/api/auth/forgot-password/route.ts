import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    // Use the same response whether or not the account exists.
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists with this email, a password reset code has been sent.",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.collection("passwordResetOtps").updateOne(
      { email },
      {
        $set: {
          email,
          otpHash: require("crypto")
            .createHash("sha256")
            .update(otp)
            .digest("hex"),
          expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    await sendOtpEmail(email, otp);

    return NextResponse.json({
      message:
        "If an account exists with this email, a password reset code has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Unable to process your request. Please try again." },
      { status: 500 }
    );
  }
}