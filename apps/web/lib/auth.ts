import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "natter-session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be configured and contain at least 32 characters."
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Create a JWT and store it in an HTTP-only cookie.
 */
export async function createSession({
  userId,
  email,
  username,
}: SessionPayload): Promise<void> {
  if (
    !userId.trim() ||
    !email.trim() ||
    !username.trim()
  ) {
    throw new Error("Cannot create a session with incomplete user data.");
  }

  const secret = getSessionSecret();

  const token = await new SignJWT({
    email,
    username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  console.log("[AUTH] Session created successfully.");
}

/**
 * Read and validate the session cookie.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    console.log("[AUTH] Session cookie exists:", Boolean(token));

    if (!token) {
      return null;
    }

    const secret = getSessionSecret();

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    const userId = payload.sub;
    const email = payload.email;
    const username = payload.username;

    console.log("[AUTH] Payload field check:", {
      hasUserId: typeof userId === "string",
      hasEmail: typeof email === "string",
      hasUsername: typeof username === "string",
      emailIsNonEmpty:
        typeof email === "string" && email.trim().length > 0,
      usernameIsNonEmpty:
        typeof username === "string" && username.trim().length > 0,
    });

    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      !userId.trim() ||
      !email.trim() ||
      !username.trim()
    ) {
      console.error("[AUTH] Invalid session payload.");
      return null;
    }

    const session: SessionPayload = {
      userId,
      email,
      username,
    };

    console.log("[AUTH] Session validated successfully.");

    return session;
  } catch (error) {
    console.error("[AUTH] Session verification failed:", error);
    return null;
  }
}

/**
 * Delete the session cookie.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);

  console.log("[AUTH] Session deleted.");
}