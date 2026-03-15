---
phase: 20-schema-coordination
plan: "01"
subsystem: documentation
tags: [convex, stripe, onboarding, post-signup, roles, claude-code-prompt]

# Dependency graph
requires: []
provides:
  - "tenseats-main-app-post-signup-prompt.md: Comprehensive Claude Code prompt for main app post-signup experience"
  - "Post-signup redirect chain documented: signup -> almost-there -> verify-email -> role-based success"
  - "Schema approach for onboarding persistence using existing fields"
affects:
  - phase: 20-02-schema-verification
  - phase: 22-verification-page
  - phase: 23-guest-success
  - phase: 24-vendor-success
  - phase: 25-onboarding-persistence

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prompt-as-documentation: Claude Code prompt format for prescriptive implementation guides"
    - "Onboarding persistence via existing schema fields (no new tables)"
    - "Role routing via userRoles table query after OTP verification"

key-files:
  created:
    - "tenseats-main-app-post-signup-prompt.md"
  modified: []

key-decisions:
  - "Use existing schema fields for onboarding persistence: stripeCustomerId, currentMetroId, cuisinePreferences, isProfileComplete — no new onboardingProgress table"
  - "Role routing canonical source is userRoles table, not preRegistrations"
  - "isProfileComplete requires hasRole + hasCity; Stripe connect is optional for all roles"
  - "Pinterest URL is a placeholder (TBD) — vendor page uses # with coming-soon label"
  - "Vendor success page must work without Stripe connected — never block on stripeCustomerId"

patterns-established:
  - "Post-signup pattern: almost-there (static) -> verify-email (OTP guard) -> role-based success"
  - "Shared component pattern: SocialLinks + AddressBookReminder reused across guest/vendor pages"

requirements-completed:
  - SCHEMA-01

# Metrics
duration: 2min
completed: "2026-03-14"
---

# Phase 20 Plan 01: Schema Coordination Summary

**732-line prescriptive Claude Code prompt document for the main Tenseats app's complete post-signup experience — covering 3 pages, role routing logic, Stripe Express Connect, and verbatim consumer-facing copy**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-14T17:55:16Z
- **Completed:** 2026-03-14T17:57:56Z
- **Tasks:** 2 (Task 1: research, Task 2: document creation)
- **Files modified:** 1

## Accomplishments

- Created `tenseats-main-app-post-signup-prompt.md` (732 lines) covering all 8+ sections of the spec
- Documented complete redirect chain with role-based routing logic using existing `userRoles` table
- Specified verbatim copy for all three pages (Almost There, Guest Success, Vendor Success) using brand voice rules from tenseats-copy-writer skill
- Mapped onboarding persistence to existing schema fields — no new tables required
- Included Stripe Express Connect OAuth implementation pattern with required env vars
- Specified shared component architecture: `SocialLinks`, `AddressBookReminder`

## Task Commits

1. **Task 1: Research existing schema and flow** — no artifacts (research only)
2. **Task 2: Write the main-app post-signup Claude Code prompt document** — `c52e4b9` (feat)

## Files Created/Modified

- `tenseats-main-app-post-signup-prompt.md` — Comprehensive Claude Code prompt for main Tenseats marketplace repo post-signup experience

## Decisions Made

- **Onboarding persistence via existing fields:** `stripeCustomerId` (Stripe), `currentMetroId` (city), `cuisinePreferences` (tastes), `isProfileComplete` (overall flag) — no new `onboardingProgress` table
- **isProfileComplete triggers:** hasRole + hasCity for all roles; Stripe is optional
- **Pinterest placeholder:** Professional page URL not finalized — use `#` with "(coming soon)" label
- **verify-email session guard preserved:** Existing guard behavior kept intact; signup flow must establish session before redirecting to `/almost-there`
- **Role routing source:** `userRoles` table only — not `preRegistrations.role`

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required. Document is for use in a separate Cursor/Claude Code session against the main app repo.

## Next Phase Readiness

- `tenseats-main-app-post-signup-prompt.md` is ready for use: user can open the main marketplace repo in Cursor/Claude Code and paste/reference this prompt to build the full post-signup experience
- Phase 20 Plan 02 (schema verification) can proceed — the prompt includes schema verification instructions and the deployment workflow
- Prelaunch Phases 21-24 can proceed in parallel once the main app schema is deployed

---
*Phase: 20-schema-coordination*
*Completed: 2026-03-14*
