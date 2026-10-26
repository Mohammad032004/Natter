
import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectDatabase } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Helper: safely get the conversation ID from Express route params
function getConversationId(id: string | string[]): string | undefined {
  return Array.isArray(id) ? id[0] : id;
}

// GET /api/conversations/:id/messages
// Fetch messages from a conversation
router.get(
  "/:id/messages",
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const conversationId = getConversationId(req.params.id);

      if (!conversationId || !ObjectId.isValid(conversationId)) {
        res.status(400).json({
          success: false,
          message: "Invalid conversation ID",
        });
        return;
      }

      const db = await connectDatabase();
      const currentUserId = new ObjectId(req.user!.userId);
      const conversationObjectId = new ObjectId(conversationId);

      const conversation = await db.collection("conversations").findOne({
        _id: conversationObjectId,
        participantIds: currentUserId,
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      const messages = await db
        .collection("messages")
        .find({ conversationId: conversationObjectId })
        .sort({ createdAt: 1 })
        .toArray();

      res.json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error("Fetch messages error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  }
);

// POST /api/conversations/:id/messages
// Send and save a message
router.post(
  "/:id/messages",
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const conversationId = getConversationId(req.params.id);
      const { text } = req.body as { text?: string };

      if (!conversationId || !ObjectId.isValid(conversationId)) {
        res.status(400).json({
          success: false,
          message: "Invalid conversation ID",
        });
        return;
      }

      if (typeof text !== "string" || !text.trim()) {
        res.status(400).json({
          success: false,
          message: "Message text is required",
        });
        return;
      }

      const trimmedText = text.trim();

      if (trimmedText.length > 5000) {
        res.status(400).json({
          success: false,
          message: "Message cannot exceed 5000 characters",
        });
        return;
      }

      const db = await connectDatabase();
      const currentUserId = new ObjectId(req.user!.userId);
      const conversationObjectId = new ObjectId(conversationId);

      const conversation = await db.collection("conversations").findOne({
        _id: conversationObjectId,
        participantIds: currentUserId,
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      const now = new Date();

      const message = {
        conversationId: conversationObjectId,
        senderId: currentUserId,
        text: trimmedText,
        createdAt: now,
        deliveredTo: [],
        readBy: [currentUserId],
      };

      const result = await db.collection("messages").insertOne(message);

      await db.collection("conversations").updateOne(
        { _id: conversationObjectId },
        {
          $set: {
            lastMessage: {
              _id: result.insertedId,
              senderId: currentUserId,
              text: trimmedText,
              createdAt: now,
            },
            updatedAt: now,
          },
        }
      );

      res.status(201).json({
        success: true,
        message: {
          _id: result.insertedId,
          ...message,
        },
      });
    } catch (error) {
      console.error("Send message error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to send message",
      });
    }
  }
);

// PATCH /api/conversations/:id/read
// Mark messages from other participants as read
router.patch(
  "/:id/read",
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const conversationId = getConversationId(req.params.id);

      if (!conversationId || !ObjectId.isValid(conversationId)) {
        res.status(400).json({
          success: false,
          message: "Invalid conversation ID",
        });
        return;
      }

      const db = await connectDatabase();
      const currentUserId = new ObjectId(req.user!.userId);
      const conversationObjectId = new ObjectId(conversationId);

      const conversation = await db.collection("conversations").findOne({
        _id: conversationObjectId,
        participantIds: currentUserId,
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      const result = await db.collection("messages").updateMany(
        {
          conversationId: conversationObjectId,
          senderId: { $ne: currentUserId },
          readBy: { $ne: currentUserId },
        },
        {
          $addToSet: {
            readBy: currentUserId,
          },
        }
      );

      res.json({
        success: true,
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Mark messages as read error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to mark messages as read",
      });
    }
  }
);

export default router;
