
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // The API creates the HTTP-only session cookie.
      // Redirect after successful authentication.
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-white text-[#242424]">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left illustration panel */}
        <section className="relative hidden h-full flex-col overflow-hidden bg-[#f7f8fc] p-8 lg:flex xl:p-10">
          <Link
            href="/"
            className="relative z-10 flex w-fit items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635bff] text-white">
              <MessageCircle size={21} />
            </span>
            Natter
          </Link>

          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-3">
            <Image
              src="/natter.png"
              alt="Abstract 3D illustration for Natter"
              width={1000}
              height={1000}
              priority
              className="h-auto max-h-full w-full max-w-[650px] scale-110 object-contain drop-shadow-xl"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-md text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#242424]">
              Your conversations,
              <br />
              all in one place.
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Connect with your people, share ideas, and keep every
              conversation moving with Natter.
            </p>
          </div>

          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#635bff]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
        </section>

        {/* Right login panel */}
        <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-6 py-4 sm:px-10 lg:px-10 xl:px-16">
          <Link
            href="/"
            className="absolute right-6 top-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#635bff] sm:right-10 lg:right-12"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <Link
              href="/"
              className="mb-8 flex w-fit items-center gap-2 text-xl font-bold tracking-tight lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635bff] text-white">
                <MessageCircle size={21} />
              </span>
              Natter
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#635bff]">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Log in to Natter
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your email address and password to continue to your
                account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
                  />
                </div>

                {/* Forgot Password */}
                <div className="mt-3 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#635bff] transition hover:text-[#5548e8]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
                />
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#635bff] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5548e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Continue with email
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#635bff] transition hover:text-[#5548e8]"
              >
                Create account
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to Natter&apos;s Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
