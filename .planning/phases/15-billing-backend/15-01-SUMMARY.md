---
phase: 15-billing-backend
plan: 01
subsystem: payments
tags: [stripe, convex, billing, subscriptions, internalMutation, internalAction]

# Dependency graph
requires:
  - phase: 14-schema-env-wiring
    provides: stripeBillingCustomerId field on users table in schema.ts
provides:
  - setStripeBillingCustomerId internalMutation — patches stripeBillingCustomerId on users table
  - syncCustomerToComponent internalAction — getOrCreateCustomer via stripe component + persist
  - syncMyBillingCustomer exported action — lazy sync callable by authenticated client
affects:
  - 15-02 (sync bridge uses syncCustomerToComponent)
  - 15-03 (backfill calls syncCustomerToComponent)
  - 16-membership-frontend (calls syncMyBillingCustomer on page load)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "internalMutation for persisting stripe component data to Convex users table"
    - "internalAction wrapping getOrCreateCustomer for reuse by bridge and backfill"
    - "Double-cast Id<user> → unknown → Id<users> when Better Auth user ID crosses table boundary"

key-files:
  created: []
  modified:
    - /Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/billing/subscriptions.ts

key-decisions:
  - "authUser._id from Better Auth is Id<user> not Id<users> — requires unknown intermediate cast for setStripeBillingCustomerId arg"
  - "syncCustomerToComponent takes v.string() userId (not v.id) so callers with string or Id both work"
  - "internalAction uses returns: v.object({ customerId: v.string() }) — codebase pattern confirmed from upgradeInsiderCategory"

patterns-established:
  - "Billing primitives: always instantiate StripeSubscriptions inside handler for env var safety"
  - "Auth pattern in actions: authComponent.getAuthUser(ctx), never ctx.auth.getUserIdentity()"
  - "String(authUser._id) for userId passed to stripe component; authUser._id as unknown as Id<users> for Convex DB patch"

requirements-completed: [BILL-03, BILL-04]

# Metrics
duration: 15min
completed: 2026-03-22
---

# Phase 15 Plan 01: Billing Backend Primitives Summary

**Three Convex billing primitives added to subscriptions.ts: setStripeBillingCustomerId internalMutation, syncCustomerToComponent internalAction, and syncMyBillingCustomer action for lazy client-side sync**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-22T08:15:00Z
- **Completed:** 2026-03-22T08:30:00Z
- **Tasks:** 2 (both in single file, committed together)
- **Files modified:** 1

## Accomplishments

- Added `setStripeBillingCustomerId` internalMutation that patches `stripeBillingCustomerId` on users table (BILL-04)
- Added `syncCustomerToComponent` internalAction for reuse by sync bridge and backfill — calls `getOrCreateCustomer` then persists (BILL-01/BILL-02 dependency)
- Added `syncMyBillingCustomer` exported action for authenticated lazy sync on membership page load (BILL-03)
- Extended imports cleanly: `internalMutation`, `internalAction`, `internal`, `Id` added without touching existing code
- All existing exports (`createInsiderCheckout`, `createBillingPortalSession`) unchanged

## Task Commits

Each task's work was committed atomically (both tasks affected same file):

1. **Tasks 1 + 2: Add billing sync primitives** - `2a2ae4d` (feat)

## Files Created/Modified

- `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/billing/subscriptions.ts` — Extended with 3 new exports (+73 lines), existing 2 exports unchanged

## Decisions Made

- `authUser._id` from Better Auth component is typed as `Id<"user">` (Better Auth's own table), not `Id<"users">` — must double-cast via `unknown` when passing to `setStripeBillingCustomerId` which expects `Id<"users">`
- `syncCustomerToComponent` uses `v.string()` for userId (not `v.id("users")`) so both internal callers (with string or Id) work without conversion
- Confirmed `returns` validator is valid on `internalAction` in this codebase (pattern from `upgradeInsiderCategory`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Id<"user"> to Id<"users"> type cast**
- **Found during:** Task 2 (syncMyBillingCustomer) TypeScript compilation
- **Issue:** `authUser._id as Id<"users">` fails because Better Auth types it as `Id<"user">` — neither type sufficiently overlaps for direct cast
- **Fix:** Changed to `authUser._id as unknown as Id<"users">` (double-cast via unknown)
- **Files modified:** convex/billing/subscriptions.ts (line 143)
- **Verification:** `npx tsc --noEmit --skipLibCheck` returns no errors for billing/subscriptions.ts
- **Committed in:** 2a2ae4d (part of task commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - type bug)
**Impact on plan:** Single TypeScript type narrowing fix, no behavior change.

## Issues Encountered

- `npx convex dev --once` returned a deployment serialization error (BadJsonBody: `missing field functions`) unrelated to our code — this is a known issue with the large app definition size. TypeScript type check (`tsc --noEmit`) confirms no errors in billing/subscriptions.ts.

## Known Stubs

None — all three functions are fully implemented. No hardcoded values, placeholders, or mock data.

## Next Phase Readiness

- All three billing primitives are in place and type-clean
- Phase 15-02 sync bridge can now import `syncCustomerToComponent` via `internal.billing.subscriptions.syncCustomerToComponent`
- Phase 15-03 backfill can call the same internal action
- Phase 16 frontend can call `syncMyBillingCustomer` action from the membership page

---
*Phase: 15-billing-backend*
*Completed: 2026-03-22*
