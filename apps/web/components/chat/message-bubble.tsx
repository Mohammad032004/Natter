
"use client";

import { Check, CheckCheck } from "lucide-react";

import type { ChatMessage } from "./chat-types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isMine = message.senderId === "me";

  return (
    <div
      className={`flex w-full ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 shadow-sm sm:max-w-[75%] ${
          isMine
            ? "rounded-tr-sm bg-[#d9fdd3] text-slate-900"
            : "rounded-tl-sm bg-white text-slate-900"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.text}
        </p>

        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-slate-500">
            {message.time}
          </span>

          {isMine && (
            <span
              aria-label={`Message ${message.status ?? "sent"}`}
              className={
                message.status === "read"
                  ? "text-blue-500"
                  : "text-slate-400"
              }
            >
              {message.status === "sent" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
