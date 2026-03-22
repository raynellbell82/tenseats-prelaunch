---
gsd_state_version: 1.0
milestone: v1.3
milestone_name: Subscription Management
status: roadmapped
stopped_at: null
last_updated: "2026-03-22"
last_activity: "2026-03-22 — Roadmap created, 5 phases defined (14-18)"
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city pages — on a shared Convex backend so accounts carry over to the full marketplace.
**Current focus:** v1.3 Subscription Management — Phase 14: Schema & Env Wiring (next to plan)

## Current Position

Phase: 14 (Schema & Env Wiring) — not started
Plan: —
Status: Roadmap complete, ready for phase planning
Last activity: 2026-03-22 — Roadmap created for v1.3

```
Progress: [----------] 0% (0/5 phases complete)
```

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

Last session: 2026-03-22
Stopped at: Roadmap created for v1.3, ready to plan Phase 14
Resume file: None
