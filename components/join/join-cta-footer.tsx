"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JoinCtaFooter() {
  return (
    <section className="max-w-3xl mx-auto px-6 sm:px-8 py-24 sm:py-32 text-center">
      <motion.h2
        className="text-3xl sm:text-5xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Your city is waiting.{" "}
        <span className="text-muted-foreground/50">Take your seat.</span>
      </motion.h2>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        <Link href="/signup">
          <Button
            size="lg"
            className="group text-[15px] sm:text-base px-8 sm:px-10 h-12 sm:h-13 rounded-full font-medium shadow-lg shadow-foreground/5 dark:shadow-none"
          >
            Join Tenseats
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>

      <motion.p
        className="mt-5 text-[13px] text-muted-foreground/60"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
      >
        Already a member?{" "}
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground/50 transition-colors"
        >
          Log in
        </Link>
      </motion.p>
    </section>
  );
}
