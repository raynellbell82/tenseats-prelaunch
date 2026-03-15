---
phase: 20-schema-coordination
verified: 2026-03-14T18:30:00Z
status: passed
score: 5/5 must-haves verified
---

# Phase 20: Schema Coordination Verification Report

**Phase Goal:** The main app has a complete prompt documenting the post-signup flow, and the shared Convex schema includes the onboarding progress table before any persistence code is written
**Verified:** 2026-03-14T18:30:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A prompt document exists covering every aspect of the post-signup experience for the main app developer to implement (pages, persistence logic, Stripe step, Zoho messaging, social links) | VERIFIED | `tenseats-main-app-post-signup-prompt.md` exists at 732 lines with 10 sections covering all specified areas |
| 2 | The shared Convex backend has the onboarding progress schema deployed and queryable before Phase 25 begins | VERIFIED | `convex/schema.ts` (1,688 lines) contains all required fields. No new `onboardingProgress` table was added — existing fields (`stripeCustomerId`, `isProfileComplete`, `currentMetroId`, `cuisinePreferences`) serve as onboarding signals per approved design decision |
| 3 | No onboarding persistence code is written until SCHEMA-02 is confirmed | VERIFIED | Schema gate confirmed cleared. No persistence implementation code was written in this phase — Phase 25 plans are TBD |

**Score:** 3/3 Success Criteria verified

---

### Must-Have Truths (from PLAN frontmatter)

#### Plan 20-01 Must-Haves

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A prompt document exists that a Claude Code / Cursor session can execute against the main Tenseats marketplace repo to build the complete post-signup experience | VERIFIED | File exists at project root, 732 lines, starts with "# Claude Code Prompt: `tenseats-marketplace` — Post-Signup Experience" |
| 2 | The prompt covers every post-signup page: almost-there verification, guest success, vendor success | VERIFIED | Sections 4a (`/almost-there`), 4b (`/welcome/guest`), 4c (`/welcome/vendor`) all present with exact routes, component names, and copy |
| 3 | The prompt specifies onboarding persistence logic using existing schema fields where possible | VERIFIED | Section 5 explicitly documents `getOnboardingStatus` query using existing fields; explicitly forbids new `onboardingProgress` table |
| 4 | The prompt includes exact consumer-facing copy for all pages (headlines, body, CTAs) | VERIFIED | All three pages have verbatim copy blocks: "Check your inbox.", "You're in.", "The whisper network just got wider.", CTA text, body text, address book copy |
| 5 | The prompt specifies the redirect chain: signup -> almost-there -> OTP verify -> role-based success page | VERIFIED | Section 2 shows complete ASCII diagram of redirect chain with role-routing logic for all 5 roles |

**Score:** 5/5 plan-level truths verified

#### Plan 20-02 Must-Haves

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The shared Convex backend has any schema additions from the prompt document deployed and queryable | VERIFIED | User confirmed "schema deployed"; prompt document resolved to use existing fields (no additions needed) |
| 2 | The prelaunch site's schema.ts is a copy of the main app's current deployed schema | VERIFIED | `diff` between both schema.ts files returned empty output; both files are 1,688 lines |
| 3 | No onboarding persistence code is written until schema deployment is confirmed | VERIFIED | Phase 25 (Onboarding Persistence) has 0 plans started; gate is the only artifact from this phase |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `tenseats-main-app-post-signup-prompt.md` | Comprehensive Claude Code prompt for main app post-signup experience; min 200 lines | VERIFIED | 732 lines — well above 200-line minimum |
| `convex/schema.ts` | Updated schema copied from main app (if changes were needed); must contain `defineSchema` | VERIFIED | 1,688 lines, contains `defineSchema`, byte-for-byte identical to main app schema |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `tenseats-main-app-post-signup-prompt.md` | `convex/schema.ts` | References existing schema tables and fields | VERIFIED | Document references `users`, `userRoles`, `userPreferences`, `stripeCustomerId`, `isProfileComplete`, `currentMetroId`, `cuisinePreferences` — all present in schema.ts |
| `tenseats-main-app-post-signup-prompt.md` | `tenseats-prelaunch-claude-code-prompt.md` | Follows same format as the prelaunch prompt | VERIFIED | Both documents open with "# Claude Code Prompt: `{repo}`" and use same section structure (Context, Schema Approach, Pages, Design Requirements, Gotchas) |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SCHEMA-01 | 20-01-PLAN.md | Generate a comprehensive prompt document for the main Tenseats marketplace repo covering onboarding progress schema, verification page, guest/vendor success pages, Stripe connect, Zoho messaging, social links, and persistence logic | SATISFIED | `tenseats-main-app-post-signup-prompt.md` exists at 732 lines covering all listed items: Sections 1-10 covering schema, redirect chain, all 3 pages with exact routes/copy, Stripe connect OAuth pattern, Zoho One link, social link components, onboarding persistence logic |
| SCHEMA-02 | 20-02-PLAN.md | Before building onboarding persistence (ONBOARD-01/02), verify the schema change has been deployed to the shared Convex backend | SATISFIED | User confirmed "schema deployed"; diff between prelaunch and main app schema.ts is empty (identical files at 1,688 lines); Phase 25 (ONBOARD-01/02) gate is cleared |

No orphaned requirements — REQUIREMENTS.md traceability table maps exactly SCHEMA-01 and SCHEMA-02 to Phase 20, both now Complete.

---

### Anti-Patterns Found

Scanned `tenseats-main-app-post-signup-prompt.md` (the only file created in this phase):

| File | Pattern | Severity | Finding |
|------|---------|----------|---------|
| `tenseats-main-app-post-signup-prompt.md` | TODO/placeholder content | None | Document is a prompt specification, not implementation code. Placeholder items are intentional and documented: Pinterest URL noted as "(coming soon)" by design |
| `convex/schema.ts` | Schema stubs | None | Schema was already complete; no new tables or stubs added |

No blockers or warnings found. The Pinterest placeholder is an explicit documented design decision (professional page URL not yet created), not a gap.

---

### Human Verification Required

This phase produces a documentation artifact (a prompt document), not runnable code. Two items need human confirmation before downstream phases depend on this prompt:

**1. Prompt Document Executability**

**Test:** Open the main Tenseats marketplace repo in Cursor or Claude Code. Reference `tenseats-main-app-post-signup-prompt.md` as the prompt. Verify the session can execute the prompt without requiring clarifying questions.
**Expected:** Claude/Cursor proceeds to implement all three pages, role routing, and Stripe connect without ambiguity.
**Why human:** Cannot programmatically verify that a prompt is "complete enough" to execute — this requires a live Claude Code session against the main repo.

**2. Schema Deployment Confirmation**

**Test:** Navigate to the Convex dashboard for the shared deployment. Verify `users.stripeCustomerId`, `users.isProfileComplete`, `userPreferences.currentMetroId`, `userPreferences.cuisinePreferences` are present and queryable.
**Expected:** All four fields appear in the schema with their expected types.
**Why human:** The SUMMARY claims user confirmed "schema deployed" — this cannot be programmatically verified from the prelaunch repo. The diff confirms the files match, but live deployment status requires dashboard access.

---

## Summary

Phase 20 achieved its goal. Both plans executed cleanly:

- **Plan 20-01:** Produced a 732-line prescriptive Claude Code prompt document covering all 8 specified sections (plus a Section 9: Implementation Order and Section 10: Verification Checklist). The document includes verbatim copy for all three pages, exact schema field references, Stripe Express Connect OAuth pattern, Zoho One link, role-based routing logic, and shared component specifications. Format matches the prelaunch prompt template.

- **Plan 20-02:** The SCHEMA-02 gate was cleared. The user confirmed schema deployment; the prelaunch `convex/schema.ts` was already byte-for-byte identical to the main app schema (both 1,688 lines, empty diff). No new `onboardingProgress` table was needed — the approved design decision to use existing schema fields was verified correct against the actual schema. Phase 25 (Onboarding Persistence) is unblocked.

The phase goal's two conditions are both met: the prompt document exists and is complete, and the schema state is confirmed before any persistence code is written.

---

_Verified: 2026-03-14T18:30:00Z_
_Verifier: Claude (gsd-verifier)_
