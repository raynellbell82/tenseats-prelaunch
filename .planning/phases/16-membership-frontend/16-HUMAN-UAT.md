---
status: partial
phase: 16-membership-frontend
source: [16-VERIFICATION.md]
started: 2026-03-22T00:00:00Z
updated: 2026-03-22T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visit /account/membership as an authenticated Early Bird or Founding member
expected: Card shows tier name, 'Lifetime Member' badge in burnt sienna, ring-2 border — no Manage Billing button, no payment history table
result: [pending]

### 2. Visit /account/membership as an authenticated Insider member
expected: Card shows 'Insider' badge (secondary variant), 'Manage Billing' button in CardFooter; payment history section renders below the card; syncMyBillingCustomer fires once silently in background (no UI feedback)
result: [pending]

### 3. Click 'Manage Billing' as an Insider member
expected: Button shows spinner + 'Opening...' text, then browser navigates to Stripe Customer Portal; on error shows toast 'Could not open billing portal. Try again.'
result: [pending]

### 4. Visit /account/membership as an unauthenticated user
expected: Immediate redirect to /launch — no membership content visible
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
