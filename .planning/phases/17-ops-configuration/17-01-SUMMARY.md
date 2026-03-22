---
phase: 17-ops-configuration
plan: "01"
status: complete
started: 2026-03-22
completed: 2026-03-22
---

## Summary

Configured all production environment variables and Stripe Dashboard settings for billing webhook delivery and Customer Portal access.

## Tasks Completed

| # | Task | Status |
|---|------|--------|
| 1 | Set Convex env vars (STRIPE_CONNECT_WEBHOOK_SECRET, STRIPE_BILLING_WEBHOOK_SECRET) | ✓ |
| 2 | Register billing webhook endpoint in Stripe Dashboard | ✓ |
| 3 | Configure Stripe Customer Portal | ✓ |

## Key Outcomes

- `STRIPE_CONNECT_WEBHOOK_SECRET` set in Convex (Connect webhook signing secret)
- `STRIPE_BILLING_WEBHOOK_SECRET` set in Convex (billing webhook signing secret)
- Old `STRIPE_WEBHOOK_SECRET` removed
- Billing webhook endpoint active at `https://api.tenseats.io/stripe/billing-webhook`
- Customer Portal enabled with invoices, payment methods, and cancellation

## Self-Check: PASSED

All acceptance criteria confirmed by human operator.

## Deviations

None.
