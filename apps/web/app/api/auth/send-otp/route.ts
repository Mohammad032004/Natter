
import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mailer";
import { generateOtp, saveOtp } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const otp = generateOtp();

    await saveOtp(normalizedEmail, otp);

    console.log("OTP requested for:", normalizedEmail);

    const result = await sendOtpEmail(normalizedEmail, otp);

    console.log("Natter OTP delivery:", {
      recipient: normalizedEmail,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
      messageId: result.messageId,
    });

    return NextResponse.json(
      { message: "OTP sent successfully." },
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
