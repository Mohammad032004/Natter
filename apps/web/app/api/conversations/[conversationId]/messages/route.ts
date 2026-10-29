
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getSession } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { conversationId } = await params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { message: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "natter");

    const currentUserId = new ObjectId(session.userId);
    const conversationObjectId = new ObjectId(conversationId);

    // Verify that the current user belongs to this conversation.
    const conversation = await db
      .collection("conversations")
      .findOne({
        _id: conversationObjectId,
        participantIds: currentUserId,
      });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found." },
        { status: 404 }
      );
    }

    const messages = await db
      .collection("messages")
      .find({
        conversationId: conversationObjectId,
      })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({
      messages: messages.map((message) => ({
        id: message._id.toString(),
        senderId: message.senderId.toString(),
        text: message.text,
        createdAt: message.createdAt,
        status: message.status ?? "sent",
      })),
    });
  } catch (error) {
    console.error("[MESSAGES] GET error:", error);

    return NextResponse.json(
      { message: "Unable to load messages." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { conversationId } = await params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { message: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const text = body.text;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { message: "Message cannot be empty." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "natter");

    const currentUserId = new ObjectId(session.userId);
    const conversationObjectId = new ObjectId(conversationId);

    // Verify conversation membership.
    const conversation = await db
      .collection("conversations")
      .findOne({
        _id: conversationObjectId,
        participantIds: currentUserId,
      });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found." },
        { status: 404 }
      );
    }

    const now = new Date();
    const trimmedText = text.trim();

    const message = {
      conversationId: conversationObjectId,
      senderId: currentUserId,
      text: trimmedText,
      createdAt: now,
      status: "sent",
    };

    const result = await db
      .collection("messages")
      .insertOne(message);

    // Update the conversation preview and timestamp.
    await db.collection("conversations").updateOne(
      { _id: conversationObjectId },
      {
        $set: {
          lastMessage: trimmedText,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json(
      {
        message: {
          id: result.insertedId.toString(),
          _id: result.insertedId.toString(),
          senderId: currentUserId.toString(),
          text: trimmedText,
          createdAt: now,
          status: "sent",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MESSAGES] POST error:", error);

    return NextResponse.json(
      { message: "Unable to send message." },
      { status: 500 }
    );
  }
}
