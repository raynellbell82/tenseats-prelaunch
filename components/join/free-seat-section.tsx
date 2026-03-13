"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Wine,
  Camera,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "chef",
    label: "Chef",
    icon: ChefHat,
    headline: "Host unforgettable meals",
    description:
      "Run pop-ups, supper clubs, and tasting events. Set your menu, your price, and your vibe. Tenseats handles the rest — from discovery to checkout.",
    perks: [
      "Your own event page with booking",
      "Direct access to local food lovers",
      "Reviews and reputation that follow you",
    ],
  },
  {
    id: "mixologist",
    label: "Mixologist",
    icon: Wine,
    headline: "Craft experiences worth tasting",
    description:
      "Lead cocktail workshops, pairing dinners, and beverage-forward events. Bring your craft to an audience that appreciates the art behind the glass.",
    perks: [
      "Showcase your cocktail menus",
      "Collaborate with chefs and venues",
      "Build a following of spirit enthusiasts",
    ],
  },
  {
    id: "creator",
    label: "Creator",
    icon: Camera,
    headline: "Document the scene",
    description:
      "Share food stories, review pop-ups, and spotlight hidden gems. Creators are the connective tissue — the people who help others discover what\u2019s worth attending.",
    perks: [
      "Early access to new events",
      "Creator profile with your portfolio",
      "Influence what gets featured",
    ],
  },
  {
    id: "venueHost",
    label: "Venue Host",
    icon: Building2,
    headline: "Open your doors",
    description:
      "List your kitchen, rooftop, loft, or backyard for pop-ups, tastings, and private gatherings. Turn your space into a stage for the city\u2019s best food talent.",
    perks: [
      "Venue listing with availability calendar",
      "Matched with chefs and event hosts",
      "Earn from every booking",
    ],
  },
  {
    id: "guest",
    label: "Guest",
    icon: Users,
    headline: "Discover what\u2019s real",
    description:
      "Find pop-ups, tastings, dinner parties, and gatherings curated by real people — not algorithms. Every event is vetted, every seat is intentional.",
    perks: [
      "Curated event feed for your city",
      "Book instantly with transparent pricing",
      "Reviews from people you trust",
    ],
  },
];

export function FreeSeatSection() {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Everyone gets a seat
          </h2>
          <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Whether you cook, mix, create, host, or simply love great food —
            there&apos;s a place for you here. Pick a role and you&apos;re in.
            Always free.
          </p>
        </motion.div>

        {/* Tabbed role explorer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          {/* Role tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {role.label}
                </button>
              );
            })}
          </div>

          {/* Active role detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* Left: Role info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.06] dark:bg-foreground/[0.08]">
                      <activeRole.icon className="h-5 w-5 text-foreground/70" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      {activeRole.label}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {activeRole.headline}
                  </h3>

                  <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {activeRole.description}
                  </p>
                </div>

                {/* Right: Perks + CTAs */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">
                    What you get
                  </p>
                  <ul className="space-y-3 mb-8">
                    {activeRole.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <span className="text-foreground/80">{perk}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="w-full group rounded-full font-medium h-12"
                      >
                        Join for Free
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                    <Link href="/launch">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full group rounded-full font-medium h-12 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/50"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Reserve Early Bird Seat
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
