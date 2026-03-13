---
phase: 07-city-pages
plan: "01"
subsystem: ui
tags: [typescript, city-data, seo, copy, static-data]

# Dependency graph
requires:
  - phase: 01-scaffold
    provides: lib/ directory and TypeScript project structure
provides:
  - CityData TypeScript type with all required fields
  - METROS_DATA array re-exported for client-side use without Convex dependency
  - CITY_DATA record with 32 entries covering all metros, tiers 1-3
  - All city hero copy, scene blocks, persona data, and SEO metadata
affects:
  - 07-city-pages (plan 02+): all city page components read from CITY_DATA
  - app/cities/[slug]/page.tsx: imports CITY_DATA and METROS_DATA
  - app/sitemap.ts: imports METROS_DATA for URL generation

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Static data file pattern for city content (avoids Convex dependency in components)
    - CityData type with sceneBlocks tuple (exactly 3) enforced at TypeScript level
    - METROS_DATA re-exported from lib/ for client-side generateStaticParams use

key-files:
  created:
    - lib/city-data.ts
  modified: []

key-decisions:
  - "METROS_DATA copied verbatim from convex/metros.ts and re-exported from lib/city-data.ts — city page components import from a single lib/ source, never from Convex server code directly"
  - "sceneBlocks typed as 3-element tuple to enforce exactly 3 blocks at compile time"
  - "Tier 3 city copy uses pattern-derived metaTagline/metaDescription/sceneBlocks/topPersonas based on provided heroHeadline, heroSubhead, sceneIntro from project prompt"
  - "All heroSubhead values verified at 25 words or fewer via validation script — none exceed the hard cap"

patterns-established:
  - "City data pattern: all 32 city entries keyed by slug matching METROS_DATA name field exactly"
  - "Tier classification: tier 1 (chicago, austin, atlanta), tier 2 (12 cities), tier 3 (17 cities)"
  - "Persona data pattern: role enum + cityHeadline + cityDescription (20-35 words) per entry"

requirements-completed: [CITY-08, CITY-09, CITY-10]

# Metrics
duration: 25min
completed: 2026-03-13
---

# Phase 07 Plan 01: City Data Summary

**CityData TypeScript type, METROS_DATA re-export, and CITY_DATA record with all 32 metro entries including hero copy, sceneBlocks, topPersonas, SEO metadata, and tier classification**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-13T03:45:00Z
- **Completed:** 2026-03-13T04:07:38Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Created `lib/city-data.ts` with CityData TypeScript type matching project prompt spec exactly
- Re-exported METROS_DATA array (32 entries) from convex/metros.ts for client-side use without Convex server dependency
- Populated CITY_DATA with all 32 metro entries — Tier 1 (3), Tier 2 (12), Tier 3 (17)
- All heroSubhead values verified under 25-word hard max (validation script confirmed 0 violations)
- Tier 3 entries include derived metaTagline, metaDescription, sceneBlocks, and topPersonas following established patterns
- TypeScript compiles cleanly with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CityData type and METROS_DATA re-export** - `d6bc8b5` (feat)
2. **Task 2: Populate all 32 city entries in CITY_DATA** - `7dbd085` (feat)

## Files Created/Modified
- `lib/city-data.ts` - CityData type, METROS_DATA array (32 entries), CITY_DATA record (32 entries)

## Decisions Made
- METROS_DATA copied verbatim from convex/metros.ts and re-exported from lib/city-data.ts — city page components can import from a single lib/ source without depending on Convex server code
- sceneBlocks typed as a 3-element tuple `[block, block, block]` to enforce exactly 3 blocks at TypeScript compile time
- Tier 3 city entries use a consistent derivation pattern: metaTagline follows `[City]'s Curated Food Events` format, metaDescription is ~150 chars following Tier 1 patterns, sceneBlocks derived from sceneIntro content, topPersonas include chef + guest + one other relevant role
- All Tier 1 and Tier 2 copy transcribed exactly from the project prompt — no paraphrasing

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript compilation clean, validation script confirmed all 32 entries present, all slugs match METROS_DATA names, all heroSubhead values under 25 words.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- `lib/city-data.ts` is ready to be imported by city page components (plan 07-02+)
- `METROS_DATA` is ready to power `generateStaticParams()` in `app/cities/[slug]/page.tsx`
- `CITY_DATA` provides all copy for CityHero, CityFoodScene, CityPersonas components
- All 32 metro slugs from CITY_DATA match METROS_DATA names exactly — no slug mismatch issues expected

---
*Phase: 07-city-pages*
*Completed: 2026-03-13*
