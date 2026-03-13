---
phase: 02-layout-navigation
plan: "02"
subsystem: ui
tags: [next.js, react, convex, next-themes, shadcn, lucide-react, tailwind]

# Dependency graph
requires:
  - phase: 02-layout-navigation
    provides: Providers (ThemeProvider, ConvexClientProvider) required for useTheme and useQuery hooks
  - phase: 01-scaffold
    provides: UI components (Button, Sheet), lib/utils (fixUploadUrl), Convex generated API

provides:
  - LandingHeader component with logo, desktop nav (4 links), theme toggle, and mobile hamburger Sheet menu

affects:
  - Phase 3+ pages that import LandingHeader
  - Any page needing /join, /why-tenseats, /cities, /login navigation

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Mobile-first responsive nav via md:hidden / hidden md:flex class split
    - Sheet component (shadcn) for slide-out mobile menu with SheetClose on each link
    - useState for controlled Sheet open/close state

key-files:
  created:
    - components/landing/landing-header.tsx
  modified: []

key-decisions:
  - "SheetClose asChild wraps each mobile nav link so Sheet auto-closes on any link tap without JS workarounds"
  - "Theme toggle positioned outside the hidden md:flex block so it is always visible on all viewports"
  - "useState(mobileOpen) used for controlled Sheet so links can close it programmatically"
  - "SheetTitle with sr-only class added to satisfy Radix UI accessibility requirement for DialogTitle"

patterns-established:
  - "Pattern: All landing page shared chrome (header/footer) lives in components/landing/ — per-page inclusion in Phase 3+"

requirements-completed:
  - LAYO-03
  - LAYO-04
  - LAYO-05

# Metrics
duration: 5min
completed: 2026-03-12
---

# Phase 2 Plan 02: LandingHeader — Nav, Logo, Theme Toggle, Mobile Menu Summary

**LandingHeader component with Convex logo, 4-link desktop nav (Join/Why Tenseats/Cities/Log in), Sun/Moon theme toggle, and Sheet-based hamburger menu for mobile (375px+)**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-12T03:29:29Z
- **Completed:** 2026-03-13T01:55:00Z
- **Tasks:** 2 of 2 complete (Task 2: human-verify approved)
- **Files modified:** 1

## Accomplishments

- Created `components/landing/` directory and `landing-header.tsx` as primary shared header
- Desktop nav includes Join (amber-400), Why Tenseats, Cities, Log in (muted) links hidden on mobile via `hidden md:flex`
- Mobile hamburger (Menu icon) triggers Sheet (side="right") with identical nav links, each wrapped in SheetClose for auto-close on tap
- Logo loads from Convex `platformSettings.getLogoUrl` / `getDarkLogoUrl` with dark mode variant switching; falls back to platform name text
- Theme toggle (Sun/Moon icons) always visible at all viewports, switches dark/light via next-themes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create LandingHeader with nav links and mobile menu** - `cd4be80` (feat)
2. **Accessibility fix (post-approval): add SheetTitle sr-only** - `cb56ea4` (fix)

**Plan metadata:** `13e32aa` (docs: complete LandingHeader plan)

## Files Created/Modified

- `components/landing/landing-header.tsx` - Full LandingHeader component with logo, nav, theme toggle, mobile Sheet menu

## Decisions Made

- SheetClose wraps each mobile nav link directly (asChild pattern) — cleanest way to close Sheet on navigation without extra handler functions
- Theme toggle placed outside the `hidden md:flex` nav block so it shows at all viewport widths
- `useState(mobileOpen)` used as controlled Sheet state, enabling programmatic close if needed in future

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added SheetTitle with sr-only for Radix accessibility**
- **Found during:** Post-approval (after Task 2 human-verify checkpoint)
- **Issue:** Radix UI Sheet requires a DialogTitle (SheetTitle) for screen reader accessibility; its absence triggers a console warning
- **Fix:** Added `<SheetTitle className="sr-only">Navigation menu</SheetTitle>` inside SheetContent
- **Files modified:** components/landing/landing-header.tsx
- **Verification:** Component renders without Radix accessibility warning
- **Committed in:** `cb56ea4`

---

**Total deviations:** 1 auto-fixed (1 missing critical / accessibility)
**Impact on plan:** Accessibility fix required for correct screen reader behavior. No scope creep.

## Issues Encountered

None. Pre-existing TypeScript errors in `components/auth/` (missing `@/lib/validations/auth` module) and `convex/launch/seed.ts` are unrelated to this plan and were present before execution.

## User Setup Required

None - no external service configuration required for this plan.

## Next Phase Readiness

- `LandingHeader` is ready for per-page inclusion starting in Phase 3 (human-verified)
- All LAYO requirements addressed: LAYO-01/02/06 in plan 01, LAYO-03/04/05 in this plan
- Component requires `ThemeProvider` and `ConvexClientProvider` in the tree (provided by root layout from Plan 01)
- No blockers — Phase 2 complete

---
*Phase: 02-layout-navigation*
*Completed: 2026-03-12*
