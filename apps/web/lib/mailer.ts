import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER and EMAIL_PASS must be configured.");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  const result = await transporter.sendMail({
    from: `"Natter" <${emailUser}>`,
    to: email,
    subject: "Your Natter verification code",
    text: `Your Natter verification code is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px;">
        <h2 style="color: #635bff;">Welcome to Natter</h2>

        <p>Use the verification code below to continue.</p>

        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 0;">
          ${otp}
        </div>

        <p>This code expires in <strong>5 minutes</strong>.</p>

        <p style="color: #777; font-size: 13px;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  return result;
}