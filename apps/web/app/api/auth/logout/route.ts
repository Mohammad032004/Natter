import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("[LOGOUT] Error:", error);

    return NextResponse.json(
      {
        message: "Unable to log out.",
      },
      {
        status: 500,
      }
    );
  }
}