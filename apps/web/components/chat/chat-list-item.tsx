
"use client";

import {
  CheckCheck,
  Users,
  Star,
} from "lucide-react";

import type { ChatConversation } from "./chat-types";

type ChatListItemProps = {
  conversation: ChatConversation;
  active: boolean;
  onClick: () => void;
  onToggleFavorite: (id: string) => void;
};

export default function ChatListItem({
  conversation,
  active,
  onClick,
  onToggleFavorite,
}: ChatListItemProps) {
  const isGroup =
    conversation.isGroup ??
    (conversation.id.startsWith("chat-4") ||
      conversation.username === "web-development");

  const isOwnLastMessage =
    conversation.messages.at(-1)?.senderId === "me";

  const isFavorite = conversation.isFavorite === true;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={active}
      className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200 ${
        active
          ? "bg-emerald-50/80"
          : "hover:bg-slate-50 active:scale-[0.99]"
      }`}
    >
      {/* Active indicator */}
      {active && (
        <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-full bg-emerald-500" />
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`flex h-[46px] w-[46px] items-center justify-center rounded-2xl text-sm font-bold shadow-sm ring-1 ring-black/[0.03] transition ${
            conversation.avatarColor
          } ${active ? "rounded-xl" : "group-hover:rounded-xl"}`}
        >
          {isGroup ? (
            <Users className="h-[19px] w-[19px]" />
          ) : (
            conversation.avatar
          )}
        </div>

        {/* Online indicator */}
        {conversation.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-emerald-500" />
        )}
      </div>

      {/* Conversation details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-[13px] transition ${
              active
                ? "font-bold text-slate-900"
                : "font-semibold text-slate-800"
            }`}
          >
            {conversation.name}
          </p>

          <span
            className={`shrink-0 text-[10px] ${
              conversation.unreadCount > 0
                ? "font-semibold text-emerald-600"
                : "font-medium text-slate-400"
            }`}
          >
            {conversation.lastMessageTime}
          </span>
        </div>

        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {isOwnLastMessage && (
              <span className="shrink-0 text-slate-400">
                <CheckCheck className="h-3.5 w-3.5" />
              </span>
            )}

            <p
              className={`truncate text-xs ${
                conversation.unreadCount > 0
                  ? "font-medium text-slate-700"
                  : "text-slate-500"
              }`}
            >
              {conversation.lastMessage}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Favorite button */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(conversation.id);
              }}
              aria-label={
                isFavorite
                  ? `Remove ${conversation.name} from favorites`
                  : `Add ${conversation.name} to favorites`
              }
              aria-pressed={isFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                isFavorite
                  ? "text-amber-500 hover:bg-amber-50"
                  : "text-slate-300 opacity-0 hover:bg-amber-50 hover:text-amber-500 group-hover:opacity-100 focus:opacity-100"
              }`}
            >
              <Star
                className="h-4 w-4"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>

            {/* Unread count */}
            {conversation.unreadCount > 0 && (
              <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-500/20">
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
