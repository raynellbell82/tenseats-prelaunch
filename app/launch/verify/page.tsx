"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { PostSignupLayout, itemVariants } from "@/components/post-signup/post-signup-layout";
import { VerticalTimeline } from "@/components/post-signup/vertical-timeline";

const RESEND_COOLDOWN_SECONDS = 60;

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked = local.length <= 2 ? local[0] + "***" : local[0] + "***";
  return `${masked}@${domain}`;
}

const TIMELINE_STEPS = [
  {
    label: "Check your email",
    detail: "Click the verification link",
    active: true,
  },
  {
    label: "Email verified",
    detail: "Your spot is confirmed",
    active: false,
  },
  {
    label: "You're in",
    detail: "Welcome to Tenseats",
    active: false,
  },
];

function VerifyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = useAction(api.launch.queueActions.verifyEmail);

  // Handle token-based verification from email link
  const tokenId = searchParams.get("id");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!tokenId || !token) {
      // No token params — check sessionStorage for OTP flow
      const stored = sessionStorage.getItem("otp-verify-email");
      if (!stored) {
        router.push("/launch");
        return;
      }
      setEmail(stored);
      return;
    }

    // Token-based verification from email link
    setVerifying(true);
    verifyEmail({
      preRegistrationId: tokenId as Id<"preRegistrations">,
      token,
    })
      .then((result) => {
        if (result.success) {
          setVerified(true);
        } else {
          setError(result.message || "Verification failed");
        }
      })
      .catch(() => {
        setError("Verification failed. Please try again.");
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [tokenId, token, router, verifyEmail]);

  // Restore resend cooldown
  useEffect(() => {
    const sentTs = sessionStorage.getItem("otp-sent-ts");
    if (sentTs) {
      const elapsed = Math.floor((Date.now() - parseInt(sentTs, 10)) / 1000);
      const remaining = RESEND_COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) {
        setResendCooldown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending || !email) return;
    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      sessionStorage.setItem("otp-sent-ts", Date.now().toString());
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // silently fail — user can try again
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email ? maskEmail(email) : "";

  // Token verification in progress
  if (verifying) {
    return (
      <PostSignupLayout>
        <div className="text-center space-y-8">
          <motion.div variants={itemVariants} className="flex justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Verifying...
            </h1>
          </motion.div>
        </div>
      </PostSignupLayout>
    );
  }

  // Verification succeeded
  if (verified) {
    return (
      <PostSignupLayout>
        <div className="text-center space-y-8">
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute h-20 w-20 rounded-full bg-green-500/10 animate-pulse"
                style={{ animationDuration: "2.5s" }}
              />
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              You're In.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your email has been verified and your spot is confirmed.
              We'll notify you when it's time to join.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/launch"
              className="inline-block rounded-full bg-foreground text-background px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Launch Page
            </Link>
          </motion.div>
        </div>
      </PostSignupLayout>
    );
  }

  // Verification error
  if (error) {
    return (
      <PostSignupLayout>
        <div className="text-center space-y-8">
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Verification Failed
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/launch"
              className="inline-block rounded-full bg-foreground text-background px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </Link>
          </motion.div>
        </div>
      </PostSignupLayout>
    );
  }

  // OTP flow (no token params — came from signup form)
  return (
    <PostSignupLayout>
      <div className="text-center space-y-8">
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-20 w-20 rounded-full bg-green-500/10 animate-pulse"
              style={{ animationDuration: "2.5s" }}
            />
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Your Seat Is Nearly Ready.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We sent a verification link to{" "}
            <span className="text-foreground font-medium">{maskedEmail}</span>.
            Click the link in the email to confirm your seat.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="text-left w-48">
            <VerticalTimeline steps={TIMELINE_STEPS} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Didn&apos;t get it?{" "}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-foreground underline underline-offset-2 hover:no-underline transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : isResending
                  ? "Sending..."
                  : "Resend email"}
            </button>
          </div>
        </motion.div>
      </div>
    </PostSignupLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageInner />
    </Suspense>
  );
}
