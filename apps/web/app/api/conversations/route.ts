
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getSession } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "natter";

// GET: Load conversations for the logged-in user.
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid session user ID." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const currentUserId = new ObjectId(session.userId);

    const conversations = await db
      .collection("conversations")
      .find({
        participantIds: currentUserId,
      })
      .sort({ updatedAt: -1 })
      .toArray();

    const usersCollection = db.collection("users");

    const results = await Promise.all(
      conversations.map(async (conversation) => {
        const participantIds = conversation.participantIds as ObjectId[];

        const otherUserId = participantIds.find(
          (id) => id.toString() !== currentUserId.toString()
        );

        const otherUser = otherUserId
          ? await usersCollection.findOne(
              { _id: otherUserId },
              {
                projection: {
                  name: 1,
                  username: 1,
                  email: 1,
                },
              }
            )
          : null;

        return {
          id: conversation._id.toString(),
          otherUser: otherUser
            ? {
                id: otherUser._id.toString(),
                name: otherUser.name,
                username: otherUser.username,
                email: otherUser.email,
              }
            : null,
          lastMessage: conversation.lastMessage ?? "",
          updatedAt: conversation.updatedAt,
          unreadCount: 0,
          isGroup: conversation.isGroup ?? false,
          participantIds: participantIds.map((id) => id.toString()),
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: results,
    });
  } catch (error) {
    console.error("[CONVERSATIONS] GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load conversations.",
      },
      { status: 500 }
    );
  }
}

// POST: Create a direct conversation or return an existing one.
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid session user ID." },
        { status: 401 }
      );
    }

    let body: { participantId?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const participantId = body.participantId;

    if (
      typeof participantId !== "string" ||
      !ObjectId.isValid(participantId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid participant ID.",
          receivedParticipantId: participantId ?? null,
        },
        { status: 400 }
      );
    }

    const currentUserId = new ObjectId(session.userId);
    const otherUserId = new ObjectId(participantId);

    if (currentUserId.equals(otherUserId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot start a conversation with yourself.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const usersCollection = db.collection("users");

    // Find the selected user by their MongoDB ObjectId.
    const otherUser = await usersCollection.findOne({
      _id: otherUserId,
    });

    if (!otherUser) {
      console.error("[CONVERSATIONS] Selected user was not found.", {
        participantId,
        database: DB_NAME,
        collection: "users",
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "User not found. The selected user ID does not match a user in the database.",
          participantId,
        },
        { status: 404 }
      );
    }

    const conversationsCollection = db.collection("conversations");

    // Check whether a direct conversation already exists.
    const existingConversation = await conversationsCollection.findOne({
      isGroup: false,
      participantIds: {
        $all: [currentUserId, otherUserId],
        $size: 2,
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        conversation: {
          id: existingConversation._id.toString(),
          _id: existingConversation._id.toString(),
        },
      });
    }

    // Create a new direct conversation.
    const now = new Date();

    const newConversation = {
      participantIds: [currentUserId, otherUserId],
      isGroup: false,
      lastMessage: "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await conversationsCollection.insertOne(
      newConversation
    );

    return NextResponse.json(
      {
        success: true,
        conversation: {
          id: result.insertedId.toString(),
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CONVERSATIONS] POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create conversation.",
      },
      { status: 500 }
    );
  }
}
