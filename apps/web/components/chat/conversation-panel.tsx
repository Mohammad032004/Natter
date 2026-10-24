"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import ConversationHeader from "./conversation-header";
import MessageList from "./message-list";
import MessageComposer from "./message-composer";

import type { ChatConversation } from "./chat-types";

type ConversationPanelProps = {
  conversation: ChatConversation | null;
  onSendMessage: (conversationId: string, text: string) => void;
  onBack: () => void;
};

export default function ConversationPanel({
  conversation,
  onSendMessage,
  onBack,
}: ConversationPanelProps) {
  if (!conversation) {
    return (
      <div className="hidden h-full flex-col items-center justify-center bg-[#f7f7f7] text-center md:flex">
        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
          <MessageCircle className="h-12 w-12 text-emerald-500" />
        </div>

        <h2 className="text-2xl font-light text-slate-700">
          Welcome to Natter
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Select a conversation to start messaging with your friends
          and community.
        </p>

        <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400">
          Your messages are private
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="ml-2 rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          ←
        </button>

        <div className="min-w-0 flex-1">
          <ConversationHeader conversation={conversation} />
        </div>
      </div>

      <MessageList messages={conversation.messages} />

      <MessageComposer
        onSend={(text) => onSendMessage(conversation.id, text)}
      />
    </div>
  );
}