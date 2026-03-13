"use client";

import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import type { CityData } from "@/lib/city-data";

interface CityFoodSceneProps {
  city: CityData;
}

export function CityFoodScene({ city }: CityFoodSceneProps) {
  return (
    <section id="food-scene" className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      {/* Scene intro paragraph */}
      <motion.p
        className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-16 sm:mb-20 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {city.sceneIntro}
      </motion.p>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {city.sceneBlocks.map((block, index) => (
          <motion.div
            key={block.heading}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            className={index === 1 ? "md:mt-12" : ""}
          >
            {/* Decorative placeholder instead of image (v1 — no Unsplash images per CITY-V2-01) */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-muted/30 flex items-center justify-center border border-border/30">
              <Utensils className="h-8 w-8 text-muted-foreground/20" />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {/* Text */}
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {block.heading}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-3">
              {block.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
