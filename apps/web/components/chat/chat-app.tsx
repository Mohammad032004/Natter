"use client";

import { useState } from "react";

import ChatList from "./chat-list";
import ConversationPanel from "./conversation-panel";
import { initialConversations } from "./chat-data";

import type {
  ChatConversation,
  ChatMessage,
} from "./chat-types";

export default function ChatApp() {
  const [conversations, setConversations] =
    useState<ChatConversation[]>(initialConversations);

  const [activeChatId, setActiveChatId] = useState<string | null>(
    initialConversations[0]?.id ?? null
  );

  const activeConversation =
    conversations.find((chat) => chat.id === activeChatId) ?? null;

  function handleSendMessage(conversationId: string, text: string) {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          lastMessage: text,
          lastMessageTime: "Just now",
          messages: [...conversation.messages, newMessage],
        };
      })
    );
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      {/* Chat list */}
      <div
        className={`w-full shrink-0 border-r border-slate-200 md:w-[340px] lg:w-[390px] ${
          activeChatId ? "hidden md:block" : "block"
        }`}
      >
        <ChatList
          conversations={conversations}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
        />
      </div>

      {/* Conversation */}
      <div
        className={`min-w-0 flex-1 ${
          activeChatId ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="h-full min-h-0 w-full">
          <ConversationPanel
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatId(null)}
          />
        </div>
      </div>
    </div>
  );
}