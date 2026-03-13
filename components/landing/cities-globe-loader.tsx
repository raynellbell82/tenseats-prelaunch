"use client";

import dynamic from "next/dynamic";

const CitiesGlobe = dynamic(() => import("@/components/landing/cities-globe"), { ssr: false });

export { CitiesGlobe };
