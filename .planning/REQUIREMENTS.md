# Requirements: Tenseats Pre-Launch Site

**Defined:** 2026-03-22
**Core Value:** Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city-specific landing pages — all on a shared backend so accounts carry over seamlessly when the full marketplace launches.

## v1.3 Requirements

Requirements for Subscription Management milestone. Each maps to roadmap phases.

### Schema & Wiring

- [x] **SCHEMA-01**: `stripeBillingCustomerId` field added to `users` table in schema
- [x] **SCHEMA-02**: Existing webhook secret env var renamed from `STRIPE_WEBHOOK_SECRET` to `STRIPE_CONNECT_WEBHOOK_SECRET` in `stripeWebhooks.ts`

### Billing Backend

- [ ] **BILL-01**: Backfill migration (`convex/billing/backfill.ts`) syncs existing Insider subscribers to `@convex-dev/stripe` component
- [x] **BILL-02**: Post-fulfillment sync bridge in `membershipWebhooks.ts` auto-registers new Insider purchases with the component
- [x] **BILL-03**: `syncMyBillingCustomer` action for lazy sync on membership page load
- [x] **BILL-04**: `setStripeBillingCustomerId` internal mutation to persist billing customer ID

### Membership Frontend

- [ ] **MEM-01**: Membership page at `/account/membership` shows tier, status, and lifetime badge
- [ ] **MEM-02**: Membership status card distinguishes Early Bird/Founding (lifetime) from Insider (subscription)
- [ ] **MEM-03**: Insider members see "Manage Billing" button that opens Stripe Customer Portal
- [ ] **MEM-04**: Payment history component shows Insider payment records
- [ ] **MEM-05**: Lazy sync fires on first Insider membership page load
- [ ] **MEM-06**: Success page (`/launch/success`) includes "Manage your membership" CTA link

### Ops & Configuration

- [ ] **OPS-01**: `STRIPE_CONNECT_WEBHOOK_SECRET` and `STRIPE_WEBHOOK_SECRET` env vars set correctly in Convex
- [ ] **OPS-02**: Billing webhook endpoint registered in Stripe Dashboard at `https://api.tenseats.io/stripe/billing-webhook`
- [ ] **OPS-03**: Customer Portal configured in Stripe Dashboard (invoices, payment method, cancel)
- [ ] **OPS-04**: Backfill migration run successfully with 0 failures

### Testing

- [ ] **TEST-01**: All tier types display correctly on membership page
- [ ] **TEST-02**: Customer Portal flow works end-to-end for Insider members
- [ ] **TEST-03**: New Insider checkout auto-syncs via post-fulfillment bridge

## Future Requirements

### Subscription Lifecycle

- **SUB-01**: User can upgrade/downgrade between membership tiers
- **SUB-02**: User receives email notifications for subscription events (renewal, cancellation, payment failure)
- **SUB-03**: Admin dashboard for viewing subscription metrics

## Out of Scope

| Feature | Reason |
|---------|--------|
| Replacing existing launch checkout flow | Hybrid approach — component adds management alongside existing checkout |
| OAuth / separate auth table | Using existing Better Auth OTP structures |
| Modifying `convex.config.ts` | `@convex-dev/stripe` already registered via `app.use(stripe)` |
| Modifying existing `convex/billing/subscriptions.ts` or `queries.ts` | Already built in marketplace repo — only extend if needed |
| Modifying existing `http.ts` billing webhook route | Already wired with `registerRoutes` in marketplace repo |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHEMA-01 | Phase 14 | Complete |
| SCHEMA-02 | Phase 14 | Complete |
| BILL-01 | Phase 15 | Pending |
| BILL-02 | Phase 15 | Complete |
| BILL-03 | Phase 15 | Complete |
| BILL-04 | Phase 15 | Complete |
| MEM-01 | Phase 16 | Pending |
| MEM-02 | Phase 16 | Pending |
| MEM-03 | Phase 16 | Pending |
| MEM-04 | Phase 16 | Pending |
| MEM-05 | Phase 16 | Pending |
| MEM-06 | Phase 16 | Pending |
| OPS-01 | Phase 17 | Pending |
| OPS-02 | Phase 17 | Pending |
| OPS-03 | Phase 17 | Pending |
| OPS-04 | Phase 17 | Pending |
| TEST-01 | Phase 18 | Pending |
| TEST-02 | Phase 18 | Pending |
| TEST-03 | Phase 18 | Pending |

**Coverage:**
- v1.3 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 — traceability updated after roadmap creation*
