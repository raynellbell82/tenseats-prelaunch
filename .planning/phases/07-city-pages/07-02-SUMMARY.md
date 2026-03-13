---
phase: 07-city-pages
plan: "02"
subsystem: ui
tags: [typescript, nextjs, framer-motion, static-generation, city-pages, seo]

# Dependency graph
requires:
  - phase: 07-city-pages
    plan: "01"
    provides: CityData type, METROS_DATA array, CITY_DATA record with all 32 entries
  - phase: 04-join-page
    provides: join component visual patterns (JoinHero, FoodAsLanguageSection, ReserveSpotSection)
  - phase: 06-launch-flow
    provides: /launch route and LaunchCountdownFull component
provides:
  - CityHero component with eyebrow, headline, subhead, Reserve My Seat CTA to /launch?city=[slug]
  - CityFoodScene component with sceneIntro + 3-col sceneBlocks grid
  - CityPersonas component with 3 role cards linking to /join
  - CityReserve component mirroring ReserveSpotSection but with CTAs to /launch?city=[slug]
  - app/cities/[slug]/page.tsx dynamic route generating 32 static city pages
affects:
  - app/sitemap.ts (can now add /cities/[slug] URLs using METROS_DATA)
  - SEO coverage for all 32 metro markets

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component page rendering multiple "use client" components (same as homepage and join page pattern)
    - Next.js 15 async params pattern (Promise<{ slug: string }>) in generateMetadata and page component
    - CityReserve as standalone city-aware reserve section (copies tier data, overrides CTA hrefs) — avoids wrapping ReserveSpotSection which has no props

key-files:
  created:
    - components/cities/city-hero.tsx
    - components/cities/city-food-scene.tsx
    - components/cities/city-personas.tsx
    - components/cities/city-reserve.tsx
    - app/cities/[slug]/page.tsx
  modified: []

key-decisions:
  - "CityReserve does not wrap ReserveSpotSection — instead mirrors its tier data and card markup with /launch?city=[slug] CTAs satisfying CITY-06 pre-filtering requirement"
  - "CityFoodScene uses decorative Utensils icon placeholder instead of Unsplash images — v1 text-only per CITY-V2-01 scope note"
  - "id=food-scene on CityFoodScene section enables smooth scroll from CityHero Explore the scene anchor link"
  - "Pre-existing build failure in signup-step-username.tsx (api.users namespace missing from Convex codegen) deferred — pre-dates 07-02 work"

patterns-established:
  - "City page pattern: LandingHeader + CityHero + CityFoodScene + CityPersonas + CityReserve + JoinCtaFooter"
  - "City-aware CTA pattern: /launch?city=[slug] for all reserve seat CTAs on city pages"
  - "Persona card pattern: Lucide icon + role badge + cityHeadline + cityDescription + /join CTA"

requirements-completed: [CITY-01, CITY-02, CITY-03, CITY-04, CITY-05, CITY-06, CITY-07]

# Metrics
duration: 15min
completed: 2026-03-13
---

# Phase 07 Plan 02: City Page Components Summary

**4 city-specific React components and a dynamic Next.js route generating all 32 static metro city pages, each with hero, food scene, persona cards, and city-pre-filtered reserve CTAs**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-13T08:29:47Z
- **Completed:** 2026-03-13T08:45:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created 4 `components/cities/` components following established join page visual patterns (framer-motion animations, same Tailwind class conventions)
- CityHero renders eyebrow/headline/subhead from CityData and routes Reserve My Seat CTA to `/launch?city=[slug]`
- CityFoodScene renders sceneIntro + 3-col sceneBlocks grid with smooth scroll target `id="food-scene"`
- CityPersonas maps topPersonas to role cards (chef/mixologist/venueHost/curator/guest icons) with `/join` CTAs
- CityReserve mirrors ReserveSpotSection design but overrides all CTA hrefs to `/launch?city=[slug]` (CITY-06)
- `app/cities/[slug]/page.tsx` uses generateStaticParams to generate all 32 city paths, generateMetadata for per-city SEO title/description, notFound() for unknown slugs
- All city components compile with no TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 4 city components** - `984b6fe` (feat)
2. **Task 2: Create city page route with static generation** - `18e0c61` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `components/cities/city-hero.tsx` - Full-bleed hero with eyebrow, headline, subhead, Reserve My Seat CTA to /launch?city=[slug], Explore the scene scroll link
- `components/cities/city-food-scene.tsx` - sceneIntro + 3-col sceneBlocks grid, id=food-scene, staggered animations, decorative placeholder
- `components/cities/city-personas.tsx` - 3 role cards with Lucide icons, cityHeadline/Description, /join CTAs
- `components/cities/city-reserve.tsx` - Tier cards (Early Bird + Founding) mirroring ReserveSpotSection, all CTAs /launch?city=[slug]
- `app/cities/[slug]/page.tsx` - Server Component, generateStaticParams (32 slugs), generateMetadata (per-city title/description), notFound() for 404

## Decisions Made
- CityReserve does not wrap ReserveSpotSection — creates standalone section with same tier data and card markup but overrides all CTA hrefs to `/launch?city=${citySlug}`. This satisfies CITY-06 without modifying the existing component.
- CityFoodScene uses a decorative Utensils icon placeholder instead of Unsplash images per CITY-V2-01 scope note (images are v2 scope).
- `id="food-scene"` added to CityFoodScene section enabling smooth scroll from CityHero's "Explore the scene" anchor link.
- Next.js 15 async params pattern used: `const { slug } = await params` in both generateMetadata and the page component.

## Deviations from Plan

None — plan executed exactly as written.

**Note:** A pre-existing TypeScript build failure was discovered in `components/auth/signup-step-username.tsx` (api.users namespace missing from Convex generated types). This predates plan 07-02 and is out of scope. Logged to `deferred-items.md`.

## Issues Encountered

Pre-existing build failure in `signup-step-username.tsx` — `api.users.checkUsernameAvailability` references a `users` namespace not present in the current Convex generated API types. Verified via git that this existed before 07-02 work began. Logged to `.planning/phases/07-city-pages/deferred-items.md`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- All 32 city pages will render at `/cities/[slug]` once deployed (static generation via generateStaticParams)
- `/cities/chicago-il` renders Chicago's city-specific hero, food scene, personas, and reserve section
- All city CTAs pre-filter the launch flow to the respective city via `?city=[slug]`
- Sitemap can now include all 32 `/cities/[slug]` URLs using METROS_DATA

---
*Phase: 07-city-pages*
*Completed: 2026-03-13*
