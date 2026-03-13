import { LandingHeader } from "@/components/landing/landing-header";
import { WhyHero } from "@/components/why/why-hero";
import { WhyProblem } from "@/components/why/why-problem";
import { WhyPersonas } from "@/components/why/why-personas";
import { WhyEconomics } from "@/components/why/why-economics";
import { WhyCta } from "@/components/why/why-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Tenseats | Built Different. On Purpose.",
  description:
    "Discover why Tenseats exists — no ads, no algorithms, just the food that people actually talk about. $1.99 per seat, 32 cities, Insider access.",
};

export default function WhyTenseatsPage() {
  return (
    <>
      <LandingHeader />
      <WhyHero />
      <WhyProblem />
      <WhyPersonas />
      <WhyEconomics />
      <WhyCta />
    </>
  );
}
