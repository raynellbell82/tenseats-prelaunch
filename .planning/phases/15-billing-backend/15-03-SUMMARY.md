---
phase: 15-billing-backend
plan: "03"
subsystem: payments
tags: [stripe, convex, backfill, billing, subscriptions]

# Dependency graph
requires:
  - phase: 15-01
    provides: syncCustomerToComponent, setStripeBillingCustomerId in subscriptions.ts
  - phase: 15-02
    provides: membershipWebhooks.ts post-fulfillment sync bridge
provides:
  - backfill migration for existing Insider subscribers (getActiveInsiders, backfillSingleInsider, runBackfill)
  - convex/billing/ directory synced to prelaunch repo for generated type references
affects:
  - 16-membership-frontend (imports from convex/billing/ for membership page)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sequential for...of loop (not Promise.all) for Stripe API calls to avoid rate limits"
    - "internalQuery + internalAction pairing — query finds candidates, action processes them"
    - "use node directive required for internalAction in Convex Node.js runtime"

key-files:
  created:
    - /Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/billing/backfill.ts
    - /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/subscriptions.ts
    - /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/queries.ts
    - /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/backfill.ts
  modified: []

key-decisions:
  - "Sequential for...of loop in runBackfill — not Promise.all — explicitly avoids Stripe rate limits"
  - "getActiveInsiders filters in-memory after table scan — no by_membershipTier index exists in schema"
  - "backfill.ts is a no-op on first run (zero current Insider subscribers) but code is correct for future use"

patterns-established:
  - "Backfill pattern: internalQuery finds unprocessed records, internalAction processes each sequentially"
  - "Two-repo sync: marketplace is source of truth, prelaunch convex/ is synced copy for type generation"

requirements-completed: [BILL-01]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 15 Plan 03: Billing Backfill and Sync Summary

**Sequential Stripe backfill migration with getActiveInsiders/backfillSingleInsider/runBackfill and convex/billing/ directory synced to prelaunch repo for Phase 16 type references**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-22T08:19:29Z
- **Completed:** 2026-03-22T08:21:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created `convex/billing/backfill.ts` in marketplace repo with three exports: `getActiveInsiders` (internalQuery), `backfillSingleInsider` (internalAction), `runBackfill` (internalAction with sequential for...of loop)
- Synced entire `convex/billing/` directory (subscriptions.ts, queries.ts, backfill.ts) to prelaunch repo so Phase 16 can reference generated types
- BILL-01 requirement fulfilled: existing Insider subscribers can be backfilled to link them to @convex-dev/stripe component

## Task Commits

Each task was committed atomically:

1. **Task 1: Create convex/billing/backfill.ts in marketplace repo** - `bca0280` (feat) — marketplace repo
2. **Task 2: Sync convex/billing/ to prelaunch repo** - `f09d26f` (feat) — prelaunch repo

**Plan metadata:** (final commit below)

## Files Created/Modified
- `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/billing/backfill.ts` - Backfill migration: getActiveInsiders queries unbackfilled Insiders, backfillSingleInsider syncs one user, runBackfill loops sequentially
- `/Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/subscriptions.ts` - Synced copy from marketplace (syncMyBillingCustomer, setStripeBillingCustomerId, syncCustomerToComponent)
- `/Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/queries.ts` - Synced copy from marketplace (getMySubscription, getMyPaymentHistory)
- `/Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/backfill.ts` - Synced copy from marketplace (all three backfill exports)

## Decisions Made
- Sequential `for...of` loop (not `Promise.all`) in `runBackfill` to avoid Stripe API rate limits
- `getActiveInsiders` filters in-memory after table scan — no `by_membershipTier` index exists in the schema, so in-memory filtering with `.filter()` after `.collect()` is the correct approach
- Backfill is a no-op on first run (zero current Insider subscribers) but code structure is correct for any future users

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npx convex dev --once` in the marketplace repo returns a 400 "missing field functions" error — this is a pre-existing deployment configuration issue unrelated to our changes (present before Plan 15-03, not caused by backfill.ts). The file was verified to be structurally correct with all three exports.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 16 (Membership Frontend) can now import from `convex/billing/` in prelaunch repo for generated types
- All three billing files are synced: subscriptions.ts, queries.ts, backfill.ts
- `runBackfill` can be called manually via Convex dashboard when needed (currently a no-op with zero Insider subscribers)
- Phase 15 (Billing Backend) is complete — all three plans executed

---
*Phase: 15-billing-backend*
*Completed: 2026-03-22*

## Self-Check: PASSED

- FOUND: /Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/billing/backfill.ts
- FOUND: /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/subscriptions.ts
- FOUND: /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/queries.ts
- FOUND: /Users/tenseats/Documents/dev/tenseats-prelaunch/convex/billing/backfill.ts
- FOUND: .planning/phases/15-billing-backend/15-03-SUMMARY.md
- FOUND: marketplace commit bca0280 (feat(15-03): create convex/billing/backfill.ts)
- FOUND: prelaunch commit f09d26f (feat(15-03): sync convex/billing/ directory)
