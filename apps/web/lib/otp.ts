
import { randomInt, createHash, randomBytes } from "crypto";
import clientPromise from "@/lib/mongodb";

const OTP_EXPIRY_MINUTES = 5;
const VERIFICATION_EXPIRY_MINUTES = 10;

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export async function saveOtp(email: string, otp: string) {
  const client = await clientPromise;
  const db = client.db();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await db.collection("otps").updateOne(
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

  const collection = db.collection("otps");

  const record = await collection.findOne({
    email,
    otpHash: hashOtp(otp),
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return false;
  }

  await collection.deleteOne({ _id: record._id });

  return true;
}

export async function createVerificationToken(email: string) {
  const client = await clientPromise;
  const db = client.db();

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashOtp(token);

  const expiresAt = new Date(
    Date.now() + VERIFICATION_EXPIRY_MINUTES * 60 * 1000
  );

  await db.collection("signupVerifications").updateOne(
    { email },
    {
      $set: {
        email,
        tokenHash,
        expiresAt,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return token;
}

export async function consumeVerificationToken(
  email: string,
  token: string
) {
  const client = await clientPromise;
  const db = client.db();

  const tokenHash = hashOtp(token);

  const result = await db.collection("signupVerifications").findOneAndDelete({
    email,
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  return Boolean(result);
}
