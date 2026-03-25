---
task: "18-02 Task 1: Backend wiring verification"
verified_at: "2026-03-25"
---

# Backend Wiring Verification — TEST-02 and TEST-03

## Customer Portal Path (TEST-02)

### convex/billing/subscriptions.ts

- `export const createBillingPortalSession = action(...)` — CONFIRMED at line 54
- Accepts `returnUrl: v.string()` argument — CONFIRMED at line 55-57
- Returns `v.object({ url: v.string() })` — CONFIRMED at line 59

### components/account/manage-billing-button.tsx

- `createBillingPortalSession({ returnUrl: window.location.href })` — CONFIRMED at line 17-19
- `window.location.href = url` on success — CONFIRMED at line 20
- `toast.error("Could not open billing portal. Try again.")` on failure — CONFIRMED at line 22

## Auto-Sync Path (TEST-03)

### convex/billing/subscriptions.ts

- `export const syncMyBillingCustomer = action(...)` — CONFIRMED at line 112
- Syncs current user's billing customer record to stripe component — CONFIRMED

### app/account/membership/page.tsx

- `const syncedRef = useRef(false)` fire-once guard — CONFIRMED at line 16
- `syncMyBillingCustomer({}).catch(...)` called on Insider page load — CONFIRMED at lines 53-55

## Post-Fulfillment Bridge Path (TEST-03)

The post-fulfillment bridge in `convex/launch/membershipFulfillment.ts` fulfills the membership
(sets membershipTier, isMembershipActive, stripeSubscriptionId) but does NOT directly call
syncCustomerToComponent. The auto-sync to the Stripe component relies on:

1. **Primary:** `syncMyBillingCustomer` fires on first Insider page load (lazy sync via useRef guard)
2. **Backfill fallback:** `convex/billing/backfill.ts` runBackfill action for existing subscribers

The `syncCustomerToComponent` internalAction in subscriptions.ts is available and called by:
- `backfill.ts` via makeFunctionReference
- `syncMyBillingCustomer` (directly, same file)

**Finding:** For new Insider checkout, billing customer record creation in the Stripe component
happens when the user first visits /account/membership page (lazy sync). This is expected behavior
per the Phase 15 architecture — the webhook bridge fulfills DB membership fields; the lazy sync
registers with the billing component.

## Result

All acceptance criteria met. Both billing backend paths are correctly wired in the codebase.
