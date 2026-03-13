# Cities Globe Section — Design Spec

## Overview

Add an interactive 3D globe section to the home page that shows Tenseats' 32 US city markets as glowing markers. Below the globe, region-tabbed city pills let visitors discover and navigate to individual city pages. The section serves dual purpose: discovery (find your city) and credibility (nationwide presence).

## Placement

Directly below `HeroSection` in `app/page.tsx`, before any future content sections. The globe's visual impact earns the #2 position on the page.

## Component Structure

### `CitiesGlobe` (Client Component)

**File:** `components/landing/cities-globe.tsx`

Single self-contained client component rendered from the home page server component. Contains:

1. **Section header** — "Now in 32 Cities" eyebrow, "Find Your City" headline, subtitle
2. **Globe canvas** — `cobe` WebGL globe
3. **Region tabs** — South, Midwest, Northeast, West (pill-style tab switcher)
4. **City pills** — Filtered list of city links for the active region

### Region Mapping

**File:** `lib/city-regions.ts`

New constant mapping each metro slug to a region:

```typescript
export const CITY_REGIONS: Record<string, string> = {
  "atlanta-ga": "South",
  "ann-arbor-mi": "Midwest",
  "asheville-nc": "South",
  "austin-tx": "South",
  "birmingham-al": "South",
  "buffalo-ny": "Northeast",
  "charleston-sc": "South",
  "charlotte-nc": "South",
  "chicago-il": "Midwest",
  "cincinnati-oh": "Midwest",
  "cleveland-oh": "Midwest",
  "columbus-oh": "Midwest",
  "dallas-tx": "South",
  "denver-co": "West",
  "detroit-mi": "Midwest",
  "grand-rapids-mi": "Midwest",
  "greenville-sc": "South",
  "houston-tx": "South",
  "indianapolis-in": "Midwest",
  "memphis-tn": "South",
  "meridian-ms": "South",
  "milwaukee-wi": "Midwest",
  "new-york-ny": "Northeast",
  "oklahoma-city-ok": "South",
  "orlando-fl": "South",
  "philadelphia-pa": "Northeast",
  "phoenix-az": "West",
  "pittsburgh-pa": "Northeast",
  "scottsdale-az": "West",
  "st-petersburg-fl": "South",
  "tampa-fl": "South",
  "washington-dc": "Northeast",
};

export const REGIONS = ["South", "Midwest", "Northeast", "West"] as const;
export type Region = (typeof REGIONS)[number];
```

## Globe Specification

### Library

`cobe` (~5KB) — lightweight WebGL globe. No API key, no external tiles.

### Appearance

- Dark globe with subtle land mass shading
- Globe background matches section background (dark/black)
- All 32 cities rendered as equal-size orange glowing dots (brand color `#f97316`)
- Subtle grid lines / graticule for depth
- Soft ambient glow around the globe

### Behavior

- **Initial state:** Globe is focused on the continental US, slowly auto-rotating
- **Pill hover:** Globe smoothly rotates to center the hovered city. The corresponding dot pulses larger and brighter. A small tooltip with the city name appears near the dot.
- **Idle return:** After hover ends, globe resumes slow auto-rotation after a short delay (~2s)
- **Touch devices:** No hover interaction on globe itself; pills are tap-to-navigate only. Globe auto-rotates continuously.
- **Reduced motion:** If `prefers-reduced-motion` is set, disable auto-rotation and use instant position changes instead of animations.

### `cobe` Configuration

`createGlobe` takes an HTML canvas element (not a ref) and returns a destroy function. Must be called inside `useEffect` with cleanup.

```typescript
// Initial phi for US center: longitude -98° → phi ≈ 4.4 rad
const US_CENTER_PHI = ((98 + 180) * Math.PI) / 180 - Math.PI; // ≈ 1.71 rad
const US_CENTER_THETA = 0.3; // slight tilt for perspective

useEffect(() => {
  let phi = US_CENTER_PHI;

  const globe = createGlobe(canvasRef.current!, {
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    width: canvasWidth * 2,
    height: canvasHeight * 2,
    phi: US_CENTER_PHI,
    theta: US_CENTER_THETA,
    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 2,
    baseColor: [0.1, 0.1, 0.12],
    markerColor: [0.976, 0.451, 0.086], // #f97316 in RGB 0-1
    glowColor: [0.05, 0.05, 0.08],
    markers: METROS_DATA.map(m => ({
      location: [m.coordinates.lat, m.coordinates.lng],
      size: 0.06,
    })),
    onRender: (state) => {
      // If focused on a city, lerp toward target phi
      // Otherwise, slowly auto-rotate
      if (focusTarget) {
        phi += (focusTarget - phi) * 0.1;
      } else {
        phi += 0.003;
      }
      state.phi = phi;
    },
  });

  // Cleanup: destroy WebGL context on unmount / route change
  return () => globe.destroy();
}, [canvasWidth, canvasHeight]);
```

### WebGL Fallback

If `cobe` fails to initialize (no WebGL support, context creation failure), the globe canvas is hidden and the section degrades gracefully to header + tabs + pills only. Wrap `createGlobe` in a try/catch inside the `useEffect`; on failure, set a `globeReady` state to `false` and conditionally hide the canvas container. The tabs and pills remain fully functional without the globe.

### Hover Debounce

Pill hover triggers are debounced at 150ms to prevent rapid rotation target changes when the mouse sweeps across pills. Each new hover cancels the previous pending rotation. The globe lerps toward the latest target, so even without debounce the animation is smooth — but debouncing reduces unnecessary state updates.

## Tabs and Pills

### Region Tabs

- Horizontally centered row of pill-shaped tabs
- Active tab: orange background tint + orange text + orange border
- Inactive tabs: subtle border, muted text
- Clicking a tab filters the city pills below
- Framer Motion `AnimatePresence` for smooth pill list transitions

### City Pills

- Wrapped flex layout, centered, with gap
- Each pill is a Next.js `<Link>` to `/cities/[slug]`
- Default state: dark background, subtle border, light text
- Hover state: orange border, slightly brighter text, globe rotates to that city
- Framer Motion `layout` animation for smooth reflow when tabs change

## Data Flow

```
METROS_DATA (static copy in lib/city-data.ts, duplicated from convex/metros.ts)
  → coordinates for cobe markers
  → name/displayName for pills

CITY_REGIONS (lib/city-regions.ts)
  → maps metro slug → region string
  → used to filter pills by active tab
```

No database queries. All data is static constants already available client-side.

## Responsive Behavior

| Viewport | Globe Size | Tab Layout | Pill Layout |
|----------|-----------|------------|-------------|
| Desktop (≥1024px) | 500×500 canvas | Horizontal row | Wrapped flex, ~3 rows |
| Tablet (768-1023px) | 400×400 canvas | Horizontal row | Wrapped flex, ~4 rows |
| Mobile (<768px) | 300×300 canvas | Horizontal scroll | Wrapped flex, full width |

## Dependencies

| Package | Size | Purpose |
|---------|------|---------|
| `cobe` | ~5KB | WebGL globe rendering |

Install: `npm install cobe`

Existing dependencies used: `framer-motion` (animations), `next/link` (navigation), `METROS_DATA` (city coordinates).

## Accessibility

- Globe is decorative — `aria-hidden="true"` on canvas, `role="img"` with alt text on wrapper
- Region tabs use `role="tablist"` / `role="tab"` / `aria-selected`
- City pills are standard `<a>` links, fully keyboard navigable
- Tab key moves through tabs and pills in logical order
- `prefers-reduced-motion` disables globe animation

## Performance

- `cobe` is dynamically imported (`next/dynamic` with `ssr: false`) — no SSR for WebGL
- Globe canvas uses `will-change: transform` for GPU compositing
- Intersection Observer pauses globe rendering when section is off-screen
- City data is imported statically, no runtime fetch

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `cobe` dependency |
| `lib/city-regions.ts` | New — region mapping constant |
| `components/landing/cities-globe.tsx` | New — globe + tabs + pills component |
| `app/page.tsx` | Import and render `CitiesGlobe` below `HeroSection` |
