
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { consumeVerificationToken } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, username, password, verificationToken } = body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof verificationToken !== "string"
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // Validate name
    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return NextResponse.json(
        { message: "Name must be between 2 and 80 characters." },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate username
    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 20 ||
      !/^[a-zA-Z0-9_]+$/.test(normalizedUsername)
    ) {
      return NextResponse.json(
        {
          message:
            "Username must be 3–20 characters and contain only letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        { message: "Password must be between 8 and 72 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Ensure email and username are unique
    const existingUser = await users.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return NextResponse.json(
          { message: "An account with this email already exists." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: "This username is already taken." },
        { status: 409 }
      );
    }

    // Consume the verified-email token
    const isVerified = await consumeVerificationToken(
      normalizedEmail,
      verificationToken
    );

    if (!isVerified) {
      return NextResponse.json(
        {
          message:
            "Email verification expired or is invalid. Please verify your email again.",
        },
        { status: 401 }
      );
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the account
    await users.insertOne({
      name: normalizedName,
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Account created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
