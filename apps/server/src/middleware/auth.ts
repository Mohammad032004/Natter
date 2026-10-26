
import { jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";

export type AuthUser = {
  userId: string;
  email: string;
  username: string;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

const SESSION_COOKIE_NAME = "natter-session";

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be configured and at least 32 characters long.",
    );
  }

  return new TextEncoder().encode(secret);
}

function getCookieValue(
  cookieHeader: string | undefined,
  cookieName: string,
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name === cookieName) {
      return valueParts.join("=");
    }
  }

  return undefined;
}

export async function authenticateSession(
  token: string,
): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.username !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = getCookieValue(
    req.headers.cookie,
    SESSION_COOKIE_NAME,
  );

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  const user = await authenticateSession(token);

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
    return;
  }

  req.user = user;
  next();
}
