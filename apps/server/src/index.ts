
import "dotenv/config";

import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";

import conversationsRouter from "./routes/conversations.js";
import messagesRouter from "./routes/messages.js";
import { authenticateSocket } from "./socket/auth.js";

const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured.");
}

if (!MONGODB_DB) {
  throw new Error("MONGODB_DB is not configured.");
}

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// API routes
app.use("/api/conversations", conversationsRouter);
app.use("/api/conversations", messagesRouter);

// Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

// MongoDB connection
const mongoClient = new MongoClient(MONGODB_URI);

async function startServer() {
  await mongoClient.connect();

  const db = mongoClient.db(MONGODB_DB);

  console.log("✅ Connected to MongoDB");

  // Health check
  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      message: "Natter server is running",
    });
  });

  // Authenticate every Socket.IO connection
  io.use(authenticateSocket);

  // Handle authenticated connections
  io.on("connection", (socket) => {
    const user = socket.data.user;

    console.log("🔌 Authenticated user connected:", user.username);

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", user.username);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Natter server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Failed to start Natter server:", error);
  process.exit(1);
});
