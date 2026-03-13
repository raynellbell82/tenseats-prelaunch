---
phase: 10-wire-city-slug-launch
plan: 01
subsystem: ui
tags: [react, convex, next.js, launch-flow, city-pages]

# Dependency graph
requires:
  - phase: 06-launch-flow
    provides: LaunchPageContent with initialCitySlug prop (previously accepted but ignored)
  - phase: 07-city-pages
    provides: City pages linking to /launch?city=[slug] via CITY-06 CTAs
provides:
  - City slug to metro ID resolution in LaunchPageContent via listActiveMetros query
  - initialValue prop on LaunchCitySearch that pre-fills the search input
  - Slot grid auto-renders on /launch?city=[slug] without user interaction
affects:
  - city-pages (CTAs now complete the full funnel end-to-end)
  - launch-flow (pre-selection state now wired through)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useRef hasInitialized guard prevents re-initialization on subsequent renders
    - Two-level prop threading: page.tsx -> LaunchPageContent -> LaunchCitySearch

key-files:
  created: []
  modified:
    - components/launch/launch-city-search.tsx
    - app/launch/launch-page-content.tsx

key-decisions:
  - "initialValue pre-fills search text only — dropdown is NOT opened; parent handles metro ID selection separately via its own useEffect"
  - "LaunchPageContent calls listActiveMetros independently (not sharing LaunchCitySearch's internal query) — decouples resolution logic from UI"

patterns-established:
  - "hasInitialized ref pattern: useRef(false) guard ensures one-time initialization effects do not fight user input on subsequent renders"

requirements-completed: [LNCH-01, CITY-06]

# Metrics
duration: 3min
completed: 2026-03-13
---

# Phase 10 Plan 01: Wire City Slug to Launch Flow Summary

**City-page-to-launch funnel completed: /launch?city=chicago-il now pre-selects Chicago and renders the slot grid immediately via listActiveMetros query resolution**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T12:20:05Z
- **Completed:** 2026-03-13T12:23:02Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added optional `initialValue` prop to `LaunchCitySearch` with `useRef` guard to pre-fill search input on mount without opening the dropdown
- Added `useQuery(api.metros.listActiveMetros)` to `LaunchPageContent` and a `useEffect` that resolves `initialCitySlug` to a metro ID, triggering `setSelectedMetroId` so the slot grid renders without user interaction
- Invalid or missing city slugs degrade gracefully: no crash, empty search, no slot grid shown

## Task Commits

Each task was committed atomically:

1. **Task 1: Add initialValue prop to LaunchCitySearch** - `9aad3ee` (feat)
2. **Task 2: Resolve initialCitySlug to metro ID in LaunchPageContent** - `31d4a83` (feat)

## Files Created/Modified

- `components/launch/launch-city-search.tsx` - Added optional `initialValue` prop, `hasInitialized` ref, and mount-only `useEffect` to pre-fill search state
- `app/launch/launch-page-content.tsx` - Added `useRef`, `useEffect` imports; added `listActiveMetros` query; added slug resolution effect; passed `initialValue` to `LaunchCitySearch`

## Decisions Made

- `initialValue` only fills the search input text — it does NOT open the dropdown or call `onSelect`. The parent `LaunchPageContent` handles metro ID selection via its own separate `useEffect`. This cleanly separates concerns.
- `LaunchPageContent` calls `listActiveMetros` independently rather than receiving the metro object from `LaunchCitySearch`. Keeps resolution logic at the page level where `selectedMetroId` state lives.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The city-page-to-launch funnel is fully wired end-to-end: city page CTA -> /launch?city=[slug] -> pre-selected city -> slot grid visible immediately
- All 32 city pages' CTAs now deliver a seamless pre-filtered launch experience
- No further work required for this gap closure

---
*Phase: 10-wire-city-slug-launch*
*Completed: 2026-03-13*
