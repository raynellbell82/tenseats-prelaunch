"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LaunchCountdownFull } from "@/components/launch/launch-countdown-full";
import {
  Check,
  ArrowRight,
  Crown,
  Flame,
  Zap,
} from "lucide-react";

interface CityReserveProps {
  citySlug: string;
}

const tiers = [
  {
    label: "Early Bird",
    icon: Flame,
    title: "First to the table",
    description:
      "A one-time commitment that locks in lifetime perks — no recurring fees, no catch. You pay once and keep the benefits forever.",
    highlight: "0% platform fees — for life",
    benefits: [
      "Zero platform fees on every booking, forever",
      "Auto-post your events to Instagram",
      "Priority access to events before general admission",
      "Early Bird badge on your profile",
      "First to know when new cities launch",
    ],
    accentClass: "border-amber-500/30 hover:border-amber-500/50",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-500/5",
  },
  {
    label: "Founding",
    icon: Crown,
    title: "Set the table",
    description:
      "Everything Early Birds get, plus you help shape what Tenseats becomes. Vote on features, join founder-only calls, and leave your mark on the platform.",
    highlight: "Shape the future of Tenseats",
    benefits: [
      "Everything in Early Bird, plus:",
      "Vote on upcoming features and roadmap",
      "Founding Member badge on your profile",
      "Direct line to the team — founder-only channel",
      "Early access to beta features before anyone else",
    ],
    accentClass: "border-foreground/20 hover:border-foreground/40",
    iconClass: "text-foreground",
    bgClass: "bg-foreground/[0.04]",
  },
];

export function CityReserve({ citySlug }: CityReserveProps) {
  const config = useQuery(api.launch.queue.getLaunchConfig);

  if (config === undefined) return null;

  return (
    <section className="border-t border-border">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        {/* Countdown */}
        {config?.featureCountdownEnabled && config.deadline && (
          <motion.div
            className="mb-14 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-border bg-card px-8 py-6 sm:px-12 sm:py-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4 font-medium">
                Founding window closes in
              </p>
              <LaunchCountdownFull deadline={config.deadline} />
            </div>
          </motion.div>
        )}

        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-5xl font-bold tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Some reserve their seat early
        </motion.h2>

        <motion.p
          className="mt-6 text-center text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          One payment. Lifetime perks. Zero platform fees on every booking,
          auto-post to Instagram, priority access to events, and exclusive
          features that free accounts never get. Limited seats available.
        </motion.p>

        {/* Tier cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.label}
                className={`rounded-2xl border ${tier.accentClass} ${tier.bgClass} p-6 sm:p-8 flex flex-col transition-colors`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
              >
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 border border-border/50">
                    <Icon className={`h-5 w-5 ${tier.iconClass}`} />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    {tier.label}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {tier.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>

                {/* Highlight callout */}
                <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-background/60 border border-border/50 px-4 py-3">
                  <Zap className={`h-4 w-4 shrink-0 ${tier.iconClass}`} />
                  <span className="text-sm font-semibold tracking-tight">
                    {tier.highlight}
                  </span>
                </div>

                {/* Benefits */}
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="h-4 w-4 mt-0.5 text-foreground/50 shrink-0" />
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA — pre-filtered to current city */}
                <div className="mt-8">
                  <Link href={`/launch?city=${citySlug}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full group rounded-full font-medium h-11"
                    >
                      Reserve {tier.label} Seat
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance */}
        <motion.p
          className="mt-10 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          Not ready to commit? No pressure. Your free account isn&apos;t going
          anywhere — reserve when you&apos;re ready.
        </motion.p>
      </div>
    </section>
  );
}
