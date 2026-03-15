# Phase 25: Onboarding Persistence - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Completed onboarding steps survive sessions. When a vendor returns after logging out, the vendor success page shows which steps are already complete and does not re-prompt. Currently the only persistable step is Stripe Express Connect — email safelist and explore soon are client-only and not tracked.

</domain>

<decisions>
## Implementation Decisions

### What gets persisted
- Stripe Connect completion only — email safelist is client-side (clipboard copy), no backend tracking needed
- Store Stripe account ID on the **users table** (existing `stripeCustomerId` field or add `stripeConnectAccountId`) — per Phase 20 decision to leverage existing schema fields rather than new tables
- Do NOT update `users.isProfileComplete` — that flag waits for full onboarding in future versions. Only mark the Stripe step itself as completed
- Stripe Express (not Standard) — this is the account type we're using

### Return visit experience
- When Stripe is already connected: green checkmark replaces the Connect Stripe button, text shows "Stripe Connected"
- Email safelist and explore soon timeline steps do not change on return visits — they are not tracked
- A vendor who has not completed any steps sees the full flow unchanged (ONBOARD-02 success criteria #3)

### Stripe Connect callback flow
- Detection via Stripe webhook (`account.updated`) — webhook infrastructure is already set up
- Save Stripe account ID immediately when creating the account in `/api/stripe/connect` (pending state)
- Webhook confirms completion and marks as fully connected
- Vendor success page uses Convex reactive query (`useQuery`) — when webhook writes completion, page auto-updates without refresh
- Need ngrok for local webhook testing
- `/api/stripe/connect` route needs to be updated to: 1) accept userId, 2) save account ID to Convex immediately, 3) return onboarding URL

### Claude's Discretion
- Exact field name for Stripe account ID on users table (prefer existing fields if they fit)
- Webhook event handling details (which specific events to listen for)
- How to pass userId through the Stripe Connect flow (metadata, session, etc.)
- Loading/pending state UI while waiting for webhook confirmation

</decisions>

<specifics>
## Specific Ideas

- Convex real-time reactivity makes this seamless — user completes Stripe onboarding, returns to vendor page, and it's already updated
- Save immediately + confirm via webhook: two-step process prevents losing the account ID if user abandons
- "Connected" state is a simple visual swap: button → checkmark + label

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/api/stripe/connect/route.ts`: Existing Stripe Express account creation route — needs enhancement to save account ID and pass userId
- `app/launch/success/vendor/page.tsx`: Vendor success page with VerticalTimeline, Stripe button, auth guard — needs to query completion state
- `convex/launch/queue.ts`: `getUserRole` query — pattern for authenticated Convex queries
- Stripe webhook infrastructure: already set up (exact location TBD — planner should scout)

### Established Patterns
- Convex `useQuery` for reactive data — auto-updates when backend data changes
- `getAppUserId(ctx)` in `convex/authHelpers.ts` for authenticated Convex functions
- Users table: `stripeCustomerId` (v.optional(v.string())) already exists at schema.ts line 209
- `stripeConnectAccounts` table exists in schema but per Phase 20 decision we use users table fields instead

### Integration Points
- `/api/stripe/connect` POST route → needs to write to Convex (mutation) to save account ID
- Stripe webhook endpoint → needs to write to Convex (mutation) to confirm completion
- Vendor success page → needs Convex query to check if Stripe is connected
- `return_url` in Stripe account link currently points to `/launch/success/vendor` — may need query params for state

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 25-onboarding-persistence*
*Context gathered: 2026-03-14*
