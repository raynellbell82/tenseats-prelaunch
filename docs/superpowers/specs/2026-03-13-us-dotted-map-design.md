# US Dotted Map — Design Spec

**Date:** 2026-03-13
**Status:** Approved
**Replaces:** 3D cobe globe in `components/landing/cities-globe.tsx`

## Summary

Replace the 3D rotating globe with a flat, dotted US map showing state outlines and 32 interactive city markers. When a user hovers a city pill, the corresponding dot on the map glows, pulses, and shows a city name label. No WebGL — pure SVG + Image.

## Architecture

### Map Layer Stack (bottom to top)

1. **Dotted texture background** — `dotted-map` library generates a world map SVG, rendered as a Next.js `<Image>` cropped to continental US bounds via CSS masking
2. **State outlines** — SVG `<path>` elements for state borders at ~10% opacity, theme-aware (`#ffffff18` dark / `#00000018` light)
3. **City dots** — 32 SVG `<circle>` elements positioned via lat/lng Mercator projection, filled with brand orange (`#F97316`), with SVG `<filter>` glow
4. **Hover effects** — expanding ring animation + floating city name label tooltip, triggered by pill hover state
5. **Gradient edge mask** — CSS `mask-image` fades edges to transparent so the map bleeds into the page background

### Component Structure

```
CitiesGlobe (cities-globe.tsx)
├── Section header (unchanged)
├── Map container
│   ├── <Image> — dotted-map SVG background (cropped to US)
│   └── <svg> overlay (viewBox matched to US bounds)
│       ├── <g> state outlines
│       ├── <g> city dots (32 circles with glow filter)
│       └── <g> hover effects (conditional pulse + label per dot)
├── Region tabs (unchanged)
└── City pills (unchanged, onMouseEnter/Leave drives hover state)
```

### Dependencies

- **Add:** `dotted-map` npm package (used by 21st.dev WorldMap component)
- **Remove:** `cobe` is no longer used by this component (may still be used elsewhere — check before removing)

## Interaction Design

### Default State
- All 32 city dots rendered as static orange circles with subtle glow filter
- No animation, no labels — clean and minimal

### Pill Hover
- `onMouseEnter` on a city pill sets `hoveredCity` state to that city's slug
- The matching map dot renders:
  - **Pulse ring:** `<circle>` with `<animate>` — radius expands 4→14px, opacity fades 0.4→0, 2s loop
  - **City label:** tooltip positioned above the dot showing "City, ST" text in a small rounded pill
- `onMouseLeave` clears `hoveredCity` — dot returns to static state

### Mobile
- No hover on mobile — dots remain static (touch targets are the pills which link directly)
- Map serves as visual context only on touch devices

## Technical Details

### Lat/Lng to SVG Projection

Use Mercator projection bounded to continental US:
```
x = (lng + 180) * (viewBoxWidth / 360)
y = (90 - lat) * (viewBoxHeight / 180)
```

ViewBox cropped to approximately: `lat 24°–50°, lng -125°–-66°`

### Theme Awareness

- `useTheme()` from `next-themes`
- Dotted map background color: `#FFFFFF40` dark / `#00000040` light (passed to `dotted-map` getSVG)
- State outline stroke: `#ffffff18` dark / `#00000018` light
- City dot fill: `#F97316` (brand orange — same in both modes)
- Label tooltip: `bg-black/90 text-white` dark / `bg-white/90 text-black` light with border

### SVG Glow Filter

```svg
<filter id="city-glow">
  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### State Outlines Source

Use a simplified GeoJSON of US state boundaries converted to SVG paths. The paths should be pre-generated and inlined — not fetched at runtime. Simplified to reduce path complexity (~50 state outlines).

### Responsive Behavior

SVG scales naturally via `viewBox` + responsive container. The `aspect-[2/1]` ratio keeps the map wide on desktop. On mobile, the map compresses vertically but remains readable since dots are relatively spaced.

## What Stays the Same

- Section `id="cities-globe"` (preserves anchor links)
- Section header: "Now in 32 Cities" / "Find Your City" / subtitle
- Region tabs with `REGIONS` array and active state
- City pills with `AnimatePresence`, links to `/cities/{slug}`
- `getCitiesByRegion()` filtering logic
- All data imports from `@/lib/city-data` and `@/lib/city-regions`

## Files Modified

| File | Change |
|------|--------|
| `components/landing/cities-globe.tsx` | Full rewrite — replace cobe globe with dotted map |
| `package.json` | Add `dotted-map` dependency |

## Out of Scope

- Removing `cobe` from package.json (may be used elsewhere)
- Click-on-dot navigation (pills handle navigation)
- Animated connection lines between cities
- State fill colors or region highlighting on the map itself
