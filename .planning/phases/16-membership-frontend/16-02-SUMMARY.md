---
phase: "16"
plan: "02"
subsystem: membership-frontend
tags: [convex, query, action, components, billing, stripe, next-js-routing]
dependency_graph:
  requires: [16-01]
  provides: [PaymentHistoryList, /account/membership page, success page CTA]
  affects: []
tech_stack:
  added: []
  patterns: [useRef fire-once guard for lazy sync, unknown cast for v.any() Convex responses, auth guard via useSession + useEffect redirect]
key_files:
  created:
    - components/account/payment-history-list.tsx
    - app/account/membership/page.tsx
  modified:
    - app/launch/success/page.tsx
key_decisions:
  - Cast payments through unknown to satisfy TS2352 — getMyPaymentHistory returns v.array(v.any()) so the inferred type doesn't overlap with PaymentHistoryListProps without unknown intermediary
  - LandingHeader used directly (not PostSignupLayout) — membership page is account-functional, not marketing; no framer-motion animations per UI-SPEC
  - subscriptionStatus cast via { status?: string } intersection — subscription is v.any() so inline cast avoids ts-ignore
metrics:
  duration: "~4 minutes"
  completed: "2026-03-22"
  tasks_completed: 3
  files_created: 2
  files_modified: 1
---

# Phase 16 Plan 02: Membership Page Assembly Summary

PaymentHistoryList, /account/membership page, and success page CTA wired together with real Convex queries and lazy Insider sync.

## What Was Built

### Task 1: PaymentHistoryList component

Created `components/account/payment-history-list.tsx` with three states per UI-SPEC:

- **Loading:** 3 `Skeleton` rows at `h-10 w-full`
- **Empty:** Heading "No payments yet" + body "Your payment history will appear here after your first charge."
- **Error:** Muted text only — "Could not load payment history. Refresh the page to try again." (no retry button per UI-SPEC rationale)
- **Populated:** Table with Date, Description, Amount (font-mono), Status columns

`formatCurrency` divides Stripe cents by 100. `formatDate` multiplies Unix seconds by 1000 for JS Date. All copy matches the Copywriting Contract exactly.

### Task 2: /account/membership page

Created `app/account/membership/page.tsx` as a `"use client"` page:

- **Auth guard:** `useSession` + `useEffect` redirects unauthenticated/unverified users to `/launch` (matches vendor success page pattern)
- **Data queries:** `getMyMembership` (always for authed users), `getMySubscription` + `getMyPaymentHistory` (skip unless `tier === "insider"`)
- **Lazy sync (MEM-05):** `useRef(false)` guard fires `syncMyBillingCustomer` exactly once when membership tier is "insider" — silent fire-and-forget with `.catch()`
- **Layout:** `LandingHeader` + `flex flex-col items-center` + `max-w-2xl` — no framer-motion per UI-SPEC
- **Conditional rendering:** `PaymentHistoryList` shown only when `isInsider` is true; Early Bird/Founding members see `MembershipStatusCard` only

### Task 3: Success page membership CTA

Edited `app/launch/success/page.tsx` to add a secondary link block below "Back to Home":

- Link: "Manage your membership" → `/account/membership`
- Subtext: "View your tier, payment history, and billing settings."
- Additive change only — existing structure preserved

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TS2352 type error in payments cast**
- **Found during:** TypeScript verification after Task 2
- **Issue:** `payments as Array<{ _id: string; ... }>` failed because `getMyPaymentHistory` returns `v.any()[]` whose inferred shape (`{ stripePaymentIntentId, amount, ... }`) doesn't overlap with `{ _id }` target type
- **Fix:** Added `unknown` intermediate cast: `payments as unknown as Array<{ _id: string; ... }>`
- **Files modified:** `app/account/membership/page.tsx`
- **Commit:** eb14e59

## Commits

| Hash | Message |
|------|---------|
| b6a0b2e | feat(16-02): add PaymentHistoryList component with loading, empty, error, and populated states |
| f0b7ea9 | feat(16-02): add /account/membership page with data fetching and lazy sync |
| 68772e4 | feat(16-02): add 'Manage your membership' CTA link to success page |
| eb14e59 | fix(16-02): cast payments through unknown to resolve TS2352 type overlap error |

## Known Stubs

None — all components are fully wired. Data flows from real Convex queries. The `error={false}` prop on `PaymentHistoryList` is intentional: Convex `useQuery` doesn't surface errors as a boolean — query failures result in `undefined` (indistinguishable from loading). The error state exists for future use if an error detection layer is added.

## Self-Check

Files:
- components/account/payment-history-list.tsx — FOUND
- app/account/membership/page.tsx — FOUND
- app/launch/success/page.tsx modified — FOUND

Commits:
- b6a0b2e — FOUND
- f0b7ea9 — FOUND
- 68772e4 — FOUND
- eb14e59 — FOUND

## Self-Check: PASSED
