"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CityData } from "@/lib/city-data";

/**
 * Curated Unsplash photo IDs by category.
 * Each scene block picks from the pool based on a hash of its query string
 * so the same city always gets the same images.
 */
const PHOTO_POOL: Record<string, string[]> = {
  restaurant: [
    "photo-1414235077428-338989a2e8c0",
    "photo-1517248135467-4c7edcad34c4",
    "photo-1555396273-367ea4eb4db5",
    "photo-1559339352-11d035aa65de",
    "photo-1466978913421-dad2ebd01d17",
    "photo-1473093295043-cdd812d0e601",
  ],
  chef: [
    "photo-1504674900247-0877df9cc836",
    "photo-1476224203421-9ac39bcb3327",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1543353071-10c8ba85a904",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1567620905732-2d1ec7ab7445",
    "photo-1547592180-85f173990554",
  ],
  cocktail: [
    "photo-1551024709-8f23befc6f87",
    "photo-1514933651103-005eec06c04b",
    "photo-1470338745628-171cf53de3a8",
    "photo-1536935338788-846bb9981813",
    "photo-1556040220-4096d522378d",
    "photo-1571091718767-18b5b1457add",
  ],
  street: [
    "photo-1555939594-58d7cb561ad1",
    "photo-1504718855392-c0f33b372e72",
    "photo-1568901346375-23c9450c58cd",
    "photo-1546069901-ba9599a7e63c",
    "photo-1506354666786-959d6d497f1a",
    "photo-1550461716-dbf266b2a8a7",
  ],
  market: [
    "photo-1488459716781-31db52582fe9",
    "photo-1498654896293-37aacf113fd9",
    "photo-1482049016688-2d3e1b311543",
    "photo-1512621776951-a57141f2eefd",
    "photo-1583394838336-acd977736f90",
  ],
  supper: [
    "photo-1551218808-94e220e084d2",
    "photo-1528605248644-14dd04022da1",
    "photo-1470337458703-46ad1756a187",
    "photo-1485182708500-e8f1f318ba72",
    "photo-1559329007-40df8a9345d8",
    "photo-1552566626-52f8b828add9",
  ],
};

/** Simple string hash for deterministic photo selection. */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Match an unsplashQuery to a category, then pick a photo deterministically. */
function getPhotoId(query: string, index: number): string {
  const q = query.toLowerCase();
  let category = "restaurant";
  if (q.includes("cocktail") || q.includes("wine") || q.includes("whiskey") || q.includes("mezcal") || q.includes("bar")) {
    category = "cocktail";
  } else if (q.includes("supper") || q.includes("dinner") || q.includes("tasting") || q.includes("counter")) {
    category = "supper";
  } else if (q.includes("chef") || q.includes("plating") || q.includes("kitchen")) {
    category = "chef";
  } else if (q.includes("street") || q.includes("truck") || q.includes("trailer") || q.includes("pop-up") || q.includes("popup")) {
    category = "street";
  } else if (q.includes("market") || q.includes("farm")) {
    category = "market";
  }
  const pool = PHOTO_POOL[category];
  const h = hashCode(query + index);
  return pool[h % pool.length];
}

function unsplashImageUrl(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=640&h=800&fit=crop&fm=webp&q=80`;
}

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
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
              <Image
                src={unsplashImageUrl(getPhotoId(block.unsplashQuery, index))}
                alt={block.heading}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
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
