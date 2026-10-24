"use client";

import type { ChatConversation } from "./chat-types";

type ChatListItemProps = {
  conversation: ChatConversation;
  active: boolean;
  onClick: () => void;
};

export default function ChatListItem({
  conversation,
  active,
  onClick,
}: ChatListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
        active
          ? "bg-slate-100"
          : "hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${conversation.avatarColor}`}
      >
        {conversation.avatar}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-900">
            {conversation.name}
          </p>

          <span className="shrink-0 text-[11px] text-slate-500">
            {conversation.lastMessageTime}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-500">
            {conversation.lastMessage}
          </p>

          {conversation.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}