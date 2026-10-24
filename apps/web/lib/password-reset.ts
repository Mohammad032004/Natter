import { createHash, randomBytes } from "crypto";
import clientPromise from "@/lib/mongodb";

const RESET_TOKEN_EXPIRY_MINUTES = 10;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(email: string) {
  const client = await clientPromise;
  const db = client.db();

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await db.collection("passwordResetTokens").updateOne(
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

export async function consumePasswordResetToken(
  email: string,
  token: string
) {
  const client = await clientPromise;
  const db = client.db();

  const tokenHash = hashToken(token);

  const result = await db.collection("passwordResetTokens").findOneAndDelete({
    email,
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  return Boolean(result);
}