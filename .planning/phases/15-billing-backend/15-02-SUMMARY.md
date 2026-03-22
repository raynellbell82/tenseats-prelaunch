---
phase: 15-billing-backend
plan: 02
subsystem: payments
tags: [stripe, convex, webhooks, billing-component, insider]

# Dependency graph
requires:
  - phase: 15-billing-backend-01
    provides: syncCustomerToComponent internal action in convex/billing/subscriptions.ts
provides:
  - Insider-only post-fulfillment sync bridge in handleMembershipCheckoutCompleted
  - Automatic billing component registration on every new Insider checkout
affects: [16-membership-frontend, 17-ops-deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: [non-fatal try/catch sync bridge inside webhook handler, use session-metadata email rather than queried user.email to satisfy strict string type]

key-files:
  created: []
  modified:
    - /Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/launch/membershipWebhooks.ts

key-decisions:
  - "Use email from session metadata (not user.email) for syncCustomerToComponent arg — avoids string | undefined type error from v.any() return of getUserByEmail"
  - "Sync block placed inside outer try block after markEventProcessed — sync failure cannot affect idempotency or event processing"

patterns-established:
  - "Non-fatal sync bridge: inner try/catch after fulfillment + markEventProcessed; outer throw error for fulfillment failure untouched"
  - "Tier gate pattern: if (tier === 'insider') before optional post-fulfillment side-effects"

requirements-completed: [BILL-02]

# Metrics
duration: 5min
completed: 2026-03-22
---

# Phase 15 Plan 02: Billing Backend Sync Bridge Summary

**Insider-only post-fulfillment sync bridge injected into membershipWebhooks.ts — new Insider checkouts auto-register with the @convex-dev/stripe billing component via a non-fatal try/catch after fulfillMembership + markEventProcessed succeed**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-22T08:12:00Z
- **Completed:** 2026-03-22T08:17:07Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments
- Added BILL-02 sync bridge to `handleMembershipCheckoutCompleted` — fires only for `tier === "insider"`
- Looks up user by email via `internal.launch.membershipFulfillment.getUserByEmail` (already existed)
- Calls `internal.billing.subscriptions.syncCustomerToComponent` with `userId` and `email`
- Wrapped in inner try/catch — sync failure is non-fatal; webhook succeeds regardless
- Outer `throw error` on fulfillment failure remains untouched
- TypeScript passes clean (no errors)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Insider sync bridge to handleMembershipCheckoutCompleted** - `f2c794b` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/launch/membershipWebhooks.ts` - Added 33-line BILL-02 sync block inside the existing try block

## Decisions Made
- Used `email` from session metadata scope instead of `user.email` for the `syncCustomerToComponent` call — `getUserByEmail` returns `v.any()` so TypeScript infers `user.email` as `string | undefined`, which fails the `v.string()` arg validator. The session `email` is equivalent and already `string`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type error: user.email → email**
- **Found during:** Task 1 (sync bridge insertion)
- **Issue:** `getUserByEmail` returns `v.any()`, so `user.email` is typed as `string | undefined`. `syncCustomerToComponent` arg `email` requires `string`. TSC reported TS2322.
- **Fix:** Used `email` from the handler scope (from session metadata) instead of `user.email`. Both values are the same — the user was looked up by that same email.
- **Files modified:** convex/launch/membershipWebhooks.ts
- **Verification:** `npx tsc --noEmit` exits clean
- **Committed in:** f2c794b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug / type error)
**Impact on plan:** Necessary for TypeScript correctness. No scope creep. The semantic behavior matches the plan exactly.

## Issues Encountered
- TypeScript type mismatch between `v.any()` query return and `v.string()` action arg — fixed by using the already-typed `email` variable from handler scope.

## User Setup Required
None - no external service configuration required. The deployed Convex function will be available once deployed.

## Next Phase Readiness
- BILL-02 sync bridge complete — new Insider checkouts now auto-register with billing component on webhook fulfillment
- Phase 15-03 (backfill migration) can proceed to cover existing Insider subscribers
- Phase 16 (membership frontend) can begin in parallel

---
*Phase: 15-billing-backend*
*Completed: 2026-03-22*
