"use client";

// Role-specific headlines (tenseats-copy-writer skill — Pattern 7: Poetic Fragment + Pattern 5: Hospitality-Coded Welcome):
//
// Chef:
//   Option 1: "The kitchen is yours." — Poetic Fragment, domain ownership, 4 words (SELECTED)
//   Option 2: "Your kitchen, your rules." — Fragment Pairing, possessive, 4 words
//   Option 3: "Step behind the line." — Hospitality-Coded, insider chef language (the pass/line), 5 words
//   Option 4: "The pass is yours." — Poetic Fragment, expediting station metaphor, 4 words
//
// Mixologist:
//   Option 1: "The bar is set." — Poetic Fragment, double meaning (ready + high standard), 4 words (SELECTED)
//   Option 2: "Your bar. Your pour." — Fragment Pairing, 4 words
//   Option 3: "The well is yours." — Insider cocktail language (well = bar equipment area), 4 words
//   Option 4: "Shake up something new." — Hospitality-Coded imperative, 4 words
//
// Creator:
//   Option 1: "The spotlight is on." — Poetic Fragment, double meaning (on you / switched on), 4 words (SELECTED)
//   Option 2: "Your stage. Your story." — Fragment Pairing, 4 words
//   Option 3: "The lens is yours." — Photography/creator metaphor, 4 words
//   Option 4: "Create what others haven't seen." — Category Transcendence variant, 5 words
//
// Venue Host:
//   Option 1: "The doors are open." — Poetic Fragment, spatial hospitality metaphor, 4 words (SELECTED)
//   Option 2: "Your venue. Your terms." — Fragment Pairing, 4 words
//   Option 3: "Welcome your guests." — Hospitality-Coded imperative, 3 words
//   Option 4: "The reservation book is yours." — Hospitality-coded, 5 words
//
// Body copy (shared):
//   Option 1: "You're the reason Tenseats exists. Start building your presence — the community is waiting." (Pattern 4)
//   Option 2: "You're in the community now — the side of the table where the food gets made. We'll be in touch when the platform opens." (Pattern 5, SELECTED)
//   Option 3: "You're already part of what's building. The platform opens soon — here's how to be ready when it does." (Pattern 3)
//   Option 4: "You made it to the other side of the table. Set up your presence — the platform is almost open." (Pattern 5)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  PostSignupLayout,
  itemVariants,
} from "@/components/post-signup/post-signup-layout";
import { VerticalTimeline } from "@/components/post-signup/vertical-timeline";
import { SocialLinks } from "@/components/post-signup/social-links";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SUPPORT_EMAIL = "supportteams@tenseats.io";

const ROLE_HEADLINES: Record<string, string> = {
  chef: "The kitchen is yours.",
  mixologist: "The bar is set.",
  creator: "The spotlight is on.",
  venueHost: "The doors are open.",
};

const DEFAULT_HEADLINE = "The table is yours.";

export default function VendorSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const role = useQuery(
    api.launch.queue.getUserRole,
    session?.user?.emailVerified ? {} : "skip",
  );

  const stripeStatus = useQuery(
    api.launch.stripeConnect.getStripeConnectStatus,
    session?.user?.emailVerified ? {} : "skip",
  );

  useEffect(() => {
    if (isPending) return;
    if (!session || !session.user.emailVerified) {
      router.push("/launch");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    // Clean up stripe_connect query param after return from Stripe
    if (searchParams.get("stripe_connect") === "complete") {
      const url = new URL(window.location.href);
      url.searchParams.delete("stripe_connect");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  const handleStripeConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setConnecting(false);
    }
  };

  if (isPending) return null;
  if (!session || !session.user.emailVerified) return null;

  const headline =
    role && ROLE_HEADLINES[role] ? ROLE_HEADLINES[role] : DEFAULT_HEADLINE;

  const isStripeConnected = stripeStatus?.accountId != null;

  const stripeAction = isStripeConnected ? (
    // Connected state: green checkmark + label
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
        Stripe Connected
      </span>
    </div>
  ) : (
    // Not connected: original button
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleStripeConnect}
        disabled={connecting}
        className="text-xs px-3 py-1.5 rounded border border-muted-foreground/30 text-muted-foreground hover:border-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
      >
        {connecting ? "Connecting..." : "Connect Stripe"}
      </button>
      <span className="text-xs text-muted-foreground/60">
        Optional — you can do this later
      </span>
    </div>
  );

  const timelineSteps = [
    {
      label: "Connect Stripe Express",
      detail: "Accept payments when you're ready",
      active: true,
      action: stripeAction,
    },
    {
      label: "Add us to your contacts",
      detail: SUPPORT_EMAIL,
      active: true,
    },
    {
      label: "Explore soon",
      detail: "Something's cooking",
      active: false,
    },
  ];

  return (
    <PostSignupLayout>
      <div className="text-center space-y-8">
        {/* Green check circle with pulse */}
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

        {/* Role-specific headline + body copy */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You&apos;re in the community now — the side of the table where the
            food gets made. We&apos;ll be in touch when the platform opens.
          </p>
        </motion.div>

        {/* Vertical timeline + click-to-copy */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <div className="text-left w-64">
            <VerticalTimeline steps={timelineSteps} />
          </div>
          {/* Click-to-copy for support email */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className={copied ? "text-green-500" : ""}>
              {copied ? "Copied!" : `Copy ${SUPPORT_EMAIL}`}
            </span>
          </button>
        </motion.div>

        {/* Zoho One recommendation card */}
        <motion.div variants={itemVariants}>
          <div className="mx-auto max-w-sm rounded-lg border border-muted-foreground/20 bg-muted/30 p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Tenseats recommends
            </p>
            <h2 className="text-base font-semibold text-foreground mb-1">
              Zoho One
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              50+ tools for running your business. One fee.
            </p>
            <a
              href="https://go.zoho.com/Slvq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Explore Zoho One
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants}>
          <SocialLinks />
        </motion.div>
      </div>
    </PostSignupLayout>
  );
}
