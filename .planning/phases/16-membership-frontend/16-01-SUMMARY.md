---
phase: "16"
plan: "01"
subsystem: membership-frontend
tags: [convex, query, components, billing, stripe]
dependency_graph:
  requires: [15-03]
  provides: [getMyMembership query, MembershipTierBadge, ManageBillingButton, MembershipStatusCard]
  affects: [16-02]
tech_stack:
  added: []
  patterns: [props-driven card components, fast getAppUser auth pattern, manual api.d.ts registration]
key_files:
  created:
    - convex/billing/membership.ts
    - components/account/membership-tier-badge.tsx
    - components/account/manage-billing-button.tsx
    - components/account/membership-status-card.tsx
  modified:
    - convex/_generated/api.d.ts
key_decisions:
  - Manual api.d.ts update required — npx convex codegen fails at push phase (pre-existing deployment constraint)
  - Used getAppUser (fast ~1ms path) over authComponent.getAuthUser (~900ms) per plan spec
  - MembershipStatusCard is props-driven — data fetching delegated to page layer (Plan 02)
metrics:
  duration: "~12 minutes"
  completed: "2026-03-22"
  tasks_completed: 2
  files_created: 4
  files_modified: 1
---

# Phase 16 Plan 01: Membership Data Layer and Card Components Summary

Convex membership query and all three account card components ready for page assembly in Plan 02.

## What Was Built

### Task 1: getMyMembership Convex query + api.d.ts types

Created `convex/billing/membership.ts` with the `getMyMembership` public query. Uses `getAppUser` for fast auth (~1ms via `ctx.auth.getUserIdentity()` + `by_email` index) rather than the expensive `authComponent.getAuthUser()` (~900ms). Returns `{tier, isActive, isLifetime, hasBillingCustomer}` or null for unauthenticated users.

Manually registered the billing namespace in `convex/_generated/api.d.ts`:
- `import type * as billing_membership from "../billing/membership.js"`
- `import type * as billing_queries from "../billing/queries.js"`
- `import type * as billing_subscriptions from "../billing/subscriptions.js"`
- `"billing/membership": typeof billing_membership` in fullApi
- `"billing/queries"` and `"billing/subscriptions"` also registered

Manual update was required because `npx convex codegen` fails during the push phase (pre-existing deployment issue documented in PROJECT.md known tech debt).

### Task 2: Three membership components

**MembershipTierBadge** (`components/account/membership-tier-badge.tsx`): Wraps shadcn Badge with two treatments — burnt sienna (`bg-accent-burnt-sienna`) with "Lifetime Member" text for Early Bird/Founding tiers; secondary variant with "Insider" text for subscription tier.

**ManageBillingButton** (`components/account/manage-billing-button.tsx`): Calls `useAction(api.billing.subscriptions.createBillingPortalSession)` with `returnUrl: window.location.href`. Shows Loader2 spinner + "Opening..." while loading. Shows sonner toast error "Could not open billing portal. Try again." on failure. Minimum 44px height for WCAG 2.5.5 touch target compliance.

**MembershipStatusCard** (`components/account/membership-status-card.tsx`): Props-driven card composing both components above. Skeleton loading state matching card dimensions. Lifetime tiers get `ring-2 ring-foreground` border. Insider tier shows ManageBillingButton in CardFooter. Derives status display from `subscriptionStatus` prop (Stripe status) and `membership.isActive`. TIER_LABELS maps snake_case keys to display names.

## Deviations from Plan

None — plan executed exactly as written.

The TypeScript errors visible in `npx tsc --noEmit` are pre-existing issues in `convex/billing/backfill.ts` and `convex/billing/subscriptions.ts` (synced from marketplace repo in Phase 15). No errors in any files created by this plan.

## Commits

| Hash | Message |
|------|---------|
| 96d5ea6 | feat(16-01): add getMyMembership query and register billing namespace in api.d.ts |
| 2b90e9d | feat(16-01): add MembershipTierBadge, ManageBillingButton, MembershipStatusCard components |

## Known Stubs

None — all components are fully implemented. Data flows from props (fetched by parent page in Plan 02).

## Self-Check

Files:
- convex/billing/membership.ts — FOUND
- components/account/membership-tier-badge.tsx — FOUND
- components/account/manage-billing-button.tsx — FOUND
- components/account/membership-status-card.tsx — FOUND
- convex/_generated/api.d.ts updated — FOUND

Commits:
- 96d5ea6 — FOUND
- 2b90e9d — FOUND

## Self-Check: PASSED
