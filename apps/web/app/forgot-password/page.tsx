
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function requestOtp() {
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send the reset code.");
        return;
      }

      setEmail(normalizedEmail);
      setMessage(data.message);
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired code.");
        return;
      }

      setResetToken(data.resetToken);
      setMessage("");
      setStep("password");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to reset your password.");
        return;
      }

      setMessage(data.message);
      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10";

  const buttonClass =
    "flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080d] px-4 py-10 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            {step === "email" && <Mail size={25} />}
            {step === "otp" && <ShieldCheck size={25} />}
            {step === "password" && <LockKeyhole size={25} />}
            {step === "success" && <CheckCircle2 size={25} />}
          </div>

          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Natter Account
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {step === "email" && "Forgot password?"}
              {step === "otp" && "Verify your email"}
              {step === "password" && "Create new password"}
              {step === "success" && "Password updated"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/55">
              {step === "email" &&
                "Enter the email address associated with your account. We'll send you a verification code."}
              {step === "otp" &&
                `Enter the 6-digit code sent to ${email}.`}
              {step === "password" &&
                "Choose a strong new password for your Natter account."}
              {step === "success" &&
                "Your password has been changed successfully. You can now log in with your new password."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && step !== "success" && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          {step === "email" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                requestOtp();
              }}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className={`${inputClass} pl-11`}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className={buttonClass}>
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? "Sending code..." : "Send verification code"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                verifyOtp();
              }}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Verification code
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className={`${inputClass} text-center text-xl tracking-[0.4em]`}
                  autoComplete="one-time-code"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className={buttonClass}>
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? "Verifying..." : "Verify code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setError("");
                  setMessage("");
                  setStep("email");
                }}
                className="w-full text-sm text-white/50 transition hover:text-white"
              >
                Change email address
              </button>
            </form>
          )}

          {step === "password" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                resetPassword();
              }}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  New password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-12`}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter new password"
                    className={`${inputClass} pr-12`}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-white/40">
                Use at least 8 characters. A mix of letters, numbers, and
                symbols is recommended.
              </p>

              <button type="submit" disabled={loading} className={buttonClass}>
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? "Updating password..." : "Reset password"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>

              <Link href="/login" className={buttonClass}>
                Continue to login
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Secure password recovery · Natter
        </p>
      </div>
    </main>
  );
}
