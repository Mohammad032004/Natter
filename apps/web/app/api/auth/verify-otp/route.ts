
import { NextRequest, NextResponse } from "next/server";
import {
  verifyOtp,
  createVerificationToken,
} from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email;
    const otp = body.otp;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !email.trim() ||
      !otp.trim()
    ) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be a 6-digit number." },
        { status: 400 }
      );
    }

    const isValid = await verifyOtp(normalizedEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    const verificationToken =
      await createVerificationToken(normalizedEmail);

    return NextResponse.json(
      {
        message: "Email verified successfully.",
        verificationToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      { message: "OTP verification failed." },
      { status: 500 }
    );
  }
}
