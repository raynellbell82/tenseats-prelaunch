---
phase: 24-vendor-success-page
plan: 01
subsystem: ui
tags: [stripe, convex, framer-motion, react, next.js, tailwind]

# Dependency graph
requires:
  - phase: 23-guest-success-page
    provides: SocialLinks shared component, PostSignupLayout with itemVariants, VerticalTimeline base component, guest page design patterns
  - phase: 22-verification-page
    provides: getUserRole Convex query, OTP → role-based routing to /launch/success/vendor
provides:
  - Vendor success page at /launch/success/vendor with role-specific headlines (chef, mixologist, creator, venueHost)
  - VerticalTimeline extended with optional action ReactNode slot (backward-compatible)
  - Stripe Express Connect API route at /api/stripe/connect (POST)
affects:
  - 25-onboarding-persistence (Stripe Connect flow, vendor page patterns)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Role-to-copy mapping via Record<string, string> for role-specific headlines
    - Stripe Express Connect account + account link creation in API route (no persistence yet)
    - VerticalTimeline action slot: optional ReactNode rendered below step detail

key-files:
  created:
    - app/api/stripe/connect/route.ts
    - app/launch/success/vendor/page.tsx
  modified:
    - components/post-signup/vertical-timeline.tsx

key-decisions:
  - "Vendor success page visual checkpoint approved: role headlines, Stripe step, Zoho One card, and social links confirmed on-brand"
  - "Stripe Connect in Phase 24 is stateless (no account ID persistence) — Phase 25 ONBOARD-01/02 handles persistence"
  - "getUserRole useQuery has skip condition when session not verified to prevent Convex auth errors on unauthenticated access"
  - "VerticalTimeline action slot is backward-compatible — guest page passes no action prop and renders identically"
  - "Zoho One affiliate link (go.zoho.com/Slvq) presented as partner recommendation card between timeline and social links"

patterns-established:
  - "Pattern 1: Role-to-headline map using Record<string, string> with fallback for unknown roles"
  - "Pattern 2: Stripe Connect flow — POST /api/stripe/connect returns onboarding URL, client redirects via window.location.href"
  - "Pattern 3: Timeline action slot — optional ReactNode in TimelineStep renders interactive elements inline with step"

requirements-completed: [VSUCCESS-01, VSUCCESS-02, VSUCCESS-03, VSUCCESS-04]

# Metrics
duration: ~45min
completed: 2026-03-14
---

# Phase 24 Plan 01: Vendor Success Page Summary

**Vendor-specific post-signup experience with role-mapped headlines (chef/mixologist/creator/venueHost), optional Stripe Express Connect onboarding step via new API route, Zoho One partner recommendation card, and shared SocialLinks — replacing the stub page.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-03-14
- **Completed:** 2026-03-14
- **Tasks:** 3 (2 auto + 1 checkpoint, approved)
- **Files modified:** 3

## Accomplishments

- Extended VerticalTimeline with a backward-compatible optional `action` ReactNode slot per step, used for the inline Stripe Connect button
- Created Stripe Express Connect API route that creates an Express account and returns an onboarding URL — stateless for now, persistence deferred to Phase 25
- Built full vendor success page: green check pulse, role-specific headline (4 roles mapped), body copy, 3-step timeline with Stripe button, click-to-copy support email, Zoho One card, and social links
- Auth guard redirects unauthenticated or unverified users back to /launch; getUserRole query skipped when session not verified to prevent Convex auth errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend VerticalTimeline and create Stripe Connect API route** - `8520113` (feat)
2. **Task 2: Build vendor success page** - `aebee23` (feat)
3. **Hotfix: skip getUserRole when unverified** - `ca23d55` (fix — deviation Rule 1)
4. **Task 3: Visual verification checkpoint** - approved by user (no code changes)

## Files Created/Modified

- `components/post-signup/vertical-timeline.tsx` — Added optional `action?: ReactNode` to TimelineStep interface; rendered below step detail when present
- `app/api/stripe/connect/route.ts` — POST handler: creates Stripe Express account + account link, returns onboarding URL
- `app/launch/success/vendor/page.tsx` — Full vendor success page replacing stub; role-to-headline map, Stripe Connect button handler, Zoho One card, SocialLinks, auth guard

## Decisions Made

- Stripe Connect flow is intentionally stateless in Phase 24 (no Convex write to persist stripeAccountId) — Phase 25 handles persistence once schema coordination is confirmed
- getUserRole query uses `skip: !session?.user?.emailVerified` to avoid Convex auth errors when page is hit unauthenticated (deviation auto-fixed during Task 2 verification)
- Zoho One card positioned between timeline and social links with bordered card styling for visual distinction from content sections

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added skip condition to getUserRole useQuery**
- **Found during:** Task 2 (Build vendor success page)
- **Issue:** useQuery called getUserRole unconditionally, causing Convex auth errors when page visited without valid session (before auth guard redirect fires)
- **Fix:** Added `skip: !session?.user?.emailVerified` to useQuery call so Convex query only runs when user is verified
- **Files modified:** app/launch/success/vendor/page.tsx
- **Verification:** TypeScript compiled cleanly; page loads without Convex errors in unauthenticated state
- **Committed in:** ca23d55 (hotfix commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Fix required for correct operation — Convex queries throw when called without valid auth context before redirect fires.

## Issues Encountered

None beyond the auto-fixed useQuery skip condition above.

## User Setup Required

None — STRIPE_SECRET_KEY was already present in .env.local from membership checkout (Phase 18). No new environment variables required.

## Next Phase Readiness

- Vendor success page complete and approved; design language fully consistent with guest success page
- VerticalTimeline action slot available for Phase 25 if needed
- Stripe Connect API route ready — Phase 25 ONBOARD-01/02 can extend with Convex persistence (stripeCustomerId / account ID write-back)
- No blockers for Phase 25

---
*Phase: 24-vendor-success-page*
*Completed: 2026-03-14*
