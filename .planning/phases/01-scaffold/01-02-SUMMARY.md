---
phase: 01-scaffold
plan: 02
subsystem: infra
tags: [convex, better-auth, shadcn, nextjs, typescript, stripe]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Next.js project skeleton with all config files and node_modules installed"
provides:
  - "5 component directories from source: ui, launch, join, auth, shared/footer"
  - "4 lib files: auth-client.ts, convex.tsx, utils.ts, auth-server.ts"
  - "Full Convex schema.ts byte-identical to source (shared deployment)"
  - "All Convex function files: auth, authHelpers, metros, platformSettings, emailTemplates, webhookSigning, convex.config.ts, tsconfig.json"
  - "convex/launch/ directory with 9 membership/queue function files"
  - "convex.json with better-auth external package config"
  - "app/api/auth/[...all]/route.ts — better-auth Next.js API handler"
affects: [02-convex, 03-auth, 04-ui-components, 05-homepage, 06-join, 07-why, 08-cities, 09-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Source copy pattern: components/ui, launch, join, auth, shared/footer copied verbatim from main repo"
    - "Schema parity: convex/schema.ts must remain byte-identical to source for shared Convex deployment"
    - "http.ts exclusion: No convex/http.ts — project relies on shared HTTP router in main repo"
    - "footer as directory: components/shared/footer/index.tsx (source imports @/components/shared/footer)"

key-files:
  created:
    - "components/ui/ — full shadcn/ui component library (new-york style)"
    - "components/launch/ — launch flow UI components (countdown, tier-selector, slot-grid, queue)"
    - "components/join/ — join page UI components (hero, food-as-language, free-seat, reserve-spot)"
    - "components/auth/ — auth UI components (login, signup wizard, verify-email, reset-password)"
    - "components/shared/footer/index.tsx — footer component (source: footer.tsx)"
    - "lib/auth-client.ts — Better Auth client configuration"
    - "lib/convex.tsx — Convex client provider"
    - "lib/utils.ts — utility functions"
    - "lib/auth-server.ts — Better Auth server configuration"
    - "convex/schema.ts — full shared schema (byte-identical to source)"
    - "convex/auth.config.ts — Convex auth configuration"
    - "convex/auth.ts — Convex auth functions"
    - "convex/authHelpers.ts — auth helper functions"
    - "convex/metros.ts — metro data functions"
    - "convex/platformSettings.ts — platform settings"
    - "convex/emailTemplates.ts — email templates"
    - "convex/webhookSigning.ts — webhook HMAC signing"
    - "convex/convex.config.ts — Convex components config (workpool, workflow, aggregate)"
    - "convex/tsconfig.json — TypeScript config for convex functions"
    - "convex/launch/ — 9 membership/queue Convex functions"
    - "convex.json — Convex project config with better-auth external package"
    - "app/api/auth/[...all]/route.ts — Better Auth Next.js API catch-all"
  modified: []

key-decisions:
  - "footer.tsx copied as components/shared/footer/index.tsx — source app/layout.tsx imports @/components/shared/footer (directory-style), so copying as index.tsx satisfies both the import and the plan's directory requirement"
  - "convex/http.ts intentionally excluded — pre-launch site uses shared HTTP router from main Tenseats Convex deployment"
  - "convex/schema.ts copied unchanged — modification would break shared Convex deployment"

patterns-established:
  - "Source-copy discipline: Only the 5 specified component dirs and 4 lib files copied — no admin/dashboard/feed/etc."
  - "Convex shared deployment: schema.ts must always match source exactly; http.ts must never exist here"

requirements-completed: [SCAF-01, SCAF-06, SCAF-07, SCAF-08, SCAF-09, SCAF-10, SCAF-14]

# Metrics
duration: 2min
completed: 2026-03-13
---

# Phase 1 Plan 02: Source File Copy Summary

**All component, lib, and Convex source files copied verbatim from main Tenseats repo — 82 files across 5 component dirs, 4 lib files, 10 Convex files, 9 launch functions, convex.json, and auth API route**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-13T01:10:40Z
- **Completed:** 2026-03-13T01:12:45Z
- **Tasks:** 2
- **Files modified:** 82

## Accomplishments
- All 5 component directories copied from source (ui, launch, join, auth, shared/footer) with full file trees
- All 4 lib files copied (auth-client.ts, convex.tsx, utils.ts, auth-server.ts)
- All Convex files copied with schema.ts verified byte-identical to source; convex/http.ts confirmed absent

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy component and lib directories from source** - `90f4f3e` (feat)
2. **Task 2: Copy Convex files, convex.json, and auth API route** - `9442878` (feat)

## Files Created/Modified
- `components/ui/` — 27 shadcn/ui components (accordion, alert-dialog, avatar, badge, button, calendar, card, checkbox, collapsible, command, dialog, dropdown-menu, form, input, label, popover, progress, radio-group, role-badge, select, separator, sheet, skeleton, sonner, switch, table, tabs, textarea)
- `components/launch/` — 11 launch flow components (checkout-countdown, launch-banner, launch-city-search, launch-countdown variants, launch-queue-dialog/form, profile-completion-form, queue-status, slot-grid, tier-selector)
- `components/join/` — 5 join page components (food-as-language-section, free-seat-section, join-cta-footer, join-hero, reserve-spot-section)
- `components/auth/` — 9 auth components (login-form, request-reset-form, reset-password-form, signup-step variants, signup-wizard, verify-email-form)
- `components/shared/footer/index.tsx` — footer component (source: shared/footer.tsx, restructured as index.tsx for directory import)
- `lib/auth-client.ts, lib/convex.tsx, lib/utils.ts, lib/auth-server.ts` — core lib files
- `convex/schema.ts` — full shared schema (byte-identical to source)
- `convex/auth.config.ts, auth.ts, authHelpers.ts` — auth configuration
- `convex/metros.ts, platformSettings.ts, emailTemplates.ts, webhookSigning.ts` — platform functions
- `convex/convex.config.ts, tsconfig.json` — Convex configuration
- `convex/launch/` — 9 membership/queue functions (membershipCheckout, membershipFulfillment, membershipWebhooks, profile, queue, queueActions, queueEmail, queueInternal, seed)
- `convex.json` — Convex project config with better-auth external package
- `app/api/auth/[...all]/route.ts` — Better Auth Next.js API catch-all route

## Decisions Made
- Copied `footer.tsx` as `components/shared/footer/index.tsx` rather than `components/shared/footer.tsx` — the source `app/layout.tsx` imports `@/components/shared/footer` (directory-style import), and the plan required `components/shared/footer` to be a directory. Creating `index.tsx` satisfies both constraints without modification.
- `convex/http.ts` intentionally excluded per plan — pre-launch relies on the shared HTTP router in the main Tenseats Convex deployment.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] footer.tsx copied as components/shared/footer/index.tsx**
- **Found during:** Task 1 (Copy component and lib directories)
- **Issue:** Source has `components/shared/footer.tsx` (a file), but plan specified copying `components/shared/footer/` (a directory). The verify step checks `test -d components/shared/footer`. The source `app/layout.tsx` imports `@/components/shared/footer` which resolves as a directory index import.
- **Fix:** Created `components/shared/footer/` directory and placed footer content as `index.tsx` to satisfy both the directory requirement and the TypeScript import pattern.
- **Files modified:** `components/shared/footer/index.tsx` (created)
- **Verification:** `test -d components/shared/footer` passes; file content identical to source `footer.tsx`
- **Committed in:** `90f4f3e` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - structural adaptation)
**Impact on plan:** Necessary adaptation — source file restructured as index.tsx to match expected directory import pattern and plan verification requirements. No content modification.

## Issues Encountered
- Source repo had `footer.tsx` as a flat file in `shared/`, not a `footer/` subdirectory. Resolved by creating `footer/index.tsx` to match the import pattern used in `app/layout.tsx`.

## User Setup Required
None - no external service configuration required for this plan.

## Next Phase Readiness
- All component, lib, and Convex source files in place
- Ready for Phase 1 Plan 03 (next scaffold plan) or Phase 2 (Convex setup)
- No blockers

## Self-Check: PASSED

All files verified present. All commits verified in git log.
- components/ui/: FOUND
- components/launch/: FOUND
- components/join/: FOUND
- components/auth/: FOUND
- components/shared/footer/: FOUND
- lib/auth-client.ts: FOUND
- lib/convex.tsx: FOUND
- lib/utils.ts: FOUND
- lib/auth-server.ts: FOUND
- convex/schema.ts: FOUND (byte-identical to source)
- convex/auth.config.ts: FOUND
- convex/auth.ts: FOUND
- convex/authHelpers.ts: FOUND
- convex/launch/: FOUND
- convex/metros.ts: FOUND
- convex/platformSettings.ts: FOUND
- convex/emailTemplates.ts: FOUND
- convex/webhookSigning.ts: FOUND
- convex/convex.config.ts: FOUND
- convex/tsconfig.json: FOUND
- convex.json: FOUND
- app/api/auth/[...all]/route.ts: FOUND
- convex/http.ts: ABSENT (confirmed)
- Commit 90f4f3e: FOUND
- Commit 9442878: FOUND

---
*Phase: 01-scaffold*
*Completed: 2026-03-13*
