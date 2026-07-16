"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useVoteStore } from "@/store/voteStore";

type Step = "phone" | "otp";

export default function VerifyPage() {
  const router = useRouter();
  const { setPhone, setVerified, phone: storedPhone } = useVoteStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhoneLocal] = useState(storedPhone || "");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (step !== "otp") return;
    const t = setTimeout(() => otpInputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [step]);

  async function handleSendOTP() {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length < 9) {
      toast.error("Enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPhone(cleaned);
      setOtpCode("");
      setStep("otp");
      setCountdown(60);
      toast.success("Code sent to your phone");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setOtpCode(digits);
  }

  async function handleVerifyOTP(codeOverride?: string) {
    const code = (codeOverride ?? otpCode).trim();
    if (code.length < 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVerified(true);
      toast.success("Verified! Let's vote");
      router.push("/vote");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0) return;
    setOtpCode("");
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCountdown(60);
      toast.success("New code sent");
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="absolute top-6 left-6 font-body text-sm text-champagne/50 hover:text-champagne transition-colors"
      >
        ← Back
      </Link>

      <div className="w-full max-w-md text-center mb-10 animate-enter">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: "rgba(247,240,230,0.96)",
            boxShadow: "0 0 28px rgba(232,200,122,0.2)",
          }}
        >
          <Image src="/itl-logo.png" alt="ITL" width={40} height={40} className="object-contain" />
        </div>
        <p className="font-body text-[0.65rem] uppercase tracking-[0.4em] text-champagne/55 mb-3">
          Invitation to Light
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold italic text-champagne">
          Verify to vote
        </h1>
        <p className="mt-3 font-body text-sm text-ivory-muted">
          One number, one ballot — so every vote is fair.
        </p>
      </div>

      <div className="surface w-full max-w-md p-8 sm:p-10 animate-enter-delay">
        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div>
                <label
                  htmlFor="phone"
                  className="block font-body text-[0.65rem] uppercase tracking-[0.2em] text-champagne/65 mb-2"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhoneLocal(e.target.value)}
                  placeholder="0244 123 456"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  autoFocus
                  className="verify-input"
                />
                <p className="mt-2 text-xs text-ivory/30">Ghana numbers (e.g. 0244 …)</p>
              </div>
              <button className="btn-gold w-full" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending…" : "Send verification code"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <p className="font-body text-sm text-ivory/55 mb-1">Code sent to</p>
                <p className="font-display text-xl font-semibold text-champagne">{phone}</p>
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtpCode("");
                  }}
                  className="mt-2 text-xs text-champagne/50 underline hover:text-champagne"
                >
                  Change number
                </button>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block font-body text-[0.65rem] uppercase tracking-[0.2em] text-champagne/65 mb-3 text-center"
                >
                  Enter 6-digit code
                </label>

                {/* Single field — required for SMS autofill on iOS/Android */}
                <input
                  ref={otpInputRef}
                  id="otp"
                  name="one-time-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && otpCode.length === 6) handleVerifyOTP();
                  }}
                  placeholder="••••••"
                  className="otp-field"
                  aria-label="6-digit verification code"
                />

                {/* Visual digit slots (read-only mirror) */}
                <div className="mt-3 flex gap-2 justify-center" aria-hidden>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`otp-slot ${otpCode[i] ? "otp-slot-filled" : ""} ${
                        otpCode.length === i ? "otp-slot-active" : ""
                      }`}
                    >
                      {otpCode[i] ?? ""}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn-gold w-full"
                onClick={() => handleVerifyOTP()}
                disabled={loading || otpCode.length < 6}
              >
                {loading ? "Verifying…" : "Verify & continue"}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-ivory/30">Resend in {countdown}s</p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-xs text-champagne/50 underline hover:text-champagne"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
