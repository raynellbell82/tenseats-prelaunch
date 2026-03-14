"use client";

import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { LandingHeader } from "@/components/landing/landing-header";

interface PostSignupLayoutProps {
  children: ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function PostSignupLayout({ children }: PostSignupLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
