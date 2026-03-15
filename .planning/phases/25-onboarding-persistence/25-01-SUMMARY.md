---
phase: 25-onboarding-persistence
plan: "01"
subsystem: backend
tags: [stripe-connect, convex, persistence, webhook, schema]
dependency_graph:
  requires: []
  provides: [stripe-connect-persistence-backend]
  affects: [app/launch/success/vendor/page.tsx]
tech_stack:
  added: []
  patterns:
    - fetchAuthMutation from auth-server for user-auth Convex mutations from API routes
    - Convex HTTP API with Authorization: Convex <deploy-key> for admin-auth internal mutations
    - Two-step Stripe Connect persistence: save accountId on create, confirm on webhook
key_files:
  created:
    - convex/launch/stripeConnect.ts
    - app/api/stripe/connect/webhook/route.ts
  modified:
    - convex/schema.ts
    - app/api/stripe/connect/route.ts
    - convex/_generated/api.d.ts
decisions:
  - saveStripeConnectAccount promoted to public mutation (not internalMutation) — called via fetchAuthMutation with user JWT rather than admin key, because ConvexHttpClient.setAdminAuth is not a public API
  - confirmStripeConnect remains internalMutation — called from webhook via raw Convex HTTP API with CONVEX_DEPLOY_KEY in Authorization header
  - Webhook handler uses Convex HTTP API endpoint /api/mutation rather than ConvexHttpClient to avoid private API usage
  - Generated api.d.ts updated manually since npx convex dev cannot sync (pre-existing deployment config error unrelated to this plan)
metrics:
  duration: "~5 minutes"
  completed: "2026-03-15"
  tasks: 2
  files_modified: 5
---

# Phase 25 Plan 01: Onboarding Persistence Backend Summary

Backend persistence layer for Stripe Connect onboarding — schema fields on users table, Convex mutations/query, enhanced Connect API route, and new webhook endpoint.

## What Was Built

**Schema (convex/schema.ts):** Two new optional fields added to the `users` table after `stripeSubscriptionId`:
- `stripeConnectAccountId: v.optional(v.string())` — stores the `acct_xxx` Stripe Express account ID
- `stripeConnectComplete: v.optional(v.boolean())` — set to `true` by webhook when onboarding completes

Both are `v.optional` for backward compatibility with the shared main-app schema.

**Convex functions (convex/launch/stripeConnect.ts):**
- `saveStripeConnectAccount` (public `mutation`) — called by Connect API route via `fetchAuthMutation`; uses `getAppUser(ctx)` auth context to find user, patches `stripeConnectAccountId` and sets `stripeConnectComplete: false`
- `confirmStripeConnect` (`internalMutation`) — called by webhook via Convex HTTP API with admin auth; looks up user by account ID (filter scan, low-volume), patches `stripeConnectComplete: true`; idempotent (logs warning if account not found)
- `getStripeConnectStatus` (public `query`) — called from vendor page via `useQuery`; returns `{ accountId, complete }` for auth user; returns `{ accountId: null, complete: false }` if unauthenticated

**API route (app/api/stripe/connect/route.ts):** Enhanced to save account ID to Convex before returning onboarding URL. Uses `fetchAuthMutation` from `lib/auth-server` which injects the user's JWT into the Convex call. Return URL updated to include `?stripe_connect=complete` query param.

**Webhook route (app/api/stripe/connect/webhook/route.ts):** New endpoint at `/api/stripe/connect/webhook`. Validates Stripe signature using `STRIPE_CONNECT_WEBHOOK_SECRET`. Processes `account.updated` events where `details_submitted === true`. Calls `confirmStripeConnect` via raw HTTP fetch to Convex's `/api/mutation` endpoint with `Authorization: Convex <deploy-key>` admin auth. Returns 200 for all valid events.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ConvexHttpClient.setAdminAuth is not a public API**
- **Found during:** Task 2 (TypeScript check)
- **Issue:** The plan specified `convex.setAdminAuth(CONVEX_DEPLOY_KEY!)` on a `ConvexHttpClient` instance, but `setAdminAuth` is a `private` field in the `ConvexHttpClient` type definition — it's only public on the WebSocket-based `ConvexClient`
- **Fix:**
  - `saveStripeConnectAccount` promoted from `internalMutation` to public `mutation` — called via `fetchAuthMutation` from `lib/auth-server` which injects the user's JWT. The mutation uses `getAppUser(ctx)` auth context internally, eliminating the need for admin auth on this path.
  - `confirmStripeConnect` kept as `internalMutation` — webhook calls it via direct `fetch` to Convex's `/api/mutation` HTTP endpoint with `Authorization: Convex <deploy-key>` header (the documented way to call internal functions from outside Convex)
- **Files modified:** `convex/launch/stripeConnect.ts`, `app/api/stripe/connect/route.ts`, `app/api/stripe/connect/webhook/route.ts`

**2. [Rule 3 - Blocking] Generated api.d.ts not updated by Convex sync**
- **Found during:** Task 2 (TypeScript check after writing API routes)
- **Issue:** `api.launch.stripeConnect` was missing from `convex/_generated/api.d.ts` because `npx convex dev` cannot sync to the deployment (pre-existing `api/deploy2/start_push` 400 error unrelated to this plan's changes — confirmed by stash-test)
- **Fix:** Manually added `import type * as launch_stripeConnect` and the `"launch/stripeConnect"` entry to the `fullApi` declaration in `api.d.ts`. The runtime `api.js` uses `anyApi` (dynamic proxy) so no JS change needed.
- **Files modified:** `convex/_generated/api.d.ts`

## Environment Setup Required

Before the webhook endpoint can process events:
1. Add `STRIPE_CONNECT_WEBHOOK_SECRET` to `.env.local` (get from Stripe Dashboard > Connect > Webhooks after registering the endpoint)
2. Add `CONVEX_DEPLOY_KEY` to `.env.local` (get from Convex Dashboard > Settings > Deploy Keys)
3. Register `https://yourdomain.com/api/stripe/connect/webhook` in Stripe Dashboard with event: `account.updated`

For local testing, use `stripe listen --forward-connect-to localhost:3000/api/stripe/connect/webhook`.

## Self-Check: PASSED

All 4 key files exist on disk. Both task commits (2427ca8, 223a253) confirmed in git log.
