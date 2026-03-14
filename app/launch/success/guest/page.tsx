"use client";

// Headline options (tenseats-copy-writer skill — Pattern 5: Hospitality-Coded Welcome):
// Option 1: "Your seat at the table is set." — direct, 2nd person, completes the verify page arc (selected)
// Option 2: "The table's been waiting for you." — flips POV, the table awaits the guest
// Option 3: "You're at the table now." — compressed, declarative, "now" adds momentum
// Option 4: "Welcome to the table." — ultra-spare, Resy-style maître d' energy

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { PostSignupLayout, itemVariants } from "@/components/post-signup/post-signup-layout";
import { VerticalTimeline } from "@/components/post-signup/vertical-timeline";
import { SocialLinks } from "@/components/post-signup/social-links";

const SUPPORT_EMAIL = "supportteams@tenseats.io";

const TIMELINE_STEPS = [
  {
    label: "Add us to your contacts",
    detail: SUPPORT_EMAIL,
    active: true,
  },
  {
    label: "Follow us on social",
    detail: "Stay in the loop",
    active: true,
  },
  {
    label: "Explore soon",
    detail: "Something's cooking",
    active: false,
  },
];

export default function GuestSuccessPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session || !session.user.emailVerified) {
      router.push("/launch");
    }
  }, [session, isPending, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  if (isPending) return null;
  if (!session || !session.user.emailVerified) return null;

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

        {/* Headline + body copy */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Your seat at the table is set.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You&apos;re part of something building in the background — the Tenseats community of
            people who eat with intention. We&apos;ll be in touch when the doors open.
          </p>
        </motion.div>

        {/* Vertical timeline + click-to-copy */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <div className="text-left w-56">
            <VerticalTimeline steps={TIMELINE_STEPS} />
          </div>
          {/* Click-to-copy for support email */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
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

        {/* Social links */}
        <motion.div variants={itemVariants}>
          <SocialLinks />
        </motion.div>
      </div>
    </PostSignupLayout>
  );
}
