---
phase: 02-layout-navigation
plan: 01
subsystem: ui
tags: [next-themes, convex, geist, layout, providers, footer, toaster, sonner]

# Dependency graph
requires:
  - phase: 01-scaffold
    provides: "Footer component, ConvexClientProvider, Toaster/sonner, lib/convex.tsx"
provides:
  - "app/providers.tsx: ThemeProvider (dark default) + ConvexClientProvider wrapper"
  - "app/layout.tsx: Root layout with Geist fonts, Providers, Footer, Toaster"
affects:
  - "03-landing-page"
  - "04-city-pages"
  - "05-membership-flow"
  - all subsequent phases (every page uses root layout)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Providers pattern: ThemeProvider > ConvexClientProvider > children"
    - "Root layout: html[suppressHydrationWarning] > body[font vars + antialiased min-h-screen flex flex-col] > Providers > main.flex-1 + Footer + Toaster"

key-files:
  created:
    - "app/providers.tsx"
  modified:
    - "app/layout.tsx"

key-decisions:
  - "defaultTheme='dark' in ThemeProvider so dark mode is applied on first load with no flash"
  - "suppressHydrationWarning on html element required by next-themes to suppress server/client mismatch warning"
  - "Footer and Toaster placed outside Providers children (inside Providers but sibling to main) so they receive theme context"
  - "SetupProvider removed — pre-launch site has no user setup flow"

patterns-established:
  - "Providers pattern: all client context (theme, data) composed in app/providers.tsx, imported into layout"
  - "Layout pattern: font variables on body, flex-col min-h-screen, main flex-1 for sticky footer"

requirements-completed: [LAYO-01, LAYO-02, LAYO-06]

# Metrics
duration: 5min
completed: 2026-03-12
---

# Phase 2 Plan 01: Providers and Root Layout Summary

**next-themes ThemeProvider (dark default) + ConvexClientProvider shell with Geist fonts, Footer, and Toaster in root layout**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-12T01:23:58Z
- **Completed:** 2026-03-12T01:28:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Created app/providers.tsx with ThemeProvider (defaultTheme="dark") wrapping ConvexClientProvider, no SetupProvider
- Rewrote app/layout.tsx with Geist/Geist_Mono fonts, proper metadata/viewport exports, and full app shell
- Dark theme applied by default on first load — suppressHydrationWarning prevents flash
- Footer renders at bottom of every page; Toaster available site-wide for notifications

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Providers and root layout** - `0e36b31` (feat)

## Files Created/Modified
- `app/providers.tsx` - Providers component: ThemeProvider (dark default) + ConvexClientProvider, no SetupProvider
- `app/layout.tsx` - Root layout: Geist fonts, metadata, viewport, Providers wrapper, Footer, Toaster

## Decisions Made
- `defaultTheme="dark"` chosen per LAYO-01 requirement — dark is required default, not system
- `suppressHydrationWarning` on `<html>` required by next-themes to avoid hydration mismatch warning when theme class is injected
- SetupProvider removed entirely — pre-launch site has no multi-step user setup wizard
- Footer and Toaster placed as siblings to `<main>` inside `<Providers>` so they receive theme context correctly

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- App shell complete — all subsequent pages will inherit dark theme, Convex data access, Footer, and Toaster
- Ready for Phase 2 Plan 02: Navigation (LandingHeader component)
- No blockers

---
*Phase: 02-layout-navigation*
*Completed: 2026-03-12*
