import { LandingHeader } from "@/components/landing/landing-header";
import { LaunchPageContent } from "./launch-page-content";

interface LaunchPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function LaunchPage({ searchParams }: LaunchPageProps) {
  const params = await searchParams;
  return (
    <>
      <LandingHeader />
      <LaunchPageContent initialCitySlug={params.city} />
    </>
  );
}
