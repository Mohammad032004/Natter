"use client";

import {
  Search,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

import type { ChatConversation } from "./chat-types";

type ConversationHeaderProps = {
  conversation: ChatConversation;
};

export default function ConversationHeader({
  conversation,
}: ConversationHeaderProps) {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${conversation.avatarColor}`}
        >
          {conversation.avatar}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {conversation.name}
          </p>

          <p className="text-xs text-slate-500">
            {conversation.online ? "online" : conversation.username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button
          type="button"
          aria-label="Voice call"
          className="hidden rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 sm:block"
        >
          <Phone className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Video call"
          className="hidden rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 sm:block"
        >
          <Video className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Search conversation"
          className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Conversation options"
          className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}