"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Archive,
} from "lucide-react";

import ChatListItem from "./chat-list-item";
import type { ChatConversation } from "./chat-types";

type ChatListProps = {
  conversations: ChatConversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
};

const filters = ["All", "Unread", "Favorites", "Groups"] as const;

type Filter = (typeof filters)[number];

export default function ChatList({
  conversations,
  activeChatId,
  onSelectChat,
}: ChatListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.name.toLowerCase().includes(search.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && conversation.unreadCount > 0) ||
        (filter === "Favorites" && conversation.id === "chat-1") ||
        (filter === "Groups" && conversation.id.startsWith("chat-4"));

      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <h1 className="text-xl font-bold text-emerald-600">
          Natter
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="New chat"
            className="rounded-full bg-emerald-500 p-2.5 text-white transition hover:bg-emerald-600"
          >
            <Plus className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="More options"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search or start a new chat"
            className="h-10 w-full rounded-full bg-slate-100 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-slate-50 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === item
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          aria-label="More filters"
          className="shrink-0 rounded-full border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Archived */}
      <button
        type="button"
        className="flex items-center gap-4 px-6 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50"
      >
        <Archive className="h-4 w-4" />
        <span>Archived</span>
        <span className="ml-auto text-xs text-slate-400">4</span>
      </button>

      {/* Conversations */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ChatListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeChatId}
              onClick={() => onSelectChat(conversation.id)}
            />
          ))
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-slate-500">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </section>
  );
}