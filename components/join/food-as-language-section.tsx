"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const blocks = [
  {
    heading: "Every dish has a history",
    description:
      "Recipes carry generations. A mole sauce is a grandmother\u2019s story. A ferment is patience made edible. Food doesn\u2019t need translation.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=1000&fit=crop&crop=center",
    alt: "Hands carefully preparing a traditional dish with fresh spices",
  },
  {
    heading: "Every table is a classroom",
    description:
      "You learn knife skills from a chef who learned from their mother. You taste a flavor you can\u2019t name and someone teaches you the word.",
    image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&h=1000&fit=crop&crop=center",
    alt: "Chef teaching cooking techniques in an intimate kitchen setting",
  },
  {
    heading: "Every meal is a conversation",
    description:
      "Strangers become friends between courses. You share a plate, then a story, then a number. The shared act of eating is the oldest form of trust.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=1000&fit=crop&crop=center",
    alt: "Friends gathered around a communal table sharing food and laughter",
  },
];

export function FoodAsLanguageSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {blocks.map((block, index) => (
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
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
              <Image
                src={block.image}
                alt={block.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Subtle grain overlay on image */}
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
