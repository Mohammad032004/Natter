
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  User,
  Mail,
  AtSign,
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Email OTP integration will be added next.
    alert(`Continue with email verification: ${email}`);
  }

  return (
    <main className="h-screen overflow-hidden bg-white text-[#242424]">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left illustration panel */}
        <section className="relative hidden h-full overflow-hidden bg-[#b5dce2] lg:flex lg:flex-col lg:justify-between lg:p-8 xl:p-10">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#c5e7e9] via-[#b5dce2] to-[#91cbd5]" />

          {/* Branding and introduction */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#4d9eac]">
                <MessageCircle size={24} />
              </div>

              <span className="text-2xl font-bold tracking-tight text-[#2d6570]">
                natter.
              </span>
            </Link>

            <h2 className="mt-8 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
              Conversations that bring us closer.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 xl:text-base">
              A simple, private, and meaningful way to connect with
              the people who matter.
            </p>
          </div>

          {/* 3D illustration */}
          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-3">
            <Image
                src="/natter.png"
                alt="Abstract 3D illustration for Natter"
                width={1000}
                height={1000}
                priority
                className="h-auto max-h-full w-full max-w-[750px] scale-125 object-contain drop-shadow-xl"
            />
            </div>
          {/* Footer */}
          <p className="relative z-10 text-xs text-white/70 xl:text-sm">
            Your conversations. Your people. Your space.
          </p>
        </section>

        {/* Right account creation panel */}
        <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-6 py-4 sm:px-10 lg:px-10 xl:px-16">
          {/* Back to home */}
          <div className="absolute right-6 top-5 sm:right-8">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-[#4d9eac]"
            >
              Back to home
            </Link>
          </div>

          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7fc2ce] text-white">
                <MessageCircle size={22} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                natter.
              </span>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#65aebb]">
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create an account
              </h1>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Join Natter and start connecting with your people.
              </p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#7fc2ce] focus:ring-4 focus:ring-[#7fc2ce]/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#7fc2ce] focus:ring-4 focus:ring-[#7fc2ce]/15"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>

                <div className="relative">
                  <AtSign
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    autoComplete="username"
                    minLength={3}
                    pattern="[A-Za-z0-9_]+"
                    title="Use letters, numbers, and underscores only."
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#7fc2ce] focus:ring-4 focus:ring-[#7fc2ce]/15"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Your unique identity on Natter.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7fc2ce] py-3 text-sm font-semibold text-white transition hover:bg-[#68b3c0] active:scale-[0.99]"
              >
                Continue with email
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs text-gray-400">OR</span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#5ca6b3] transition hover:text-[#3d8795]"
              >
                Log in
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to Natter&apos;s Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
