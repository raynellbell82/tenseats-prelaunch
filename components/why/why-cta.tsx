"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { LaunchCountdownFull } from "@/components/launch/launch-countdown-full";
import { ArrowRight, Sparkles } from "lucide-react";

export function WhyCta() {
  const config = useQuery(api.launch.queue.getLaunchConfig);

  return (
    <section className="relative py-24 sm:py-32 text-center overflow-hidden">
      {/* Atmospheric gradient orbs — simplified (2 orbs) */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Primary orb */}
        <div className="absolute -top-20 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-foreground/[0.08] via-foreground/[0.10] to-transparent dark:from-foreground/[0.03] dark:via-foreground/[0.05] dark:to-transparent blur-3xl" />
        {/* Secondary orb */}
        <div className="absolute top-10 left-20 w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-foreground/[0.07] to-transparent dark:from-foreground/[0.03] dark:to-transparent blur-3xl" />
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
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">
        {/* Headline */}
        <motion.h2
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          The Insiders are already inside.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-muted-foreground text-base sm:text-lg mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Founding memberships are limited. The countdown is real.
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          {config === undefined ? (
            /* Loading placeholder — pulsing */
            <div className="flex items-center gap-5">
              {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
                <div key={label} className="flex items-center gap-5">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-16 sm:h-16 sm:w-20 rounded-md bg-muted/40 animate-pulse" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {label}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="text-2xl sm:text-4xl font-light text-muted-foreground/40 -mt-4">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : config?.featureCountdownEnabled && config.deadline ? (
            <LaunchCountdownFull deadline={config.deadline} />
          ) : null}
        </motion.div>

        {/* CTA button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <Link href="/signup">
            <Button
              variant="outline"
              size="lg"
              className="group rounded-full font-medium h-12 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Become an Insider
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
