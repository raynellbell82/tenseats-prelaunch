"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { METROS_DATA } from "@/lib/city-data";
import { REGIONS, getCitiesByRegion, type Region } from "@/lib/city-regions";
import { US_STATES_PATHS, US_BOUNDS } from "@/lib/us-states-paths";

/** Project lat/lng to SVG coordinates within the US crop viewBox. */
function projectPoint(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - US_BOUNDS.minLng) / (US_BOUNDS.maxLng - US_BOUNDS.minLng)) *
    US_BOUNDS.viewBoxWidth;
  const y =
    ((US_BOUNDS.maxLat - lat) / (US_BOUNDS.maxLat - US_BOUNDS.minLat)) *
    US_BOUNDS.viewBoxHeight;
  return { x, y };
}

/** Pixel offsets for cities that overlap at map scale. */
const CITY_OFFSETS: Record<string, { dx: number; dy: number }> = {
  "scottsdale-az": { dx: 8, dy: -8 },
  "st-petersburg-fl": { dx: -8, dy: 8 },
  "ann-arbor-mi": { dx: -6, dy: -6 },
};

export default function CitiesGlobe() {
  const [activeRegion, setActiveRegion] = useState<Region>("South");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Precompute projected city positions with overlap offsets
  const cityPositions = useMemo(
    () =>
      METROS_DATA.map((m) => {
        const raw = projectPoint(m.coordinates.lat, m.coordinates.lng);
        const offset = CITY_OFFSETS[m.name];
        return {
          ...m,
          pos: {
            x: raw.x + (offset?.dx ?? 0),
            y: raw.y + (offset?.dy ?? 0),
          },
        };
      }),
    []
  );

  const filteredCities = getCitiesByRegion(activeRegion);

  const handlePillMouseEnter = useCallback((slug: string) => {
    setHoveredCity(slug);
  }, []);

  const handlePillMouseLeave = useCallback(() => {
    setHoveredCity(null);
  }, []);

  // Outline stroke color adapts to theme
  const outlineStroke = isDark ? "#ffffff18" : "#00000018";

  // Respect prefers-reduced-motion (hydration-safe via useEffect)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <section
      id="cities-globe"
      className="relative py-20 px-4 overflow-hidden"
      aria-labelledby="cities-globe-heading"
    >
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
          Now in 32 Cities
        </p>
        <h2
          id="cities-globe-heading"
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Find Your City
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Exclusive dining experiences are happening near you. Explore your
          city&apos;s hidden culinary scene.
        </p>
      </div>

      {/* US Map */}
      <div
        role="img"
        aria-label="Map of the United States showing Tenseats cities"
        className="relative w-full max-w-4xl mx-auto aspect-[8/5] mb-10"
      >
        {/* SVG map — outlines, dots, hover effects */}
        <svg
          viewBox={`0 0 ${US_BOUNDS.viewBoxWidth} ${US_BOUNDS.viewBoxHeight}`}
          className="w-full h-full absolute inset-0 pointer-events-none select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="city-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* State outlines */}
          <g fill="none" stroke={outlineStroke} strokeWidth="0.8">
            {US_STATES_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* City dots */}
          {cityPositions.map((city) => {
            const isHovered = hoveredCity === city.name;
            return (
              <g key={city.name}>
                {/* Pulse ring (only when hovered) */}
                {isHovered && !prefersReducedMotion && (
                  <circle
                    cx={city.pos.x}
                    cy={city.pos.y}
                    r="4"
                    fill="#F97316"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      from="4"
                      to="14"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Dot */}
                <circle
                  cx={city.pos.x}
                  cy={city.pos.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#F97316"
                  filter="url(#city-glow)"
                  style={{
                    transition: "r 0.2s ease",
                  }}
                />

                {/* City label (only when hovered) */}
                {isHovered && (
                  <foreignObject
                    x={city.pos.x - 55}
                    y={city.pos.y - 30}
                    width="110"
                    height="24"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md border shadow-sm ${
                          isDark
                            ? "bg-black/90 text-white border-gray-700"
                            : "bg-white/90 text-black border-gray-200"
                        }`}
                      >
                        {city.displayName}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Region tabs */}
      <div
        role="tablist"
        aria-label="Filter cities by region"
        className="flex justify-center gap-2 mb-6 overflow-x-auto scrollbar-hide px-4"
      >
        {REGIONS.map((region) => (
          <button
            key={region}
            role="tab"
            aria-selected={activeRegion === region}
            onClick={() => setActiveRegion(region)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
              activeRegion === region
                ? "bg-orange-500/10 text-orange-500 border-orange-500/50"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80",
            ].join(" ")}
          >
            {region}
          </button>
        ))}
      </div>

      {/* City pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredCities.map((metro) => (
            <motion.div
              key={metro.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href={`/cities/${metro.name}`}
                onMouseEnter={() => handlePillMouseEnter(metro.name)}
                onMouseLeave={handlePillMouseLeave}
                className="block bg-card border border-border text-foreground/80 rounded-full px-4 py-2 text-sm transition-colors hover:border-orange-500/50 hover:text-foreground"
              >
                {metro.displayName}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
