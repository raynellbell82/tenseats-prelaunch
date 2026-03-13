---
phase: 08-why-tenseats-page
plan: 02
subsystem: ui
tags: [react, framer-motion, tailwind, next.js, convex, components]

# Dependency graph
requires:
  - phase: 08-why-tenseats-page
    provides: WhyHero, WhyProblem, WhyPersonas components from plan 01
  - phase: 06-launch-flow
    provides: LaunchCountdownFull component and getLaunchConfig Convex query
affects: [navigation links to /why-tenseats, homepage /why-tenseats link]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mobile-responsive table via overflow-x-auto container with min-w on table, gradient fade hints at edges"
    - "Convex loading pattern: config===undefined means loading, show pulsing placeholder"
    - "Server Component page route assembling Client Component sections — no use client at page level"

key-files:
  created:
    - components/why/why-economics.tsx
    - components/why/why-cta.tsx
    - app/why-tenseats/page.tsx
  modified: []

key-decisions:
  - "Sticky first column on table implemented via sticky left-0 bg-background — prevents feature names from scrolling out of view on mobile"
  - "WhyCta loading state: pulsing placeholder divs when config===undefined, countdown only when featureCountdownEnabled AND deadline present"
  - "/why-tenseats is a Server Component with Metadata export — follows join page pattern exactly"

patterns-established:
  - "Mobile-scrollable table: overflow-x-auto wrapper + min-w-[600px] on table + gradient fade hints on mobile edges"
  - "Convex launchConfig loading: undefined check = loading state, featureCountdownEnabled gate before rendering countdown"

requirements-completed: [WHY-01, WHY-05, WHY-06, WHY-07, WHY-08]

# Metrics
duration: 5min
completed: 2026-03-13
---

# Phase 08 Plan 02: Why Tenseats Page — Economics, CTA, Page Route Summary

**Mobile-responsive comparison table (WhyEconomics), countdown CTA section (WhyCta), and /why-tenseats Server Component page route assembling all 5 why sections with SEO metadata.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-13T10:22:23Z
- **Completed:** 2026-03-13T10:27:00Z
- **Tasks:** 3
- **Files modified:** 3 (all created)

## Accomplishments
- WhyEconomics comparison table: $1.99 Tenseats vs Eventbrite/Tock/Luma with amber column highlight, Check/X icons, mobile-scrollable with gradient fade hints
- WhyCta section: "The Insiders are already inside." headline, Convex-powered countdown with pulsing placeholder, "Become an Insider" amber CTA to /signup
- /why-tenseats page route as Server Component rendering all 5 sections in order with SEO metadata

## Task Commits

Each task was committed atomically:

1. **Task 1: Create WhyEconomics component** - `73c921a` (feat)
2. **Task 2: Create WhyCta component** - `73df0ba` (feat)
3. **Task 3: Create /why-tenseats page route** - `ffd920b` (feat)

## Files Created/Modified
- `components/why/why-economics.tsx` - Comparison table: $1.99/seat row, 4 competitor columns, mobile overflow-x-auto with edge gradient hints, amber Tenseats highlight column
- `components/why/why-cta.tsx` - CTA section with atmospheric orbs, LaunchCountdownFull from Convex, pulsing loading placeholder, "Become an Insider" button
- `app/why-tenseats/page.tsx` - Server Component page assembling LandingHeader + WhyHero + WhyProblem + WhyPersonas + WhyEconomics + WhyCta with Metadata export

## Decisions Made
- Sticky first column (`sticky left-0 bg-background`) on table so feature names remain visible when table scrolls horizontally on mobile
- WhyCta countdown gated on `config?.featureCountdownEnabled && config.deadline` — same pattern as HeroSection — shows pulsing placeholder while loading
- Page uses `import type { Metadata }` from next — keeps Server Component clean without additional runtime overhead

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in convex files (membershipWebhooks.ts, queueEmail.ts, platformSettings.ts, signup-step-username.tsx) are unrelated to this plan's scope — logged and ignored per deviation scope rules.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 08 fully complete — all 5 why sections implemented and routable at /why-tenseats
- /why-tenseats link in hero-section.tsx (from Phase 03) is now live
- No blockers for Phase 09

---
*Phase: 08-why-tenseats-page*
*Completed: 2026-03-13*
