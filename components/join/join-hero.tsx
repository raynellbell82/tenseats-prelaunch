"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export function JoinHero() {
  return (
    <section className="relative min-h-[calc(100dvh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Atmospheric gradient orbs — repositioned for /join page */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Primary orb — large, offset down-right */}
        <div className="absolute top-10 left-20 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-foreground/[0.08] via-foreground/[0.12] to-transparent dark:from-foreground/[0.03] dark:via-foreground/[0.06] dark:to-transparent blur-3xl" />
        {/* Secondary orb — offset up-left */}
        <div className="absolute -top-60 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-foreground/[0.10] to-transparent dark:from-foreground/[0.05] dark:to-transparent blur-3xl" />
        {/* Accent orb — tight, lower */}
        <div className="absolute top-32 -left-10 w-[250px] h-[250px] rounded-full bg-foreground/[0.06] dark:bg-foreground/[0.025] blur-2xl" />
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
        {/* Eyebrow */}
        <motion.p
          className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/70 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          A community for food people
        </motion.p>

        {/* Headline — bolder editorial scale */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[0.92]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <span className="block whitespace-nowrap">Find where locals</span>
          <span className="block text-muted-foreground/50">
            only whisper.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-10 sm:mt-14 text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          This isn&apos;t a reservation. It&apos;s an invitation.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-10 sm:mt-14 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          <Link href="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full group rounded-full font-medium h-12 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Become an Insider
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
