---
phase: 06-launch-flow
plan: 02
subsystem: ui
tags: [nextjs, convex, stripe, react, checkout, tier-selector, countdown]

# Dependency graph
requires:
  - phase: 06-launch-flow-plan-01
    provides: Launch page, queue page, and LandingHeader pattern
  - phase: 01-scaffold
    provides: Convex backend, schema, membershipCheckout action, queue mutations/queries
provides:
  - /launch/checkout page with tier selection, countdown, and Stripe redirect
  - /launch/success confirmation page after payment
  - /launch/expired page with rejoin queue functionality
affects: [06-launch-flow, payments, user-flow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component + Client Component pair for interactive pages (page.tsx + *-page-content.tsx)
    - useAction from convex/react for Convex actions (vs useMutation for mutations)
    - sessionStorage with SSR-safe useEffect + mounted state for client-side ID persistence
    - URL searchParams fallback for preRegistrationId (Stripe cancel_url includes it)

key-files:
  created:
    - app/launch/checkout/page.tsx
    - app/launch/checkout/checkout-page-content.tsx
    - app/launch/success/page.tsx
    - app/launch/expired/page.tsx
    - app/launch/expired/expired-page-content.tsx
  modified: []

key-decisions:
  - "Expired page uses separate expired-page-content.tsx client component (not inline) for consistency with checkout pattern"
  - "checkout-page-content reads preRegistrationId from sessionStorage first, URL searchParams second (handles Stripe cancel_url redirect)"
  - "selectedTier initialized to early_bird then updated via useEffect when checkoutData loads (avoids undefined state)"
  - "Rejoin button only shown when preRegId is available and mounted (prevents SSR mismatch)"

patterns-established:
  - "Server Component page.tsx wraps LandingHeader + Client Content component"
  - "Client Component uses useEffect + mounted flag for SSR-safe sessionStorage access"
  - "useAction (not useMutation) for Convex actions that hit external APIs (Stripe)"

requirements-completed: [LNCH-04, LNCH-05, LNCH-06, LNCH-08]

# Metrics
duration: 3min
completed: 2026-03-12
---

# Phase 6 Plan 02: Launch Checkout Flow Summary

**Three checkout flow pages: /launch/checkout with tier selection + 10-min countdown + Stripe redirect, /launch/success confirmation, and /launch/expired with rejoin queue**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T03:33:24Z
- **Completed:** 2026-03-13T03:35:46Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- /launch/checkout renders tier selector (TierSelector), countdown timer (CheckoutCountdown), and Stripe redirect via createMembershipCheckout action
- /launch/success shows "Welcome to Tenseats" confirmation with Back to Home link
- /launch/expired shows expired message with Rejoin Queue button (calls rejoinQueue mutation) and Back to Launch fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: /launch/checkout page with tier selector, countdown, and Stripe redirect** - `334112e` (feat)
2. **Task 2: /launch/success and /launch/expired pages** - `2b6d037` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `app/launch/checkout/page.tsx` - Server Component: LandingHeader + CheckoutPageContent
- `app/launch/checkout/checkout-page-content.tsx` - Client Component: reads preRegId from sessionStorage/URL, queries checkout data, renders countdown + tier selector + payment button
- `app/launch/success/page.tsx` - Server Component: CheckCircle2 icon, "Welcome to Tenseats" heading, Back to Home link
- `app/launch/expired/page.tsx` - Server Component: LandingHeader + ExpiredPageContent
- `app/launch/expired/expired-page-content.tsx` - Client Component: Clock icon, rejoin queue mutation, Back to Launch link

## Decisions Made
- checkout-page-content reads preRegistrationId from sessionStorage first, URL searchParams second — handles Stripe cancel_url which appends `?preRegistrationId=` to the cancel URL
- Expired page split into page.tsx + expired-page-content.tsx pair to match checkout pattern and keep Server Components clean
- selectedTier state initialized to "early_bird" then updated via useEffect when checkoutData loads — avoids race condition during mount

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Pre-existing TypeScript errors in components/auth/signup-step-username.tsx, components/auth/signup-step-metro.tsx, and convex/launch/seed.ts were present before this plan and are out of scope.

## User Setup Required

None - no external service configuration required beyond what was already set up.

## Next Phase Readiness
- All checkout flow pages are complete. Together with Plan 01's /launch and /launch/queue pages, the entire launch funnel is complete.
- No blockers for remaining phases.

---
*Phase: 06-launch-flow*
*Completed: 2026-03-12*

## Self-Check: PASSED

- FOUND: app/launch/checkout/page.tsx
- FOUND: app/launch/checkout/checkout-page-content.tsx
- FOUND: app/launch/success/page.tsx
- FOUND: app/launch/expired/page.tsx
- FOUND: app/launch/expired/expired-page-content.tsx
- FOUND: commit 334112e (Task 1)
- FOUND: commit 2b6d037 (Task 2)
