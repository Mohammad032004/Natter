import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send the OTP email
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json(
      {
        message: "OTP sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      { message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}