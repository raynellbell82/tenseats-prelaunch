"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { PersonaCard } from "@/components/shared/persona-card";
import { personaIconMap } from "@/components/icons/persona-icons";

const personas = [
  {
    id: "guest",
    title: "Guest",
    description:
      "You bring curiosity and an open palate. Every table needs someone ready to discover.",
  },
  {
    id: "chef",
    title: "Chef",
    description:
      "You turn ingredients into stories. Your craft deserves a table that listens.",
  },
  {
    id: "mixologist",
    title: "Mixologist",
    description:
      "You pair flavors with feelings. The bar is more than drinks \u2014 it\u2019s atmosphere.",
  },
  {
    id: "curator",
    title: "Curator",
    description:
      "You find what others miss. Hidden menus, unlisted pop-ups, the places worth knowing.",
  },
  {
    id: "venueHost",
    title: "Venue Host",
    description:
      "You create the space where it all happens. Your room sets the tone.",
  },
  {
    id: "facilitator",
    title: "Facilitator",
    description:
      "You connect the dots. The chef to the venue, the guest to the experience.",
  },
];

export function WhyPersonas() {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Who belongs here
        </h2>
        <p className="mt-4 text-muted-foreground text-center">
          Every seat has a role. Every role has a voice.
        </p>
      </motion.div>

      {/* Persona cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <PersonaCard
            key={persona.id}
            icon={personaIconMap[persona.id as keyof typeof personaIconMap]}
            role={persona.title}
            description={persona.description}
            index={index}
          />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <Link href="/join">
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
