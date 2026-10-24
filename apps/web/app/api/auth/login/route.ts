import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    // Use a generic error to avoid revealing whether an account exists.
    if (!user || typeof user.passwordHash !== "string") {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Determine the username from the available user fields.
    const username =
      typeof user.username === "string" && user.username.trim()
        ? user.username.trim()
        : typeof user.name === "string" && user.name.trim()
          ? user.name.trim()
          : email.split("@")[0];

    const userId = user._id.toString();
    const userEmail = user.email;

    // Debug field presence without logging private values.
    console.log("[LOGIN] User fields check:", {
      hasId: Boolean(userId),
      hasEmail: typeof userEmail === "string",
      hasUsername: typeof user.username === "string",
      hasName: typeof user.name === "string",
    });

    if (
      !userId ||
      typeof userEmail !== "string" ||
      !userEmail.trim() ||
      !username
    ) {
      console.error("[LOGIN] Required user fields are missing.");

      return NextResponse.json(
        {
          message: "Your account information is incomplete.",
        },
        { status: 500 }
      );
    }

    // Create the secure HTTP-only session cookie.
    await createSession({
      userId,
      email: userEmail,
      username,
    });

    return NextResponse.json({
      message: "Login successful.",
      user: {
        id: userId,
        name: user.name ?? username,
        email: userEmail,
        username,
      },
    });
  } catch (error) {
    console.error("[LOGIN] Login error:", error);

    return NextResponse.json(
      {
        message: "Unable to log in. Please try again.",
      },
      { status: 500 }
    );
  }
}