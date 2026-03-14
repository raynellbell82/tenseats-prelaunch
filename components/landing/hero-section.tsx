"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { LaunchCountdownFull } from "@/components/launch/launch-countdown-full";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const config = useQuery(api.launch.queue.getLaunchConfig);

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Atmospheric gradient orbs — layered for depth */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Primary orb — large, offset up-left */}
        <div className="absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-foreground/[0.07] via-foreground/[0.12] to-transparent dark:from-foreground/[0.03] dark:via-foreground/[0.06] dark:to-transparent blur-3xl" />
        {/* Secondary orb — smaller, offset down-right */}
        <div className="absolute top-20 left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-foreground/[0.09] to-transparent dark:from-foreground/[0.04] dark:to-transparent blur-3xl" />
        {/* Accent orb — tight, near center */}
        <div className="absolute -top-10 left-10 w-[200px] h-[200px] rounded-full bg-foreground/[0.05] dark:bg-foreground/[0.02] blur-2xl" />
      </motion.div>

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Launch announcement pill */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/join"
            className="group inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[13px] font-medium text-amber-400 transition-colors hover:border-amber-500/50 hover:bg-amber-500/15"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Founding memberships now open — skip platform fees for life
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {config?.featureCountdownEnabled && config.deadline && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <LaunchCountdownFull deadline={config.deadline} />
          </motion.div>
        )}

        {/* Eyebrow */}
        <motion.p
          className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/70 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Community-curated food events
        </motion.p>

        {/* Headline — editorial scale */}
        <motion.h1
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.035em] leading-[0.95] text-balance"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Discover events
          <br />
          <span className="text-muted-foreground/50">worth attending</span>
        </motion.h1>

        {/* Subheadline — restrained, generous spacing from headline */}
        <motion.p
          className="mt-8 sm:mt-10 text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          Pop-ups, tastings, dinner parties, and gatherings in your city — found through people you trust, not algorithms.
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          className="mt-10 sm:mt-14 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          <Link href="/join">
            <Button
              size="lg"
              className="group text-[15px] sm:text-base px-8 sm:px-10 h-12 sm:h-13 rounded-full font-medium shadow-lg shadow-foreground/5 dark:shadow-none"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link
            href="/why-tenseats"
            className="text-[13px] text-muted-foreground/60 hover:text-foreground underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground/50 transition-colors"
          >
            Learn about our community
          </Link>
        </motion.div>

        {/* Social proof — editorial, not corporate */}
        <motion.div
          className="mt-20 sm:mt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-muted-foreground/50">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl font-semibold text-foreground/80 tabular-nums">
                30+
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                Cities
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl font-semibold text-foreground/80 tabular-nums">
                1,000+
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                Events
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl font-semibold text-foreground/80">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                Curated
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
