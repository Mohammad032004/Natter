import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import clientPromise from "@/lib/mongodb";
import { createPasswordResetToken } from "@/lib/password-reset";

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Please enter a valid email and 6-digit code." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const otpRecord = await db.collection("passwordResetOtps").findOne({
      email,
      otpHash: hashOtp(otp),
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // Consume the OTP so it cannot be reused.
    await db.collection("passwordResetOtps").deleteOne({
      _id: otpRecord._id,
    });

    const resetToken = await createPasswordResetToken(email);

    return NextResponse.json({
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);

    return NextResponse.json(
      { message: "Unable to verify the code. Please try again." },
      { status: 500 }
    );
  }
}