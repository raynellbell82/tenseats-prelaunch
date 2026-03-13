"use client";

import { motion } from "framer-motion";

export function WhyProblem() {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left column — The Problem */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
            The problem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Sponsored. Optimized. Irrelevant.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-6">
            Search for dinner in any city and you&apos;ll find the same ten
            names — not because they&apos;re the best, but because they paid
            to be seen. Algorithms surface paid placements, not genuine food.
            Trending lists reward SEO budgets, not taste. The places worth
            knowing have never needed to advertise — because the people who
            find them don&apos;t need to search.
          </p>
        </motion.div>

        {/* Vertical divider — desktop only */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />

        {/* Right column — The Solution */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-amber-500/70 mb-4">
            The whisper, surfaced.
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            The whisper, surfaced.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-6">
            Tenseats inverts the model. Locals nominate, Insiders verify,
            access is earned — not bought. There are no ads, no sponsored
            placements, no algorithm deciding what deserves to be found. Just
            the food that people actually talk about, pulled from the
            conversation and into the room where it belongs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
