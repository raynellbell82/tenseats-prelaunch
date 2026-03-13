# US Dotted Map Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3D cobe globe with a flat dotted US map showing state outlines, 32 interactive city dots that glow/pulse on pill hover, and city name labels.

**Architecture:** SVG overlay on a `dotted-map` generated background image, cropped to continental US. State outlines as inlined SVG paths at ~10% opacity. City dots use SVG glow filter + conditional pulse animation driven by React state. Theme-aware via `useTheme()`.

**Tech Stack:** `dotted-map`, Next.js Image, SVG, framer-motion (existing), next-themes (existing)

**Spec:** `docs/superpowers/specs/2026-03-13-us-dotted-map-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `components/landing/cities-globe.tsx` | Rewrite | Main map component — dotted background, state outlines, city dots, hover state |
| `components/landing/cities-globe-loader.tsx` | Keep as-is | Dynamic import wrapper (kept for consistency — `dotted-map` itself is SSR-safe but the component uses `useTheme` and `window.matchMedia`) |
| `lib/us-states-paths.ts` | Create | Simplified US state boundary SVG paths data |
| `package.json` | Modify | Add `dotted-map` dependency |

No other files change. `app/page.tsx`, `lib/city-data.ts`, `lib/city-regions.ts`, and header nav links all stay the same.

---

## Chunk 1: Dependencies and State Outline Data

### Task 1: Install dotted-map

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run: `npm install dotted-map`

- [ ] **Step 2: Verify installation**

Run: `npm ls dotted-map`
Expected: `dotted-map@x.x.x`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add dotted-map dependency for US cities map"
```

---

### Task 2: Create US state outline paths

**Files:**
- Create: `lib/us-states-paths.ts`

This file contains pre-simplified SVG path data for US state boundaries. The paths are generated offline from a simplified GeoJSON source and inlined as a TypeScript constant. The component imports this data and renders it as `<path>` elements.

- [ ] **Step 1: Create the state paths data file**

Create `lib/us-states-paths.ts` containing a single export: an array of SVG path `d` strings representing simplified US state outlines projected to an 800x500 viewBox covering the continental US (lat 24-50, lng -125 to -66).

The projection function to convert lat/lng to SVG coordinates:
```typescript
// Equirectangular projection cropped to continental US
// viewBox: 0 0 800 500
function project(lat: number, lng: number): [number, number] {
  const x = ((lng - (-125)) / ((-66) - (-125))) * 800;  // lng range: -125 to -66
  const y = ((50 - lat) / (50 - 24)) * 500;              // lat range: 24 to 50
  return [x, y];
}
```

The file should export:
```typescript
/**
 * Simplified US state boundary SVG paths.
 * Pre-generated from Natural Earth 110m admin boundaries.
 * Projected to viewBox 0 0 800 500 (continental US crop).
 */
export const US_STATES_PATHS: string[] = [
  // Each string is an SVG path `d` attribute for one state outline
  // ... 48 continental states + DC
];

// Projection bounds for the component to reuse
export const US_BOUNDS = {
  minLat: 24,
  maxLat: 50,
  minLng: -125,
  maxLng: -66,
  viewBoxWidth: 800,
  viewBoxHeight: 500,
} as const;
```

To generate the paths, run this script which downloads a public-domain simplified US states GeoJSON and converts it to SVG path strings:

```bash
# Install d3-geo for projection and geo2svg for path generation
npm install --save-dev d3-geo @types/d3-geo

# Then create and run a generation script:
npx tsx scripts/generate-us-paths.ts
```

Create `scripts/generate-us-paths.ts`:
```typescript
import { writeFileSync } from "fs";

// Fetch simplified US states GeoJSON from public CDN
const URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

async function main() {
  const response = await fetch(URL);
  const topology = await response.json();

  // Use topojson-client to convert TopoJSON to GeoJSON
  const topojson = await import("topojson-client");
  const geojson = topojson.feature(topology, topology.objects.states);

  // Project each state to our viewBox coordinates
  const bounds = { minLat: 24, maxLat: 50, minLng: -125, maxLng: -66 };
  const W = 800, H = 500;

  function project(coords: number[]): [number, number] {
    const [lng, lat] = coords;
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * W;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * H;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  }

  function coordsToPath(rings: number[][][]): string {
    return rings
      .map((ring) => {
        const pts = ring.map((c) => project(c));
        return "M" + pts.map((p) => p.join(",")).join("L") + "Z";
      })
      .join("");
  }

  const paths: string[] = [];
  for (const feature of geojson.features) {
    if (feature.geometry.type === "Polygon") {
      paths.push(coordsToPath(feature.geometry.coordinates));
    } else if (feature.geometry.type === "MultiPolygon") {
      const d = feature.geometry.coordinates.map(coordsToPath).join("");
      paths.push(d);
    }
  }

  // Filter out Alaska and Hawaii (they fall outside our bounds)
  const filteredPaths = paths.filter((d) => {
    // Paths entirely outside the viewBox will have coordinates < 0 or > 800/500
    const nums = d.match(/[\d.]+/g)?.map(Number) || [];
    const xs = nums.filter((_, i) => i % 2 === 0);
    return xs.some((x) => x >= 0 && x <= W);
  });

  const output = `/**
 * Simplified US state boundary SVG paths.
 * Generated from Natural Earth / US Census via us-atlas.
 * Projected to viewBox 0 0 ${W} ${H} (continental US crop).
 */
export const US_STATES_PATHS: string[] = ${JSON.stringify(filteredPaths, null, 2)};

export const US_BOUNDS = {
  minLat: ${bounds.minLat},
  maxLat: ${bounds.maxLat},
  minLng: ${bounds.minLng},
  maxLng: ${bounds.maxLng},
  viewBoxWidth: ${W},
  viewBoxHeight: ${H},
} as const;
`;

  writeFileSync("lib/us-states-paths.ts", output);
  console.log(\`Generated \${filteredPaths.length} state paths\`);
}

main();
```

Install the TopoJSON dependency for the script: `npm install --save-dev topojson-client @types/topojson-client`

After running, delete the script and dev dependencies if desired. The generated `lib/us-states-paths.ts` is the only artifact that ships. Target < 80KB total for all paths.

- [ ] **Step 2: Verify the file exports correctly**

Run: `npx tsx -e "import { US_STATES_PATHS, US_BOUNDS } from './lib/us-states-paths'; console.log(US_STATES_PATHS.length, 'states'); console.log(US_BOUNDS);"`
Expected: `49 states` (48 states + DC) and the bounds object

- [ ] **Step 3: Commit**

```bash
git add lib/us-states-paths.ts
git commit -m "feat: add simplified US state outline SVG paths"
```

---

## Chunk 2: Rewrite CitiesGlobe Component

### Task 3: Rewrite cities-globe.tsx

**Files:**
- Rewrite: `components/landing/cities-globe.tsx`

Replace the entire cobe-based globe with the dotted map. The component keeps the same default export, same section ID, same region tabs, and same city pills — only the map visualization changes.

- [ ] **Step 1: Write the new component**

```tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import DottedMap from "dotted-map";
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

export default function CitiesGlobe() {
  const [activeRegion, setActiveRegion] = useState<Region>("South");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Generate dotted map SVG string (memoized per theme)
  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);
  const dotColor = isDark ? "#FFFFFF40" : "#00000040";
  const bgColor = isDark ? "black" : "white";
  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: dotColor,
        shape: "circle",
        backgroundColor: bgColor,
      }),
    [map, dotColor, bgColor]
  );

  // Precompute projected city positions
  const cityPositions = useMemo(
    () =>
      METROS_DATA.map((m) => ({
        ...m,
        pos: projectPoint(m.coordinates.lat, m.coordinates.lng),
      })),
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
        {/* Layer 1: Dotted map background — cropped to continental US via clip + position */}
        <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_5%,white_95%,transparent)]">
          <Image
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            className="pointer-events-none select-none"
            alt=""
            width={1056}
            height={528}
            draggable={false}
            priority
            style={{
              // Position the world map so only the US is visible
              // US spans roughly x:15%-45% and y:20%-45% of the world map
              position: "absolute",
              width: "330%",
              height: "330%",
              left: "-52%",
              top: "-72%",
            }}
          />
        </div>

        {/* Layer 2-4: SVG overlay — outlines, dots, hover effects */}
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
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -15`
Expected: Build succeeds, no TypeScript errors. All city pages still generate via SSG.

- [ ] **Step 3: Visual check**

Run: `npx next dev`
Open `http://localhost:3000` and scroll to the "Find Your City" section.
Verify:
- Dotted map background is visible
- State outlines are visible at low opacity
- 32 orange dots are positioned roughly correctly on the US map
- Hovering a city pill causes the corresponding dot to pulse and show a label
- Region tabs still filter the pills
- City pill links still navigate to `/cities/{slug}`

- [ ] **Step 4: Commit**

```bash
git add components/landing/cities-globe.tsx
git commit -m "feat: replace 3D globe with dotted US map and interactive city dots"
```

---

## Chunk 3: Polish and Edge Cases

### Task 4: Handle Phoenix/Scottsdale overlap

Phoenix (33.448, -112.074) and Scottsdale (33.501, -111.925) are ~10 miles apart and will overlap on the map. Tampa (27.948, -82.458) and St. Petersburg (27.773, -82.640) are similarly close. Ann Arbor (42.28, -83.73) and Detroit (42.33, -83.05) also overlap.

**Files:**
- Modify: `components/landing/cities-globe.tsx`

- [ ] **Step 1: Add offset logic for overlapping cities**

Add a constant near the top of the file, after the `projectPoint` function:

```typescript
/** Pixel offsets for cities that overlap at map scale. */
const CITY_OFFSETS: Record<string, { dx: number; dy: number }> = {
  "scottsdale-az": { dx: 8, dy: -8 },
  "st-petersburg-fl": { dx: -8, dy: 8 },
  "ann-arbor-mi": { dx: -6, dy: -6 },
};
```

Then in the `cityPositions` useMemo, apply offsets:

```typescript
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
```

- [ ] **Step 2: Verify overlapping cities are now separated**

Run dev server, hover over Phoenix pill then Scottsdale pill. Both dots should be visually distinct. Same for Tampa/St. Petersburg.

- [ ] **Step 3: Commit**

```bash
git add components/landing/cities-globe.tsx
git commit -m "fix: offset overlapping city dots (Scottsdale, St. Pete, Ann Arbor)"
```

---

### Task 5: Final build verification

- [ ] **Step 1: Production build**

Run: `npx next build 2>&1 | tail -15`
Expected: Clean build, no warnings about missing dependencies or unused imports.

- [ ] **Step 2: Verify cobe is no longer imported**

Run: `grep -r "cobe" components/ lib/ app/ --include="*.tsx" --include="*.ts" | grep -v node_modules`
Expected: No matches (cobe is no longer referenced in source code).

- [ ] **Step 3: Commit if any final adjustments were made**

```bash
git add -A
git commit -m "chore: final cleanup for US dotted map"
```
