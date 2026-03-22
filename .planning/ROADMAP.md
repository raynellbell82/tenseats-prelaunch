# Roadmap: Tenseats Pre-Launch Site

## Milestones

- ✅ **v1.0 Pre-Launch Site** — Phases 1-11 (shipped 2026-03-13)
- ✅ **v1.1 City Persona Copy** — Phases 12-13 (shipped 2026-03-13)
- ✅ **v1.2 Post-Signup Experience** — Phases 20-25 (shipped 2026-03-15)
- 🔄 **v1.3 Subscription Management** — Phases 14-18 (in progress)

## Phases

<details>
<summary>✅ v1.0 Pre-Launch Site (Phases 1-11) — SHIPPED 2026-03-13</summary>

- [x] Phase 1: Scaffold (3/3 plans) — completed 2026-03-13
- [x] Phase 2: Layout & Navigation (2/2 plans) — completed 2026-03-13
- [x] Phase 3: Homepage (1/1 plans) — completed 2026-03-13
- [x] Phase 4: Join Page (2/2 plans) — completed 2026-03-13
- [x] Phase 5: Auth (2/2 plans) — completed 2026-03-13
- [x] Phase 6: Launch Flow (2/2 plans) — completed 2026-03-13
- [x] Phase 7: City Pages (2/2 plans) — completed 2026-03-13
- [x] Phase 8: Why Tenseats Page (2/2 plans) — completed 2026-03-13
- [x] Phase 8.1: Cities Globe (1/1 plans) — completed 2026-03-13
- [x] Phase 9: SEO, Deployment & Copy QA (3/3 plans) — completed 2026-03-13
- [x] Phase 10: Wire City Slug to Launch Flow (1/1 plans) — completed 2026-03-13
- [x] Phase 11: Nav & Auth Wiring Fixes (1/1 plans) — completed 2026-03-13

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 City Persona Copy (Phases 12-13) — SHIPPED 2026-03-13</summary>

- [x] Phase 12: Persona Component Foundation (1/1 plans) — completed 2026-03-13
- [x] Phase 13: City Persona Copy (3/3 plans) — completed 2026-03-13

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>✅ v1.2 Post-Signup Experience (Phases 20-25) — SHIPPED 2026-03-15</summary>

- [x] Phase 20: Schema Coordination (2/2 plans) — completed 2026-03-14
- [x] Phase 21: Social Icons (1/1 plans) — completed 2026-03-14
- [x] Phase 22: Verification Page (2/2 plans) — completed 2026-03-14
- [x] Phase 23: Guest Success Page (1/1 plans) — completed 2026-03-14
- [x] Phase 24: Vendor Success Page (1/1 plans) — completed 2026-03-14
- [x] Phase 25: Onboarding Persistence (2/2 plans) — completed 2026-03-15

Full details: `.planning/milestones/v1.2-ROADMAP.md`

</details>

### v1.3 Subscription Management

- [x] **Phase 14: Schema & Env Wiring** — Add billing customer ID field and rename webhook secret env var (Convex/marketplace repo) (completed 2026-03-22)
- [ ] **Phase 15: Billing Backend** — Backfill migration, sync bridge, lazy sync action, and persist mutation (Convex/marketplace repo)
- [ ] **Phase 16: Membership Frontend** — Membership page, tier display, billing portal button, payment history, and success page CTA (prelaunch repo)
- [ ] **Phase 17: Ops Configuration** — Set env vars in Convex, register billing webhook in Stripe, configure Customer Portal, run backfill
- [ ] **Phase 18: Verification & Testing** — All tier types display correctly, Customer Portal flows end-to-end, new Insider checkout auto-syncs

## Phase Details

### Phase 14: Schema & Env Wiring
**Goal**: The schema and environment wiring are correct so billing functions can store customer IDs and both webhooks route to the right secrets
**Depends on**: Nothing (foundation for all billing work)
**Requirements**: SCHEMA-01, SCHEMA-02
**Success Criteria** (what must be TRUE):
  1. `stripeBillingCustomerId` field exists on the `users` table in `schema.ts` with no deployment errors
  2. `stripeWebhooks.ts` references `STRIPE_CONNECT_WEBHOOK_SECRET` (not `STRIPE_WEBHOOK_SECRET`) for the Connect webhook
  3. Both webhook secret env var names are distinct and unambiguous — Connect secret vs billing secret use separate vars
**Plans**: 1 plan
Plans:
- [x] 14-01-PLAN.md — Schema field addition and webhook env var rename

### Phase 15: Billing Backend
**Goal**: Convex billing namespace is fully functional — existing subscribers are backfilled, new Insider purchases auto-register, and any membership page can lazy-sync a user's billing customer record
**Depends on**: Phase 14
**Requirements**: BILL-01, BILL-02, BILL-03, BILL-04
**Success Criteria** (what must be TRUE):
  1. `convex/billing/backfill.ts` runs without errors against existing Insider subscribers and links them to the `@convex-dev/stripe` component
  2. A new Insider checkout completion triggers `membershipWebhooks.ts` to automatically register the purchaser with the component (no manual step)
  3. `syncMyBillingCustomer` action resolves the current user's billing customer ID on first call and stores it via `setStripeBillingCustomerId`
  4. `setStripeBillingCustomerId` internal mutation persists the billing customer ID to the `users` table field added in Phase 14
**Plans**: TBD

### Phase 16: Membership Frontend
**Goal**: Authenticated members can navigate to `/account/membership` and see their tier, status, and any available billing management actions appropriate to their membership type
**Depends on**: Phase 15
**Requirements**: MEM-01, MEM-02, MEM-03, MEM-04, MEM-05, MEM-06
**Success Criteria** (what must be TRUE):
  1. An authenticated user visiting `/account/membership` sees their tier name, status, and a lifetime badge if they are Early Bird or Founding
  2. An Insider member sees a "Manage Billing" button that opens the Stripe Customer Portal without a redirect error
  3. An Insider member on the membership page sees a payment history list of their past charges
  4. The first time an Insider visits the membership page, `syncMyBillingCustomer` fires automatically (lazy sync) with no user action required
  5. The `/launch/success` page includes a visible "Manage your membership" link that routes to `/account/membership`
**Plans**: TBD

### Phase 17: Ops Configuration
**Goal**: All production environment variables and Stripe Dashboard settings are in place so billing webhooks deliver, the Customer Portal is usable, and all existing Insider subscribers are migrated
**Depends on**: Phase 15
**Requirements**: OPS-01, OPS-02, OPS-03, OPS-04
**Success Criteria** (what must be TRUE):
  1. Convex deployment has both `STRIPE_CONNECT_WEBHOOK_SECRET` and `STRIPE_WEBHOOK_SECRET` set to their correct distinct values
  2. Stripe Dashboard has a webhook endpoint pointing to `https://api.tenseats.io/stripe/billing-webhook` and it shows as active
  3. Stripe Customer Portal is configured with invoice access, payment method update, and cancellation options enabled
  4. Backfill migration completes with 0 failures logged — every pre-existing Insider subscriber has a linked billing customer record
**Plans**: TBD

### Phase 18: Verification & Testing
**Goal**: All membership tier types display correctly, the Customer Portal flow is confirmed end-to-end, and new Insider purchases auto-sync without manual intervention
**Depends on**: Phase 16, Phase 17
**Requirements**: TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. A test account with each tier type (Early Bird, Founding, Insider) shows the correct tier name, badge, and available actions on the membership page
  2. An Insider test account completes the Customer Portal flow — opens portal, updates payment method or cancels, and the change is reflected in Stripe without errors
  3. A new Insider checkout (test mode) completes and the subscriber appears in the billing component records automatically, without running backfill manually
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffold | v1.0 | 3/3 | Complete | 2026-03-13 |
| 2. Layout & Navigation | v1.0 | 2/2 | Complete | 2026-03-13 |
| 3. Homepage | v1.0 | 1/1 | Complete | 2026-03-13 |
| 4. Join Page | v1.0 | 2/2 | Complete | 2026-03-13 |
| 5. Auth | v1.0 | 2/2 | Complete | 2026-03-13 |
| 6. Launch Flow | v1.0 | 2/2 | Complete | 2026-03-13 |
| 7. City Pages | v1.0 | 2/2 | Complete | 2026-03-13 |
| 8. Why Tenseats Page | v1.0 | 2/2 | Complete | 2026-03-13 |
| 8.1. Cities Globe | v1.0 | 1/1 | Complete | 2026-03-13 |
| 9. SEO, Deployment & Copy QA | v1.0 | 3/3 | Complete | 2026-03-13 |
| 10. Wire City Slug to Launch Flow | v1.0 | 1/1 | Complete | 2026-03-13 |
| 11. Nav & Auth Wiring Fixes | v1.0 | 1/1 | Complete | 2026-03-13 |
| 12. Persona Component Foundation | v1.1 | 1/1 | Complete | 2026-03-13 |
| 13. City Persona Copy | v1.1 | 3/3 | Complete | 2026-03-13 |
| 20. Schema Coordination | v1.2 | 2/2 | Complete | 2026-03-14 |
| 21. Social Icons | v1.2 | 1/1 | Complete | 2026-03-14 |
| 22. Verification Page | v1.2 | 2/2 | Complete | 2026-03-14 |
| 23. Guest Success Page | v1.2 | 1/1 | Complete | 2026-03-14 |
| 24. Vendor Success Page | v1.2 | 1/1 | Complete | 2026-03-14 |
| 25. Onboarding Persistence | v1.2 | 2/2 | Complete | 2026-03-15 |
| 14. Schema & Env Wiring | v1.3 | 1/1 | Complete   | 2026-03-22 |
| 15. Billing Backend | v1.3 | 0/TBD | Not started | - |
| 16. Membership Frontend | v1.3 | 0/TBD | Not started | - |
| 17. Ops Configuration | v1.3 | 0/TBD | Not started | - |
| 18. Verification & Testing | v1.3 | 0/TBD | Not started | - |
