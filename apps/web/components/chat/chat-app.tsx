
"use client";

import { useCallback, useEffect, useState } from "react";

import ChatList from "./chat-list";
import ConversationPanel from "./conversation-panel";

import type {
  ChatConversation,
  ChatMessage,
} from "./chat-types";

type ChatAppProps = {
  currentUserId: string;
};

type ApiConversation = {
  _id?: string;
  id?: string;
  otherUser?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
  } | null;
  lastMessage?: string;
  updatedAt?: string;
  unreadCount?: number;
  isGroup?: boolean;
  participantIds?: string[];
};

type ApiMessage = {
  _id?: string;
  id?: string;
  senderId: string;
  text: string;
  createdAt?: string;
  status?: "sent" | "delivered" | "read";
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function formatMessageTime(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatConversationTime(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapMessage(message: ApiMessage): ChatMessage {
  return {
    id: message.id ?? message._id ?? crypto.randomUUID(),
    senderId: message.senderId,
    text: message.text,
    time: formatMessageTime(message.createdAt),
    status: message.status ?? "sent",
  };
}

function mapConversation(
  conversation: ApiConversation
): ChatConversation {
  const otherUser = conversation.otherUser;

  const name =
    otherUser?.name ??
    otherUser?.username ??
    otherUser?.email ??
    "Unknown user";

  return {
    id: conversation.id ?? conversation._id ?? "",
    name,
    username: otherUser?.username ?? "",
    avatar: name.charAt(0).toUpperCase(),
    avatarColor: "bg-emerald-500",
    online: false,
    lastMessage: conversation.lastMessage ?? "",
    lastMessageTime: formatConversationTime(
      conversation.updatedAt
    ),
    unreadCount: conversation.unreadCount ?? 0,
    messages: [],
    isFavorite: false,
    isGroup: conversation.isGroup ?? false,
  };
}

export default function ChatApp({
  currentUserId,
}: ChatAppProps) {
  const [conversations, setConversations] =
    useState<ChatConversation[]>([]);

  const [activeChatId, setActiveChatId] =
    useState<string | null>(null);

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  const activeConversation =
    conversations.find((chat) => chat.id === activeChatId) ?? null;

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(
        `${API_URL}/api/conversations`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Failed to load conversations"
        );
      }

      const apiConversations: ApiConversation[] =
        data.conversations ?? [];

      const mappedConversations =
        apiConversations.map(mapConversation);

      setConversations(mappedConversations);

      setActiveChatId((current) => {
        if (
          current &&
          mappedConversations.some(
            (conversation) => conversation.id === current
          )
        ) {
          return current;
        }

        return mappedConversations[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Conversation loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load conversations"
      );
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (!activeChatId) return;

    let cancelled = false;

    async function loadMessages() {
      try {
        setLoadingMessages(true);

        const response = await fetch(
          `${API_URL}/api/conversations/${activeChatId}/messages`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ?? "Failed to load messages"
          );
        }

        const apiMessages: ApiMessage[] =
          data.messages ?? [];

        const mappedMessages = apiMessages.map(mapMessage);

        if (cancelled) return;

        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === activeChatId
              ? {
                  ...conversation,
                  messages: mappedMessages,
                }
              : conversation
          )
        );
      } catch (err) {
        console.error("Message loading error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load messages"
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [activeChatId]);

  function handleToggleFavorite(conversationId: string) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              isFavorite: !conversation.isFavorite,
            }
          : conversation
      )
    );
  }

  async function handleSendMessage(
    conversationId: string,
    text: string
  ) {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    try {
      setError(null);

      const response = await fetch(
        `${API_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: trimmedText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Failed to send message"
        );
      }

      const savedMessage: ApiMessage =
        data.message ?? data;

      const newMessage = mapMessage(savedMessage);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: newMessage.text,
                lastMessageTime: "Just now",
                messages: [
                  ...conversation.messages,
                  newMessage,
                ],
              }
            : conversation
        )
      );
    } catch (err) {
      console.error("Message sending error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message"
      );
    }
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      {/* Chat list */}
      <div
        className={`w-full shrink-0 border-r border-slate-200 md:w-[340px] lg:w-[390px] ${
          activeChatId ? "hidden md:block" : "block"
        }`}
      >
        {loadingConversations ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Loading conversations...
          </div>
        ) : (
          <ChatList
            conversations={conversations}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Conversation */}
      <div
        className={`min-w-0 flex-1 ${
          activeChatId ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="h-full min-h-0 w-full">
          {error && (
            <div
              role="alert"
              className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {loadingMessages && activeChatId ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading messages...
            </div>
          ) : (
            <ConversationPanel
              conversation={activeConversation}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveChatId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
