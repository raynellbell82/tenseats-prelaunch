---
phase: 14-schema-env-wiring
plan: "01"
subsystem: database
tags: [convex, stripe, schema, env-vars]

# Dependency graph
requires: []
provides:
  - "stripeBillingCustomerId field on users table in marketplace convex/schema.ts"
  - "STRIPE_CONNECT_WEBHOOK_SECRET env var name in stripeWebhooks.ts (replaces STRIPE_WEBHOOK_SECRET)"
  - "stripeBillingCustomerId field synced to prelaunch convex/schema.ts for type consistency"
affects: [15-billing-backend, 16-membership-frontend, 17-ops-env]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Schema changes originate in marketplace repo, then manually synced to prelaunch repo"
    - "Billing customer ID stored separately from Connect customer ID for distinct Stripe product isolation"

key-files:
  created: []
  modified:
    - "/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/schema.ts"
    - "/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/stripeWebhooks.ts"
    - "/Users/tenseats/Documents/dev/tenseats-prelaunch/convex/schema.ts"

key-decisions:
  - "Used STRIPE_CONNECT_WEBHOOK_SECRET (not STRIPE_WEBHOOK_SECRET) to prevent ambiguity with the billing webhook secret that Phase 15 will add"
  - "stripeBillingCustomerId is a separate field from stripeCustomerId — billing component uses its own customer ID"

patterns-established:
  - "Two-repo schema sync: marketplace is source of truth, prelaunch mirrors the users table fields manually"

requirements-completed: [SCHEMA-01, SCHEMA-02]

# Metrics
duration: 5min
completed: 2026-03-22
---

# Phase 14 Plan 01: Schema & Env Wiring Summary

**Added `stripeBillingCustomerId` to Convex users table in both repos and renamed `STRIPE_WEBHOOK_SECRET` to `STRIPE_CONNECT_WEBHOOK_SECRET` in the Connect webhook handler**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-22T00:00:00Z
- **Completed:** 2026-03-22T00:05:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- `stripeBillingCustomerId: v.optional(v.string())` added to marketplace schema users table after `stripeSubscriptionId` (SCHEMA-01)
- `STRIPE_WEBHOOK_SECRET` renamed to `STRIPE_CONNECT_WEBHOOK_SECRET` in stripeWebhooks.ts processEvent handler — both the process.env read and the error log string updated (SCHEMA-02)
- `stripeBillingCustomerId` synced to prelaunch schema.ts in correct position (between `stripeSubscriptionId` and `stripeConnectAccountId`) for Convex type consistency

## Task Commits

Each task was committed atomically:

1. **Task 1: Add stripeBillingCustomerId to marketplace schema** - `835406d` (feat) — marketplace repo
2. **Task 2: Rename STRIPE_WEBHOOK_SECRET to STRIPE_CONNECT_WEBHOOK_SECRET** - `9794b76` (feat) — marketplace repo
3. **Task 3: Sync stripeBillingCustomerId to prelaunch schema** - `fb2bda5` (feat) — prelaunch repo

## Files Created/Modified
- `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/schema.ts` - Added `stripeBillingCustomerId` field to users table
- `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform/convex/stripeWebhooks.ts` - Renamed env var to `STRIPE_CONNECT_WEBHOOK_SECRET`
- `/Users/tenseats/Documents/dev/tenseats-prelaunch/convex/schema.ts` - Synced `stripeBillingCustomerId` field for type consistency

## Decisions Made
- Used `STRIPE_CONNECT_WEBHOOK_SECRET` name to make env var purpose unambiguous — Phase 15 will add a billing webhook with its own secret, and distinguishing them by name prevents future misconfiguration
- `stripeBillingCustomerId` as a separate field from `stripeCustomerId` because the `@convex-dev/stripe` billing component manages its own customer lifecycle independently from the existing Stripe Connect flow

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — these are schema and code changes only. The `STRIPE_CONNECT_WEBHOOK_SECRET` env var rename requires a Convex dashboard environment variable update (old: `STRIPE_WEBHOOK_SECRET` → new: `STRIPE_CONNECT_WEBHOOK_SECRET`), but that is covered by Phase 17 Ops.

## Next Phase Readiness
- Phase 15 (billing backend) can now add `stripeBillingCustomerId` mutations against the schema field
- Phase 17 (ops) must rename the Convex env var from `STRIPE_WEBHOOK_SECRET` to `STRIPE_CONNECT_WEBHOOK_SECRET` in the dashboard to restore webhook functionality
- Prelaunch schema is in sync — generated types will include `stripeBillingCustomerId` on next `npx convex dev` run

## Known Stubs

None.

## Self-Check: PASSED

- SUMMARY.md: FOUND
- Marketplace commit 835406d (schema): FOUND
- Marketplace commit 9794b76 (stripeWebhooks): FOUND
- Prelaunch commit fb2bda5 (schema sync): FOUND

---
*Phase: 14-schema-env-wiring*
*Completed: 2026-03-22*
