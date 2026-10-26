
import type { Socket } from "socket.io";
import {
  authenticateSession,
  type AuthUser,
} from "../middleware/auth.js";

export type AuthenticatedSocket = Socket & {
  data: {
    user: AuthUser;
  };
};

export async function authenticateSocket(
  socket: Socket,
  next: (error?: Error) => void,
): Promise<void> {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    const cookieValue = cookieHeader
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("natter-session="))
      ?.slice("natter-session=".length);

    if (!cookieValue) {
      return next(new Error("Authentication required."));
    }

    const token = decodeURIComponent(cookieValue);
    const user = await authenticateSession(token);

    if (!user) {
      return next(new Error("Invalid or expired session."));
    }

    socket.data.user = user;

    next();
  } catch {
    next(new Error("Socket authentication failed."));
  }
}
