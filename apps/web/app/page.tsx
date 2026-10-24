
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090d] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <MessageCircle size={22} strokeWidth={2.5} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            natter<span className="text-violet-400">.</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-violet-500 hover:text-white"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          A better way to stay connected
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Conversations that
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            bring us closer.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
          Meet Natter — a simple, private, and meaningful way to
          chat with the people who matter. No phone number needed.
        </p>

        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-4 text-sm font-semibold transition hover:bg-violet-500 active:scale-[0.98]"
          >
            Create your account
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.07]"
          >
            I already have an account
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <ShieldCheck className="mx-auto mb-3 text-violet-400" size={24} />
            <h3 className="font-semibold">Private by design</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Your conversations deserve privacy.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Zap className="mx-auto mb-3 text-violet-400" size={24} />
            <h3 className="font-semibold">Simple & fast</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Connect without unnecessary steps.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Users className="mx-auto mb-3 text-violet-400" size={24} />
            <h3 className="font-semibold">Made for people</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Find friends and start meaningful chats.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-xs text-zinc-600">
        © 2026 Natter. Made for meaningful conversations.
      </footer>
    </main>
  );
}
