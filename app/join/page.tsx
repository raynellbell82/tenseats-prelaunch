import { LandingHeader } from "@/components/landing/landing-header";
import { JoinHero } from "@/components/join/join-hero";
import { FoodAsLanguageSection } from "@/components/join/food-as-language-section";
import { FreeSeatSection } from "@/components/join/free-seat-section";
import { ReserveSpotSection } from "@/components/join/reserve-spot-section";
import { JoinCtaFooter } from "@/components/join/join-cta-footer";

export default function JoinPage() {
  return (
    <>
      <LandingHeader />
      <JoinHero />
      <FoodAsLanguageSection />
      <FreeSeatSection />
      <ReserveSpotSection />
      <JoinCtaFooter />
    </>
  );
}
