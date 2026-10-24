import { randomInt, createHash } from "crypto";
import clientPromise from "@/lib/mongodb";

const OTP_EXPIRY_MINUTES = 5;

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export async function saveOtp(email: string, otp: string) {
  const client = await clientPromise;
  const db = client.db();

  const otpCollection = db.collection("otps");

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await otpCollection.updateOne(
    { email },
    {
      $set: {
        email,
        otpHash: hashOtp(otp),
        expiresAt,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function verifyOtp(email: string, otp: string) {
  const client = await clientPromise;
  const db = client.db();

  const otpCollection = db.collection("otps");

  const record = await otpCollection.findOne({
    email,
    otpHash: hashOtp(otp),
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return false;
  }

  await otpCollection.deleteOne({ _id: record._id });

  return true;
}