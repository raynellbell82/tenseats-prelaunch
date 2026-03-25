---
gsd_state_version: 1.0
milestone: v1.3
milestone_name: Subscription Management
status: Ready to execute
stopped_at: Completed 18-02-PLAN.md (Tasks 2-3 deferred)
last_updated: "2026-03-25T21:36:57.992Z"
progress:
  total_phases: 5
  completed_phases: 5
  total_plans: 10
  completed_plans: 10
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city pages — on a shared Convex backend so accounts carry over to the full marketplace.
**Current focus:** Phase 18 — verification-testing

## Current Position

Phase: 18 (verification-testing) — EXECUTING
Plan: 2 of 2

## Performance Metrics

**Cumulative:**

- v1.0: 12 phases, 22 plans, 109 commits
- v1.1: 2 phases, 4 plans, 19 commits
- v1.2: 6 phases, 9 plans, 41 commits
- v1.3: 5 phases planned, 0 complete
- **Total: 25 phases defined, 20 shipped, 35 plans, 169 commits**

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

- [Phase 14-schema-env-wiring]: Used STRIPE_CONNECT_WEBHOOK_SECRET name to prevent ambiguity with future billing webhook secret
- [Phase 14-schema-env-wiring]: stripeBillingCustomerId is a separate field from stripeCustomerId — billing component manages its own customer lifecycle
- [Phase 15]: authUser._id from Better Auth is Id<user> not Id<users> — requires unknown intermediate cast for setStripeBillingCustomerId
- [Phase 15]: syncCustomerToComponent uses v.string() userId so both string and Id callers work without conversion
- [Phase 15-billing-backend]: Use session metadata email (not user.email) for syncCustomerToComponent — avoids string | undefined type error from v.any() getUserByEmail return type
- [Phase 15-billing-backend]: Sequential for...of loop in runBackfill avoids Stripe rate limits; getActiveInsiders filters in-memory (no by_membershipTier index)
- [Phase 16-01]: Manual api.d.ts update required — npx convex codegen fails at push phase (pre-existing deployment constraint)
- [Phase 16-01]: MembershipStatusCard is props-driven — data fetching delegated to page layer (Plan 02)
- [Phase 16-02]: Cast payments through unknown to satisfy TS2352 — getMyPaymentHistory returns v.array(v.any()) so unknown intermediary required
- [Phase 16-02]: LandingHeader used directly (not PostSignupLayout) on membership page — account-functional page, no framer-motion animations per UI-SPEC
- [Phase 18]: Use makeFunctionReference instead of internal.* imports in backfill.ts to break circular type inference cycle
- [Phase 18-verification-testing]: Tasks 2 and 3 deferred by user — human verification of Customer Portal flow and checkout auto-sync requires live Stripe test account setup and was deferred to a future session

### v1.3 Architecture Notes

**Two-repo coordination:**

- Schema changes (`schema.ts`) and Convex functions go in `Tenseats-marketplace-platform` repo
- Frontend (`/account/membership` page, components, success page CTA) goes in `tenseats-prelaunch` repo
- After Convex deployment, `convex/` folder syncs to prelaunch for generated types

**What already exists in marketplace repo (do not rebuild):**

- `convex/billing/subscriptions.ts` — `createInsiderCheckout`, `createBillingPortalSession`
- `convex/billing/queries.ts` — `getMySubscription`, `getMyPaymentHistory`
- `convex/http.ts` — `/stripe/billing-webhook` route via `registerRoutes`

**What Phase 14-15 must add (marketplace repo):**

- `stripeBillingCustomerId` field on `users` table in `schema.ts`
- `STRIPE_CONNECT_WEBHOOK_SECRET` rename in `stripeWebhooks.ts`
- `convex/billing/backfill.ts` — backfill migration
- `membershipWebhooks.ts` — post-fulfillment sync bridge
- `syncMyBillingCustomer` action and `setStripeBillingCustomerId` internal mutation

**What Phase 16 must add (prelaunch repo):**

- `/account/membership` page with tier/status display
- Membership status card distinguishing lifetime vs subscription tiers
- "Manage Billing" button (Insider only) → Stripe Customer Portal
- Payment history component
- Lazy sync on first Insider page load
- "Manage your membership" CTA on `/launch/success`

### Pending Todos

- Plan Phase 14 via `/gsd:plan-phase 14`

### Blockers/Concerns

- Auth limitation: localhost:3001 not in trusted origins. OTP auth only verifiable in production.
- Stripe Connect webhook requires env vars not yet configured (`STRIPE_CONNECT_WEBHOOK_SECRET`, `CONVEX_DEPLOY_KEY`) — addressed in OPS-01
- Phase 17 (Ops) must happen after Phase 15 backend is deployed but can run in parallel with Phase 16 frontend work

## Session Continuity

Last session: 2026-03-25T21:36:57.989Z
Stopped at: Completed 18-02-PLAN.md (Tasks 2-3 deferred)
Resume file: None
