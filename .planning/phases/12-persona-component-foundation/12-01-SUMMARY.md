---
phase: 12-persona-component-foundation
plan: 01
subsystem: ui
tags: [react, framer-motion, svg, typescript, next]

# Dependency graph
requires: []
provides:
  - "Custom monoline SVG icon components for all 6 persona roles"
  - "Shared PersonaCard component used by both city and why sections"
  - "CityData type extended with facilitator role"
  - "city-personas.tsx refactored to 3x2/2x3/1x6 grid with section CTA"
  - "why-personas.tsx refactored to use shared PersonaCard and custom icons"
affects: [13-city-persona-copy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared component pattern: PersonaCard used by multiple sections with optional props for context-specific fields"
    - "Custom SVG icon pattern: monoline stroke=currentColor icons for theme inheritance"
    - "personaIconMap as const: role-keyed icon lookup for both static and dynamic sections"

key-files:
  created:
    - "components/icons/persona-icons.tsx"
    - "components/shared/persona-card.tsx"
  modified:
    - "lib/city-data.ts"
    - "components/cities/city-personas.tsx"
    - "components/why/why-personas.tsx"

key-decisions:
  - "City personas CTA links to /launch?city=[slug] not /join (city-specific conversion)"
  - "why-personas CTA stays at /join (no city context)"
  - "PersonaCard headline prop is optional — city-personas passes it, why-personas omits it"
  - "Role badge uses <p> not <span> for block layout below icon container"

patterns-established:
  - "PersonaCard: icon + role + optional headline + description — city sections add headline, generic sections omit it"
  - "personaIconMap as const: all role lookups go through this map, no direct Lucide persona icons"

requirements-completed: [COMP-01, COMP-02, COMP-03, DATA-02]

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 12 Plan 01: Persona Component Foundation Summary

**Custom monoline SVG icons, shared PersonaCard component, and 6-persona responsive grid replacing Lucide icons in both city and why sections**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-13T14:32:44Z
- **Completed:** 2026-03-13T14:40:30Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Added "facilitator" to CityData topPersonas role union — TypeScript accepts all 6 roles
- Created 6 custom monoline SVG icons (GuestIcon, ChefIcon, MixologistIcon, CuratorIcon, VenueHostIcon, FacilitatorIcon) with currentColor stroke and personaIconMap export
- Created shared PersonaCard component with framer-motion scroll animation, optional headline, role badge, and dark card design
- Refactored city-personas.tsx: fixed grid (sm:grid-cols-2 was wrong sm:grid-cols-3), removed per-card CTAs, added section-level amber CTA to /launch?city=[slug]
- Refactored why-personas.tsx: replaced Lucide icons with custom SVG icons via PersonaCard, kept /join CTA intact

## Task Commits

Each task was committed atomically:

1. **Task 1: Update CityData type and create custom persona icon components** - `7775650` (feat)
2. **Task 2: Create shared PersonaCard component** - `28399a0` (feat)
3. **Task 3: Rewire city-personas and why-personas** - `f71202c` (feat)

**Plan metadata:** (docs commit pending)

## Files Created/Modified
- `lib/city-data.ts` - Added "facilitator" to topPersonas role union
- `components/icons/persona-icons.tsx` - 6 custom monoline SVG icons + personaIconMap
- `components/shared/persona-card.tsx` - Shared PersonaCard component with framer-motion
- `components/cities/city-personas.tsx` - Refactored to PersonaCard + custom icons + section CTA
- `components/why/why-personas.tsx` - Refactored to PersonaCard + custom icons, Lucide removed

## Decisions Made
- City personas CTA links to `/launch?city=[slug]` per plan specification (city-specific conversion path)
- why-personas CTA remains at `/join` (no city context available in that section)
- PersonaCard `headline` prop is optional — city-personas uses it for city-specific headlines, why-personas omits it (only role + description shown)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. TypeScript type errors in city-personas.tsx during Task 1 were expected intermediate state (old roleIconMap not yet including facilitator) — resolved when city-personas was rewritten in Task 3.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 13 (City Persona Copy) can now proceed: PersonaCard supports 6 roles, CityData type accepts facilitator, grid layout is correct
- Existing 32 cities have 5 personas each — Phase 13 will add city-specific facilitator persona data
- Both sections render correctly with the shared component; custom icons are in place

---
*Phase: 12-persona-component-foundation*
*Completed: 2026-03-13*
