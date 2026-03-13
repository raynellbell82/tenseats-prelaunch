import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { CitiesGlobe } from "@/components/landing/cities-globe-loader";

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <HeroSection />
      <CitiesGlobe />
    </>
  );
}
