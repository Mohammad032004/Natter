
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error(
    "EMAIL_USER and EMAIL_PASS must be configured. Check apps/web/.env"
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  const recipient = email.trim().toLowerCase();

  const result = await transporter.sendMail({
    from: `"Natter" <${emailUser}>`,
    to: recipient,
    subject: "Your Natter verification code",

    text: `
Welcome to Natter!

Your verification code is ${otp}.

This code expires in 5 minutes.
If you did not request this code, you can ignore this email.
    `.trim(),

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 20px auto;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background-color: #ffffff;
          color: #111827;
        "
      >
        <h2 style="color: #7c3aed; margin-bottom: 16px;">
          Welcome to Natter!
        </h2>

        <p style="font-size: 15px; line-height: 1.6;">
          Use the verification code below to verify your email address.
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px 0;
            color: #7c3aed;
          "
        >
          ${otp}
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          This code expires in 5 minutes.
        </p>

        <p style="font-size: 13px; color: #6b7280;">
          If you did not request this code, you can ignore this email.
        </p>

        <hr
          style="
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
          "
        />

        <p style="font-size: 12px; color: #9ca3af;">
          © 2026 Natter. All rights reserved.
        </p>
      </div>
    `,
  });

  // Log delivery information without exposing the OTP.
  console.log("Natter OTP delivery result:", {
    recipient,
    accepted: result.accepted,
    rejected: result.rejected,
    messageId: result.messageId,
  });

  return result;
}
