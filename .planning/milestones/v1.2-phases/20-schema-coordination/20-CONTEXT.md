# Phase 20: Schema Coordination - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate a comprehensive Claude Code prompt document for the main Tenseats marketplace repo covering the full post-signup experience (verification page, guest success, vendor success, onboarding persistence, Stripe connect, social links). Verify the shared Convex schema includes any necessary additions before Phase 25 persistence code is written. This phase produces documentation only — no code changes to either repo.

</domain>

<decisions>
## Implementation Decisions

### Prompt document format
- Audience: Claude Code — structured as a Claude Code prompt for the main app repo (like `tenseats-prelaunch-claude-code-prompt.md`)
- Detail level: Highly prescriptive — specify exact routes, component names, copy text, data model fields, routing logic
- Copy: Include exact consumer-facing copy (headlines, body, CTAs) written via tenseats-copy-writer skill. Main app implements verbatim
- Scope: Main app only — prelaunch site builds its own pages separately in Phases 22-24

### Onboarding data model
- Leverage existing schema fields rather than creating new tables:
  - `users.stripeCustomerId` / `users.stripeSubscriptionId` — Stripe connect completion
  - `userPreferences.currentMetroId` — city selection step
  - `userPreferences.cuisinePreferences` — cuisine preferences step
  - `userRoles` table — role already selected during signup (step 1, always complete)
  - `users.isProfileComplete` — overall completion flag
- Single row per user (existing tables already structured this way)
- Same tables for all roles — vendor-specific fields (Stripe) are optional, null for guests
- Prompt must instruct: "Always check current schema before adding new tables or fields"
- If a new `onboardingProgress` table is truly needed, keep it minimal — but prefer tracking completion via existing field population

### Schema deployment workflow
- Phase 20 generates the prompt document only — does not execute it
- User runs the prompt in a separate Cursor instance against the main app repo
- Main app deploys schema changes via `npx convex deploy`
- Prelaunch site copies the full updated `schema.ts` from main app repo (same proven process as v1.0)
- The prompt document itself includes schema verification instructions

### Post-signup redirect flow
- Prompt specifies the full redirect chain: signup → "almost there" → OTP verify → role-based success page
- `userRoles` table is the canonical source for role routing (not `preRegistrations`)
- Routing logic: non-guest role (chef, mixologist, creator, venueHost) → vendor success page; guest → guest success page
- Schema roles: chef, mixologist, creator, venueHost, guest (5 total — no "facilitator" in schema, that's display-only on prelaunch city pages)
- Prompt should ensure role is written to `userRoles` during the signup flow if not already

### Claude's Discretion
- Internal prompt document structure and section ordering
- How to phrase schema verification instructions
- Whether to include architecture diagrams or just text
- File naming for the prompt document

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tenseats-prelaunch-claude-code-prompt.md`: Existing Claude Code prompt for this repo — use as format reference for the main app prompt
- `convex/schema.ts`: Full shared schema (copied from main app) — the single source of truth for data model

### Established Patterns
- Schema safety: Full `schema.ts` copy, no partial diffs — any change must go through main app first
- Main app is read-only from this project — prompt generation only, no direct modifications
- Role type union: `chef | mixologist | creator | venueHost | guest` — defined in schema.ts line 15

### Integration Points
- Existing `users` table fields: `stripeCustomerId`, `stripeSubscriptionId`, `isProfileComplete`, `membershipTier`, `membershipCategory`
- Existing `userPreferences` table: `currentMetroId`, `cuisinePreferences`, `hashtagPreferences`
- Existing `userRoles` table: `userId`, `role`, `status` — canonical role source
- Existing `verify-email/page.tsx`: Has session guard that bounces unauthenticated users (known tech debt — prompt should address this flow)
- Existing `launch/success/page.tsx`: Basic placeholder — will be replaced by Phases 22-24

</code_context>

<specifics>
## Specific Ideas

- "Always check the current schema before adding new tables or fields" — user directive for the prompt
- "Leverage what we already have before building something new" — prefer existing schema fields over new tables
- Role is selected during signup (step 1, always complete by success page) — remaining steps are optional
- Onboarding steps after role: city selection, cuisine preferences, Stripe Express Connect (vendors only)
- User will run the generated prompt in a separate Cursor instance, then return to continue prelaunch Phases 21+

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-schema-coordination*
*Context gathered: 2026-03-14*
