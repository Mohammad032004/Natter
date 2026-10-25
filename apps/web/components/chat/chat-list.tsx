"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Archive,
  MessageCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ChatListItem from "./chat-list-item";
import type { ChatConversation } from "./chat-types";

type ChatListProps = {
  conversations: ChatConversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

const filters = ["All", "Unread", "Favorites", "Groups"] as const;

type Filter = (typeof filters)[number];

export default function ChatList({
  conversations,
  activeChatId,
  onSelectChat,
  onToggleFavorite,
}: ChatListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.name.toLowerCase().includes(normalizedSearch) ||
        conversation.username.toLowerCase().includes(normalizedSearch) ||
        conversation.lastMessage.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && conversation.unreadCount > 0) ||
        (filter === "Favorites" && conversation.isFavorite === true) ||
        (filter === "Groups" &&
          (conversation.isGroup === true ||
            conversation.id.startsWith("chat-4") ||
            conversation.username === "web-development"));

      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  const unreadCount = useMemo(
    () =>
      conversations.filter((conversation) => conversation.unreadCount > 0)
        .length,
    [conversations]
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
            <MessageCircle className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Natter
            </h1>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Messages & conversations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="New chat"
            title="New chat"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-95"
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="More options"
            title="More options"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <MoreVertical className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-4">
        <div className="group relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-500" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="h-11 w-full rounded-2xl border border-transparent bg-slate-50 pl-10 pr-10 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 hover:bg-slate-100/80 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => {
          const selected = filter === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={selected}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                selected
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "border border-slate-200/80 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="More filters"
          title="More filters"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <ChevronDown className="ml-0.5 h-3 w-3" />
        </button>
      </div>

      {/* Section heading */}
      <div className="flex items-center justify-between px-5 pb-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Messages
        </h2>

        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
          {filteredConversations.length}
        </span>
      </div>

      {/* Archived */}
      <button
        type="button"
        className="group flex items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
          <Archive className="h-[17px] w-[17px]" />
        </div>

        <span className="text-[13px] font-medium text-slate-600">
          Archived
        </span>

        <span className="ml-auto text-[11px] font-medium text-slate-400">
          4
        </span>
      </button>

      {/* Conversation list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1">
        {filteredConversations.length > 0 ? (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <ChatListItem
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeChatId}
                onClick={() => onSelectChat(conversation.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              No conversations found
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {filter === "Unread"
                ? "You're all caught up."
                : filter === "Favorites"
                  ? "You haven't favorited any conversations yet."
                  : filter === "Groups"
                    ? "No group conversations found."
                    : "Try another name or search term."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-[11px] font-medium text-slate-500">
            You're connected
          </span>
        </div>

        <span className="text-[10px] font-medium text-slate-400">
          {unreadCount} unread
        </span>
      </footer>
    </section>
  );
}