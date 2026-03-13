---
phase: 11-nav-auth-wiring-fixes
plan: 01
subsystem: ui
tags: [nextjs, better-auth, otp, navigation, anchor-links]

# Dependency graph
requires:
  - phase: 08.1-cities-globe
    provides: CitiesGlobe component with sectionRef for scroll target
  - phase: 05-auth
    provides: authClient.emailOtp.sendVerificationOtp pattern
  - phase: 06-launch-flow
    provides: LaunchQueueSignupForm and joinQueue mutation
provides:
  - Cities nav links in desktop and mobile header scroll to /#cities-globe (no 404)
  - Queue signup form uses OTP email verification consistent with rest of site
affects:
  - navigation
  - launch-flow
  - auth

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hash anchor links (/#id) for same-page scroll navigation via Next.js Link"
    - "Queue join before OTP send: join queue first (no auth), then send OTP, redirect to /verify-email"

key-files:
  created: []
  modified:
    - components/landing/landing-header.tsx
    - components/landing/cities-globe.tsx
    - components/launch/launch-queue-signup-form.tsx

key-decisions:
  - "Queue signup form joins queue first (no auth required), then sends OTP — queue record created even if OTP fails"
  - "Cities nav links use /#cities-globe hash anchor — scrolls on homepage, navigates then scrolls from other pages"
  - "Removed account-already-exists error branch from queue form — no longer applicable without signUp.email"

patterns-established:
  - "OTP queue signup: joinQueue -> sendVerificationOtp -> sessionStorage -> /verify-email (same as login-form pattern)"

requirements-completed: [LAYO-03, LAYO-04]

# Metrics
duration: 4min
completed: 2026-03-13
---

# Phase 11 Plan 01: Nav & Auth Wiring Fixes Summary

**Cities nav links now scroll to /#cities-globe (no 404), and queue signup form uses OTP email verification via authClient.emailOtp.sendVerificationOtp — consistent with the rest of the site's auth flow**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-13T13:00:14Z
- **Completed:** 2026-03-13T13:05:11Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `id="cities-globe"` to CitiesGlobe section element and updated both desktop and mobile Cities nav links to `/#cities-globe` — zero 404s in navigation
- Removed password field from queue signup form schema, defaults, and UI; replaced `signUp.email` with `authClient.emailOtp.sendVerificationOtp`
- Queue signup now follows the correct flow: join queue -> send OTP -> redirect to /verify-email (matching the login-form.tsx pattern)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix Cities nav link to scroll to globe section** - `cc6e15b` (feat)
2. **Task 2: Align queue signup form with OTP auth** - `fbde37f` (feat)

**Plan metadata:** `[final-commit]` (docs: complete plan)

## Files Created/Modified
- `components/landing/landing-header.tsx` - Changed both desktop and mobile Cities links from `/cities` to `/#cities-globe`
- `components/landing/cities-globe.tsx` - Added `id="cities-globe"` to section element for anchor scroll target
- `components/launch/launch-queue-signup-form.tsx` - Removed password, replaced signUp.email with OTP flow

## Decisions Made
- Queue signup form joins queue first (no auth required), then sends OTP — this ensures the queue record exists even if the OTP send fails
- Removed the "account already exists" error branch since `signUp.email` is no longer called
- Updated "Create your account" heading to "Enter your email" to accurately reflect the email-only flow

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All v1.0 milestone gaps (LAYO-03, LAYO-04) are now closed
- Zero 404s in navigation — Cities links scroll to globe section
- Consistent OTP auth across all signup paths (login, signup wizard, queue signup)
- `npm run build` passes with zero TypeScript errors

---
*Phase: 11-nav-auth-wiring-fixes*
*Completed: 2026-03-13*
## Self-Check: PASSED

All files verified present. All commits verified in git log.
