---
phase: 08-why-tenseats-page
plan: 01
subsystem: ui
tags: [react, framer-motion, tailwind, next.js, components]

# Dependency graph
requires:
  - phase: 04-join-page
    provides: JoinHero atmospheric pattern, card component conventions, CTA button styles
provides:
  - WhyHero component with locked headline and atmospheric styling
  - WhyProblem two-column problem/solution layout
  - WhyPersonas 6 persona role cards with /join CTA
affects: [08-why-tenseats-page plan 02 — remaining two components + page assembly]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "why/* components follow same use client + framer-motion whileInView pattern as join/* components"
    - "x-axis slide-in animations for opposing two-column layouts (left col from -x, right col from +x)"
    - "Staggered card entrance with index * 0.1 delay per card"

key-files:
  created:
    - components/why/why-hero.tsx
    - components/why/why-problem.tsx
    - components/why/why-personas.tsx
  modified: []

key-decisions:
  - "No CTA button in WhyHero — scroll-down ChevronDown only, per plan spec"
  - "WhyProblem uses x-axis (horizontal) slide animations instead of y-axis — visually differentiates opposing columns"
  - "Vertical gradient divider in WhyProblem is decorative absolute div with gradient-to-b — hidden on mobile"
  - "Network icon used for Facilitator role (not Handshake) — Handshake not available in current lucide-react version"

patterns-established:
  - "why/* atmospheric gradient orbs: same 3-orb pattern as join/join-hero.tsx"
  - "Persona cards: rounded-2xl border/50 bg-card/50 hover:border-border — reusable for any role grid"

requirements-completed: [WHY-01, WHY-02, WHY-03, WHY-04, WHY-08]

# Metrics
duration: 2min
completed: 2026-03-13
---

# Phase 08 Plan 01: Why Tenseats Page — Hero, Problem, Personas Summary

**Three Client Components building the narrative top-half of /why-tenseats: WhyHero with atmospheric orbs and locked "Built different. On purpose." headline, WhyProblem two-column problem/solution layout with x-axis slide animations, and WhyPersonas 6-card role grid with amber /join CTA.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-13T04:38:13Z
- **Completed:** 2026-03-13T04:40:05Z
- **Tasks:** 3
- **Files modified:** 3 (all created)

## Accomplishments
- WhyHero component with full atmospheric treatment matching JoinHero pattern — gradient orbs, grain texture, staggered entrance animations, no CTA
- WhyProblem two-column layout with opposing x-axis animations, amber-accented solution label, gradient vertical divider on desktop
- WhyPersonas 6 persona cards (Guest, Chef, Mixologist, Curator, Venue Host, Facilitator) with staggered whileInView animations and amber "Find your seat" CTA to /join

## Task Commits

Each task was committed atomically:

1. **Task 1: Create WhyHero component** - `b58dcda` (feat)
2. **Task 2: Create WhyProblem component** - `36fcbf0` (feat)
3. **Task 3: Create WhyPersonas component** - `74cad06` (feat)

## Files Created/Modified
- `components/why/why-hero.tsx` - Hero section with "Built different. On purpose." headline, atmospheric orbs, grain texture, scroll indicator
- `components/why/why-problem.tsx` - Two-column problem/solution layout with "Sponsored. Optimized. Irrelevant." vs "The whisper, surfaced."
- `components/why/why-personas.tsx` - 6 persona role cards with icons, descriptions, and /join CTA

## Decisions Made
- No CTA button in WhyHero — scroll-down ChevronDown only per plan spec
- WhyProblem uses x-axis slide animations for opposing columns (aesthetically appropriate for two-column vs. y-axis used elsewhere)
- Network icon used for Facilitator role — Handshake not available in current lucide-react version installed
- Vertical gradient divider implemented as absolute positioned div with gradient-to-b, not a border — avoids layout impact on grid

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npx tsc --noEmit components/why/why-hero.tsx` showed `--jsx` flag errors when running on a single file directly. This is expected Next.js behavior — `tsc` without tsconfig context lacks jsx configuration. Verified correctly using `npx tsc --noEmit` with project tsconfig, which returned zero errors for all three files.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Three components ready for integration in plan 08-02 (WhyValues + WhyClosing + /why-tenseats page assembly)
- All components export named functions following established conventions
- CTA in WhyPersonas links to /join which exists and is functional

---
*Phase: 08-why-tenseats-page*
*Completed: 2026-03-13*
