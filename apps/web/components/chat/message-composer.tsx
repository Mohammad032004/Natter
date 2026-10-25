
"use client";

import { useState, type FormEvent } from "react";

import {
  Paperclip,
  Smile,
  Mic,
  Send,
} from "lucide-react";

type MessageComposerProps = {
  onSend: (text: string) => void;
};

export default function MessageComposer({
  onSend,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = message.trim();

    if (!text) return;

    onSend(text);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-3 sm:gap-3 sm:px-5"
    >
      <button
        type="button"
        aria-label="Attach file"
        className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Add emoji"
        className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
      >
        <Smile className="h-5 w-5" />
      </button>

      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        aria-label="Message"
        className="h-11 min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:bg-slate-50"
      />

      <button
        type="submit"
        disabled={!message.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {message.trim() ? (
          <Send className="h-4 w-4" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}
