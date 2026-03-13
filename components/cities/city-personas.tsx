"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Wine,
  Building2,
  Search,
  Users,
  ArrowRight,
} from "lucide-react";
import type { CityData } from "@/lib/city-data";

interface CityPersonasProps {
  city: CityData;
}

const roleIconMap = {
  chef: ChefHat,
  mixologist: Wine,
  venueHost: Building2,
  curator: Search,
  guest: Users,
} as const;

const roleDisplayMap = {
  chef: "Chef",
  mixologist: "Mixologist",
  venueHost: "Venue Host",
  curator: "Curator",
  guest: "Guest",
} as const;

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

      {/* Persona cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {city.topPersonas.map((persona, index) => {
          const Icon = roleIconMap[persona.role];
          const roleDisplay = roleDisplayMap[persona.role];
          return (
            <motion.div
              key={persona.role}
              className="rounded-2xl border border-border p-6 sm:p-8 flex flex-col hover:border-foreground/20 transition-colors"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            >
              {/* Role icon and badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/50">
                  <Icon className="h-5 w-5 text-foreground/70" />
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {roleDisplay}
                </span>
              </div>

              {/* Card title */}
              <h3 className="text-xl font-bold tracking-tight mb-2">
                {persona.cityHeadline}
              </h3>

              {/* Card body */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {persona.cityDescription}
              </p>

              {/* CTA */}
              <div className="mt-6">
                <Link href="/join">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group rounded-full font-medium"
                  >
                    Join free as a {roleDisplay.toLowerCase()}
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
