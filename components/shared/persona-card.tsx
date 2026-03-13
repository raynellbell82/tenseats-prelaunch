"use client";

import { motion } from "framer-motion";

interface PersonaCardProps {
  icon: React.ComponentType<{ className?: string }>;
  role: string;
  headline?: string;
  description: string;
  index: number;
}

export function PersonaCard({
  icon: Icon,
  role,
  headline,
  description,
  index,
}: PersonaCardProps) {
  return (
    <motion.div
      className="rounded-2xl border border-border/50 p-6 bg-card/50 hover:border-border transition-colors"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.06] dark:bg-foreground/[0.08] mb-4">
        <Icon className="h-5 w-5 text-foreground/70" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
        {role}
      </p>
      {headline && (
        <h3 className="text-lg font-semibold mb-2">{headline}</h3>
      )}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
