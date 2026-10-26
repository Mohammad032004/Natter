"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "./message-bubble";
import type { ChatMessage } from "./chat-types";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string;
};

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: hasMounted.current ? "smooth" : "auto",
      block: "end",
    });

    hasMounted.current = true;
  }, [messages]);

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-[#efe7dd] px-3 py-5 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-2">
        <div className="mb-3 flex justify-center">
          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-[11px] text-slate-500 shadow-sm">
            Today
          </span>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}