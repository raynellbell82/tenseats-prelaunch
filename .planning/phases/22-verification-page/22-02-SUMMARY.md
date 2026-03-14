---
phase: 22-verification-page
plan: 02
subsystem: ui
tags: [convex, next-app-router, otp, email-verification, routing]

# Dependency graph
requires:
  - phase: 22-01
    provides: PostSignupLayout, VerticalTimeline, /launch/verify page, stub success routes
provides:
  - getUserRole Convex query on userRoles table (by_user index) for post-OTP routing
  - Role-based post-verification routing in verify-email-form.tsx — vendors to /launch/success/vendor, guests to /launch/success/guest
affects:
  - 23-guest-success
  - 24-vendor-success

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useQuery with "skip" pattern to lazily enable role query only after OTP verification succeeds
    - useRef to avoid stale closure in setTimeout callback when reading reactive query result

key-files:
  created: []
  modified:
    - components/auth/verify-email-form.tsx
    - convex/launch/queue.ts

key-decisions:
  - "getUserRole query added to convex/launch/queue.ts (reuses existing authHelpers.getAppUserId) — no new Convex file needed"
  - "useRef pattern for userRoleRef avoids stale closure: useCallback memoizes on [email, router, attempts] so role value must be read from ref at setTimeout fire time"
  - "Fallback to /launch/success/guest when role is undefined (still loading) or null (no role found) — safe default for guest-type users who signed up without a vendor role"

patterns-established:
  - "useQuery + useRef combo: for reactive values needed inside stable callbacks, store in ref and read at callback execution time"

requirements-completed: [VERIFY-01]

# Metrics
duration: 5min
completed: 2026-03-14
---

# Phase 22 Plan 02: Verification Page (Routing) Summary

**getUserRole Convex query + role-based post-OTP routing in verify-email-form — vendors route to /launch/success/vendor, guests to /launch/success/guest via useRef-backed stale-closure fix**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-14T22:15:00Z
- **Completed:** 2026-03-14T22:20:00Z
- **Tasks:** 1 code task + 1 human-verify checkpoint
- **Files modified:** 2

## Accomplishments

- Added `getUserRole` query to `convex/launch/queue.ts`: queries `userRoles` table via `by_user` index using `getAppUserId` helper, returns role string or null for unauthenticated/no-role users
- Modified `verify-email-form.tsx`: `useQuery(api.launch.queue.getUserRole, verified ? {} : "skip")` enables query only after OTP verification succeeds; `userRoleRef` stores latest value to prevent stale closure in setTimeout
- Post-OTP redirect now routes vendor roles (chef, mixologist, venueHost, creator) to `/launch/success/vendor` and guest/fallback to `/launch/success/guest`; 1500ms animation delay preserved

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire role-based post-verification routing** - `afe00db` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `convex/launch/queue.ts` - Added `getUserRole` query, `getAppUserId` import, VENDOR_ROLES constant
- `components/auth/verify-email-form.tsx` - Added `useQuery`, `api`, `VENDOR_ROLES`; role-based redirect logic with `userRoleRef`

## Decisions Made

- `getUserRole` placed in `convex/launch/queue.ts` rather than a new file — launch-domain queries belong together, and profile.ts already handles mutation
- `useRef` pattern chosen over adding `userRole` to `useCallback` deps — adding it would cause `submitOtp` to re-create on every query update (every re-render after verification), which is unnecessary and slightly wasteful
- Fallback destination `/launch/success/guest` when role is `undefined` (query still loading) or `null` (no role row) — matches CONTEXT.md decision: guest is the safe default for new users who may not yet have a role row

## Deviations from Plan

None - plan executed exactly as written. The `useRef` pattern was an implementation detail the plan anticipated ("If a direct Convex query inside the callback is not feasible (hook rules), an alternative: add a useQuery for userRoles at the component level").

## Issues Encountered

None beyond standard TypeScript verification (passed clean on first run).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full VERIFY-01 flow is code-complete: queue signup -> /launch/verify -> OTP entry -> role-based success stub
- Stub routes /launch/success/guest and /launch/success/vendor await Phases 23/24 to build real content
- getUserRole query is reusable by Phase 25 (Onboarding Persistence) if it needs role-gated logic
- Pending human visual verification at checkpoint (Task 2): full flow from signup through verify page

---
*Phase: 22-verification-page*
*Completed: 2026-03-14*
