import { Router, type Response } from "express";
import { ObjectId } from "mongodb";

import { connectDatabase } from "../db.js";
import {
  requireAuth,
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

/**
 * GET /api/conversations
 *
 * Get all conversations belonging to the authenticated user.
 * For direct chats, include the other participant's profile.
 */
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const db = await connectDatabase();
    const currentUserId = new ObjectId(userId);

    const conversations = await db
      .collection("conversations")
      .find({
        participantIds: currentUserId,
      })
      .sort({ updatedAt: -1 })
      .toArray();

    const usersCollection = db.collection("users");

    const result = await Promise.all(
      conversations.map(async (conversation) => {
        const participantIds = conversation.participantIds as ObjectId[];

        const otherParticipantId = participantIds.find(
          (participantId) =>
            participantId.toString() !== currentUserId.toString()
        );

        let otherUser = null;

        if (otherParticipantId) {
          const user = await usersCollection.findOne(
            { _id: otherParticipantId },
            {
              projection: {
                name: 1,
                username: 1,
                email: 1,
              },
            }
          );

          if (user) {
            otherUser = {
              id: user._id.toString(),
              name: user.name ?? user.username ?? "Natter user",
              username: user.username ?? "",
              email: user.email ?? "",
            };
          }
        }

        return {
          ...conversation,
          id: conversation._id.toString(),
          otherUser,
        };
      })
    );

    return res.json({
      success: true,
      conversations: result,
    });
  } catch (error) {
    console.error("GET conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load conversations.",
    });
  }
});

/**
 * POST /api/conversations
 *
 * Create or return an existing direct conversation.
 */
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { participantId } = req.body as {
      participantId?: string;
    };

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!participantId || !ObjectId.isValid(participantId)) {
      return res.status(400).json({
        success: false,
        message: "A valid participantId is required.",
      });
    }

    if (participantId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself.",
      });
    }

    const db = await connectDatabase();

    const currentUserId = new ObjectId(userId);
    const otherUserId = new ObjectId(participantId);

    const otherUser = await db.collection("users").findOne({
      _id: otherUserId,
    });

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const conversationsCollection = db.collection("conversations");

    const existingConversation = await conversationsCollection.findOne({
      isGroup: false,
      participantIds: {
        $all: [currentUserId, otherUserId],
      },
    });

    if (existingConversation) {
      return res.json({
        success: true,
        conversation: {
          ...existingConversation,
          id: existingConversation._id.toString(),
        },
      });
    }

    const now = new Date();

    const newConversation = {
      isGroup: false,
      participantIds: [currentUserId, otherUserId],
      createdAt: now,
      updatedAt: now,
      lastMessage: null,
    };

    const insertResult = await conversationsCollection.insertOne(
      newConversation
    );

    return res.status(201).json({
      success: true,
      conversation: {
        ...newConversation,
        _id: insertResult.insertedId,
        id: insertResult.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("POST conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation.",
    });
  }
});

export default router;