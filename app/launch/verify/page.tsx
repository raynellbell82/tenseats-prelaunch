"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { PostSignupLayout, itemVariants } from "@/components/post-signup/post-signup-layout";
import { VerticalTimeline } from "@/components/post-signup/vertical-timeline";

// Headline options considered (tenseats-copy-writer skill):
// Option 1: "Your Seat Is Nearly Ready." — direct, 2nd person, warm table metaphor (selected)
// Option 2: "The Table's Almost Set." — classic, slightly more theatrical
// Option 3: "Almost at the Table." — concise, slight tension
// Option 4: "One Step From the Table." — proximity + anticipation

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
    detail: "Look for a 6-digit code",
    active: true,
  },
  {
    label: "Enter your code",
    detail: "On the verification screen",
    active: false,
  },
  {
    label: "You're in",
    detail: "Welcome to Tenseats",
    active: false,
  },
];

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("otp-verify-email");
    if (!stored) {
      router.push("/launch");
      return;
    }
    setEmail(stored);

    // Restore cooldown from existing otp-sent-ts if recent
    const sentTs = sessionStorage.getItem("otp-sent-ts");
    if (sentTs) {
      const elapsed = Math.floor((Date.now() - parseInt(sentTs, 10)) / 1000);
      const remaining = RESEND_COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) {
        setResendCooldown(remaining);
      }
    }
  }, [router]);

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

  return (
    <PostSignupLayout>
      <div className="text-center space-y-8">
        {/* Green check circle with pulse */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-20 w-20 rounded-full bg-green-500/10 animate-pulse"
              style={{
                animationDuration: "2.5s",
              }}
            />
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Your Seat Is Nearly Ready.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{maskedEmail}</span>.
            Enter it on the next screen to confirm your seat.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="text-left w-48">
            <VerticalTimeline steps={TIMELINE_STEPS} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Link
            href="/verify-email"
            className="inline-block rounded-full bg-foreground text-background px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Enter Verification Code
          </Link>

          {/* Resend link */}
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
                  : "Resend code"}
            </button>
          </div>
        </motion.div>
      </div>
    </PostSignupLayout>
  );
}
