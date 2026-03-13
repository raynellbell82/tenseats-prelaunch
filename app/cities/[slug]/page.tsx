import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/landing/landing-header";
import { CityHero } from "@/components/cities/city-hero";
import { CityFoodScene } from "@/components/cities/city-food-scene";
import { CityPersonas } from "@/components/cities/city-personas";
import { CityReserve } from "@/components/cities/city-reserve";
import { JoinCtaFooter } from "@/components/join/join-cta-footer";
import { CITY_DATA, METROS_DATA } from "@/lib/city-data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return METROS_DATA.map((metro) => ({ slug: metro.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = CITY_DATA[slug];

  if (!city) {
    return {
      title: "City Not Found — Tenseats",
    };
  }

  return {
    title: `Tenseats ${city.displayName} — ${city.metaTagline}`,
    description: city.metaDescription,
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = CITY_DATA[slug];

  if (!city) {
    notFound();
  }

  return (
    <>
      <LandingHeader />
      <main className="min-h-screen">
        <CityHero city={city} />
        <CityFoodScene city={city} />
        <CityPersonas city={city} />
        <CityReserve citySlug={city.slug} />
        <JoinCtaFooter />
      </main>
    </>
  );
}
