
"use client";

import { useState } from "react";
import Link from "next/link";

type SignupStep = "details" | "verify" | "password" | "complete";

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("details");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function sendOtp() {
    setError("");
    setMessage("");

    if (!name.trim() || !email.trim() || !username.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send verification code.");
        return;
      }

      setStep("verify");
      setMessage("A verification code has been sent to your email.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired verification code.");
        return;
      }

      if (!data.verificationToken) {
        setError("Verification token was not returned by the server.");
        return;
      }

      setVerificationToken(data.verificationToken);
      setStep("password");
      setMessage("Email verified successfully. Create your password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createAccount() {
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password.length > 72) {
      setError("Password must be 72 characters or fewer.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!verificationToken) {
      setError("Your email verification has expired. Please verify again.");
      setStep("details");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
          password,
          verificationToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      setStep("complete");
      setMessage("Your Natter account has been created successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setError("");
    setMessage("");

    if (step === "verify") {
      setStep("details");
    } else if (step === "password") {
      setStep("verify");
    }
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-500/10" />

          <div className="relative z-10">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              natter<span className="text-violet-400">.</span>
            </Link>

            <div className="mt-24 max-w-md">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">
                Your people. Your conversations.
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                A better place
                <br />
                to <span className="text-violet-400">connect.</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/60">
                Join Natter and make conversations that matter.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-sm text-white/40">
            © 2026 Natter
          </div>
        </section>

        {/* Signup panel */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                natter<span className="text-violet-400">.</span>
              </Link>
            </div>

            {step !== "complete" && (
              <>
                <div className="mb-8">
                  <p className="mb-3 text-sm text-violet-300">
                    Step{" "}
                    {step === "details"
                      ? "1"
                      : step === "verify"
                        ? "2"
                        : "3"}{" "}
                    of 3
                  </p>

                  <div className="mb-6 flex gap-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className={`h-1.5 flex-1 rounded-full ${
                          item <=
                          (step === "details"
                            ? 1
                            : step === "verify"
                              ? 2
                              : 3)
                            ? "bg-violet-500"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold">
                    {step === "details"
                      ? "Create your account"
                      : step === "verify"
                        ? "Verify your email"
                        : "Create a password"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {step === "details"
                      ? "Enter your details to get started with Natter."
                      : step === "verify"
                        ? `Enter the verification code sent to ${email}.`
                        : "Choose a strong password to secure your account."}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    {message}
                  </div>
                )}

                {step === "details" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void sendOtp();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Choose a username"
                        autoComplete="username"
                        minLength={3}
                        maxLength={20}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-violet-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Sending code..." : "Continue"}
                    </button>
                  </form>
                )}

                {step === "verify" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void verifyOtp();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Verification code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={(event) =>
                          setOtp(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter 6-digit code"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none transition focus:border-violet-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify email"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtp("");
                        void sendOtp();
                      }}
                      disabled={loading}
                      className="w-full text-sm text-violet-300 hover:text-violet-200 disabled:opacity-60"
                    >
                      Resend verification code
                    </button>
                  </form>
                )}

                {step === "password" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void createAccount();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={72}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-violet-500"
                      />
                      <p className="mt-2 text-xs text-white/40">
                        Use at least 8 characters.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Enter your password again"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-violet-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Creating account..." : "Create account"}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={goBack}
                  disabled={loading || step === "details"}
                  className="mt-5 w-full text-sm text-white/50 transition hover:text-white disabled:invisible"
                >
                  ← Back
                </button>
              </>
            )}

            {step === "complete" && (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-400">
                  ✓
                </div>

                <h2 className="text-3xl font-bold">You’re all set!</h2>

                <p className="mt-3 leading-7 text-white/50">
                  Your Natter account has been created. You can now sign in
                  using your email or username.
                </p>

                <Link
                  href="/login"
                  className="mt-8 block w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500"
                >
                  Continue to login
                </Link>
              </div>
            )}

            {step !== "complete" && (
              <p className="mt-8 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-violet-300 hover:text-violet-200"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
