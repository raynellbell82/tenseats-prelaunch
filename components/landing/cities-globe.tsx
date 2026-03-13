"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { METROS_DATA } from "@/lib/city-data";
import { REGIONS, getCitiesByRegion, type Region } from "@/lib/city-regions";

// Lerp helper for smooth globe rotation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Convert lat/lng to cobe phi/theta
function coordsToGlobe(lat: number, lng: number): { phi: number; theta: number } {
  const phi = ((lng + 180) * Math.PI) / 180 - Math.PI;
  const theta = (lat * Math.PI) / 180;
  return { phi, theta };
}

// Continental US center: ~longitude -98
const US_CENTER_PHI = ((98 + 180) * Math.PI) / 180 - Math.PI;
const US_CENTER_THETA = 0.3;

function getCanvasSize(): number {
  if (typeof window === "undefined") return 500;
  if (window.matchMedia("(min-width: 1024px)").matches) return 500;
  if (window.matchMedia("(min-width: 768px)").matches) return 400;
  return 300;
}

export default function CitiesGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<{ destroy: () => void } | null>(null);
  const focusRef = useRef<{ phi: number; theta: number } | null>(null);
  const autoRotateRef = useRef(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const canvasSizeRef = useRef(500);

  const [activeRegion, setActiveRegion] = useState<Region>("South");
  const [globeError, setGlobeError] = useState(false);

  // Markers for all 32 cities
  const globeMarkers = METROS_DATA.map((m) => ({
    location: [m.coordinates.lat, m.coordinates.lng] as [number, number],
    size: 0.05,
  }));

  const initGlobe = useCallback(() => {
    if (!canvasRef.current || globeError) return;

    try {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      reducedMotionRef.current = prefersReducedMotion;

      const size = getCanvasSize();
      canvasSizeRef.current = size;
      const dpr = Math.min(window.devicePixelRatio, 2);

      let phi = US_CENTER_PHI;
      const theta = US_CENTER_THETA;

      // Destroy previous instance if any
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }

      // Dynamic import of cobe (window-dependent)
      import("cobe").then(({ default: createGlobe }) => {
        if (!canvasRef.current) return;

        try {
          const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: dpr,
            width: size * dpr,
            height: size * dpr,
            phi,
            theta,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 2,
            baseColor: [0.1, 0.1, 0.12],
            glowColor: [0.05, 0.05, 0.08],
            markerColor: [0.976, 0.451, 0.086],
            markers: globeMarkers,
            onRender(state) {
              if (!isVisibleRef.current) return;

              const lerpFactor = reducedMotionRef.current ? 1 : 0.05;

              if (focusRef.current) {
                // Smooth rotation toward focused city
                phi = lerp(phi, focusRef.current.phi, lerpFactor);
                state.phi = phi;
                state.theta = lerp(state.theta ?? theta, focusRef.current.theta, lerpFactor);
              } else if (autoRotateRef.current) {
                // Auto-rotation when idle
                if (!reducedMotionRef.current) {
                  phi += 0.003;
                  state.phi = phi;
                }
              } else {
                state.phi = phi;
              }
            },
          });

          globeRef.current = globe;
        } catch {
          setGlobeError(true);
        }
      }).catch(() => {
        setGlobeError(true);
      });
    } catch {
      setGlobeError(true);
    }
  }, [globeError, globeMarkers]);

  // Initialize globe and set up resize/visibility observers
  useEffect(() => {
    if (typeof window === "undefined") return;

    initGlobe();

    // IntersectionObserver for performance: pause globe when off-screen
    const section = sectionRef.current;
    let observer: IntersectionObserver | null = null;

    if (section) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisibleRef.current = entry.isIntersecting;
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(section);
    }

    // Responsive canvas sizing: recreate globe on significant breakpoint change
    const mqlDesktop = window.matchMedia("(min-width: 1024px)");
    const mqlTablet = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      const newSize = getCanvasSize();
      if (newSize !== canvasSizeRef.current) {
        initGlobe();
      }
    };

    mqlDesktop.addEventListener("change", handleResize);
    mqlTablet.addEventListener("change", handleResize);

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      if (observer && section) {
        observer.unobserve(section);
      }
      mqlDesktop.removeEventListener("change", handleResize);
      mqlTablet.removeEventListener("change", handleResize);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePillMouseEnter = useCallback((lat: number, lng: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      const target = coordsToGlobe(lat, lng);
      focusRef.current = target;
      autoRotateRef.current = false;
    }, 150);
  }, []);

  const handlePillMouseLeave = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    focusRef.current = null;

    idleTimerRef.current = setTimeout(() => {
      autoRotateRef.current = true;
    }, 2000);
  }, []);

  const filteredCities = getCitiesByRegion(activeRegion);

  // Determine canvas size for CSS
  const canvasSize = typeof window !== "undefined" ? getCanvasSize() : 500;

  return (
    <section
      id="cities-globe"
      ref={sectionRef}
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
          Exclusive dining experiences are happening near you. Explore your city&apos;s hidden
          culinary scene.
        </p>
      </div>

      {/* Globe canvas */}
      {!globeError && (
        <div
          role="img"
          aria-label="Interactive globe showing Tenseats cities across the United States"
          className="flex justify-center mb-10"
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              width: canvasSize,
              height: canvasSize,
              willChange: "transform",
            }}
            className="rounded-full"
          />
        </div>
      )}

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
                onMouseEnter={() =>
                  handlePillMouseEnter(metro.coordinates.lat, metro.coordinates.lng)
                }
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
