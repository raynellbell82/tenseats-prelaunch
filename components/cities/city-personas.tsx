"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import type { CityData } from "@/lib/city-data";
import { PersonaCard } from "@/components/shared/persona-card";
import { personaIconMap } from "@/components/icons/persona-icons";

interface CityPersonasProps {
  city: CityData;
}

const roleDisplayMap: Record<string, string> = {
  chef: "Chef",
  mixologist: "Mixologist",
  venueHost: "Venue Host",
  curator: "Curator",
  guest: "Guest",
  facilitator: "Facilitator",
};

export function CityPersonas({ city }: CityPersonasProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      {/* Section heading */}
      <motion.h2
        className="text-3xl sm:text-5xl font-bold tracking-tight text-center mb-12 sm:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Who&apos;s at the table in {city.displayName}
      </motion.h2>

      {/* Persona cards grid — 3x2 desktop / 2x3 tablet / 1x6 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {city.topPersonas.map((persona, index) => (
          <PersonaCard
            key={persona.role}
            icon={personaIconMap[persona.role]}
            role={roleDisplayMap[persona.role] || persona.role}
            headline={persona.cityHeadline}
            description={persona.cityDescription}
            index={index}
          />
        ))}
      </div>

      {/* Section-level CTA */}
      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <Link href={`/launch?city=${city.slug}`}>
          <Button
            variant="outline"
            size="lg"
            className="group rounded-full font-medium h-12 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/50"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Find your seat
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
