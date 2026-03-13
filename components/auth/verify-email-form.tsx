"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VerifyEmailFormProps {
  email: string;
  initialCode?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const COOLDOWN_STORAGE_KEY = "otp-resend-ts";
const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const OTP_EXPIRY_STORAGE_KEY = "otp-sent-ts";
const MAX_ATTEMPTS = 3;

export function VerifyEmailForm({ email, initialCode }: VerifyEmailFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [expiryCountdown, setExpiryCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [expired, setExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask email: user@example.com -> u***@example.com
  const maskedEmail = email.replace(/^(.)[^@]*/, "$1***");

  // Format countdown as M:SS
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize OTP expiry timestamp on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(OTP_EXPIRY_STORAGE_KEY);
    if (!stored) {
      sessionStorage.setItem(OTP_EXPIRY_STORAGE_KEY, Date.now().toString());
    }
  }, []);

  // Restore resend cooldown from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (stored) {
      const elapsed = Math.floor((Date.now() - parseInt(stored, 10)) / 1000);
      const remaining = RESEND_COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) {
        setResendCooldown(remaining);
      } else {
        sessionStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    }
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem(COOLDOWN_STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // OTP expiry countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem(OTP_EXPIRY_STORAGE_KEY);
      if (!stored) return;

      const sentTimestamp = parseInt(stored, 10);
      const elapsed = Math.floor((Date.now() - sentTimestamp) / 1000);
      const remaining = OTP_EXPIRY_SECONDS - elapsed;

      if (remaining <= 0) {
        setExpiryCountdown(0);
        setExpired(true);
        clearInterval(interval);
      } else {
        setExpiryCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const submitOtp = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH) return;
      setVerifying(true);
      setError(null);

      const { error: verifyError } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (verifyError) {
        setVerifying(false);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Trigger shake animation
        setShaking(true);
        setTimeout(() => setShaking(false), 500);

        // Check if max attempts reached
        if (newAttempts >= MAX_ATTEMPTS) {
          // Auto-resend new code
          setError("Too many failed attempts. Sending new code...");
          setOtp(Array(OTP_LENGTH).fill(""));
          setAttempts(0);

          // Trigger auto-resend
          setTimeout(async () => {
            const { error: resendError } =
              await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "email-verification",
              });

            if (!resendError) {
              setError("New code sent. Please try again.");
              sessionStorage.setItem(OTP_EXPIRY_STORAGE_KEY, Date.now().toString());
              setExpiryCountdown(OTP_EXPIRY_SECONDS);
              setExpired(false);
              setResendCooldown(RESEND_COOLDOWN_SECONDS);
              sessionStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
            } else {
              setError("Failed to send new code. Please try manual resend.");
            }
          }, 1000);

          inputRefs.current[0]?.focus();
          return;
        }

        // Map error codes to user-friendly messages
        const msg = verifyError.message?.toLowerCase() || "";
        const attemptsRemaining = MAX_ATTEMPTS - newAttempts;

        if (msg.includes("expired")) {
          setError("Code expired. Please request a new one.");
        } else if (msg.includes("invalid") || msg.includes("incorrect")) {
          setError(`Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`);
        } else {
          setError(verifyError.message || "Verification failed. Please try again.");
        }

        // Clear inputs so user can retry
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      // Success - show animation then redirect
      setVerified(true);
      setTimeout(() => {
        router.push("/feed");
      }, 1500);
    },
    [email, router, attempts]
  );

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < OTP_LENGTH - 1) {
      // Auto-advance to next input
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit is entered
    if (digit && index === OTP_LENGTH - 1) {
      const code = newOtp.join("");
      if (code.length === OTP_LENGTH) {
        submitOtp(code);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace when current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setError(null);

    // Focus the next empty input or the last one
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();

    // Auto-submit if full code pasted
    if (pasted.length === OTP_LENGTH) {
      submitOtp(pasted);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendStatus("sending");

    const { error: resendError } =
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

    if (resendError) {
      setResendStatus("error");
      setTimeout(() => setResendStatus("idle"), 3000);
    } else {
      setResendStatus("sent");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      sessionStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());

      // Reset expiry countdown with new timestamp
      sessionStorage.setItem(OTP_EXPIRY_STORAGE_KEY, Date.now().toString());
      setExpiryCountdown(OTP_EXPIRY_SECONDS);
      setExpired(false);
      setAttempts(0);

      setTimeout(() => setResendStatus("idle"), 3000);
    }
  };

  // Auto-fill from URL param (initialCode)
  useEffect(() => {
    if (initialCode && initialCode.length === OTP_LENGTH) {
      const digits = initialCode.split("");
      setOtp(digits);
      submitOtp(initialCode);
    }
  }, [initialCode, submitOtp]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Verify your email
        </h1>
        <p className="text-muted-foreground mt-2">
          Code sent to {maskedEmail}
        </p>
      </div>

      {verified ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle
            className="h-16 w-16 text-green-500 animate-zoom-in-check"
          />
          <p className="text-lg font-medium text-green-500">Email verified!</p>
        </div>
      ) : (
        <>
          <div className={shaking ? "animate-shake" : ""}>
            <div className="flex justify-center gap-2">
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  autoFocus={i === 0}
                  disabled={verifying || expired}
                  className={`h-14 w-12 rounded-md border ${
                    error ? "border-destructive" : "border-input"
                  } bg-background text-center text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50`}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            {expired ? (
              <p className="text-sm text-destructive font-medium">
                Code expired. Send a new one?
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {formatCountdown(expiryCountdown)} remaining
              </p>
            )}
          </div>

          {verifying && (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-4">
            {expired ? (
              <Button
                onClick={handleResend}
                disabled={
                  resendCooldown > 0 ||
                  resendStatus === "sending" ||
                  verifying
                }
                className="w-full"
              >
                {resendStatus === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send new code"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleResend}
                disabled={
                  resendCooldown > 0 ||
                  resendStatus === "sending" ||
                  verifying
                }
                variant="secondary"
                className="w-full"
              >
                {resendStatus === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : resendStatus === "sent" ? (
                  "Code sent!"
                ) : resendStatus === "error" ? (
                  "Failed to send. Try again."
                ) : resendCooldown > 0 ? (
                  `Resend code (${resendCooldown}s)`
                ) : (
                  "Resend code"
                )}
              </Button>
            )}

            <div className="text-center">
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Wrong email? Sign up again
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
