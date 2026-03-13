---
phase: 09-seo-deployment-copy-qa
plan: 02
subsystem: ui
tags: [copy, brand, city-data, compliance]

# Dependency graph
requires:
  - phase: 07-city-pages
    provides: lib/city-data.ts with all city heroHeadline, heroSubhead, sceneIntro, topPersonas
  - phase: 03-homepage
    provides: hero-section.tsx consumer-facing copy
  - phase: 04-join-page
    provides: join-hero.tsx consumer-facing copy
  - phase: 08-why-tenseats-page
    provides: why-hero.tsx consumer-facing copy
provides:
  - Brand-compliant city copy across all 32 city entries in lib/city-data.ts
  - Zero forbidden adjectives in any consumer-facing string
affects: [09-03-PLAN, any future copy additions to city-data.ts]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - lib/city-data.ts

key-decisions:
  - "Code identifiers ('insider' type literals, id values) are exempt from COPY-01 — only visible text strings are in scope"
  - "COPY-02 'restaurant' in Cincinnati topPersonas.cityDescription is not a hero headline — no fix needed"
  - "Replaced 'unique' with context-aware alternatives: 'distinctive', 'particular', 'rare', 'singular'"

patterns-established:
  - "Brand compliance rule: 'unique' is a forbidden adjective — use distinctive/particular/rare/singular as context warrants"

requirements-completed:
  - COPY-01
  - COPY-02
  - COPY-03
  - COPY-04
  - COPY-05
  - COPY-06

# Metrics
duration: 2min
completed: 2026-03-13
---

# Phase 09 Plan 02: Brand Copy Compliance Audit and Fix Summary

**Full COPY-01 through COPY-06 brand compliance audit across 32 cities — found and fixed 4 instances of forbidden adjective "unique" in Philadelphia, Milwaukee, and Phoenix city data**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-13T10:47:34Z
- **Completed:** 2026-03-13T10:50:20Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Audited all 6 COPY rules across every .tsx and .ts file in app/, components/, and lib/city-data.ts
- Found zero violations for COPY-01, COPY-02, COPY-03, COPY-04, COPY-06
- Found and fixed 4 COPY-05 forbidden adjective violations (all instances of "unique") in lib/city-data.ts
- Verified all 32 heroSubhead values are within the 25-word hard maximum
- Confirmed 111 instances of discovery mechanic language across codebase (COPY-06 positive check)

## Task Commits

Each task was committed atomically:

1. **Task 1: Audit all consumer-facing copy for brand compliance violations** - `eb3283e` (chore)
2. **Task 2: Fix all brand compliance violations found in audit** - `982f12d` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `lib/city-data.ts` — Fixed 4 forbidden adjective violations in Philadelphia sceneIntro, Philadelphia topPersonas chef, Milwaukee topPersonas mixologist, and Phoenix sceneIntro

## Decisions Made

- Code identifiers using "insider" as a type literal or object id are exempt from COPY-01 — the rule applies only to visible text strings rendered to users
- COPY-02 match ("restaurant" in Cincinnati city data) is in `topPersonas.cityDescription`, not a hero headline or subheadline — no fix needed per rule scope
- "unique" replacements chosen contextually: "distinctive" (Philadelphia BYOB cultural context), "particular" (Philadelphia chef persona), "rare" (Milwaukee cocktail opportunities), "singular" (Phoenix terroir uniqueness)

## Deviations from Plan

None — plan executed exactly as written. Task 2 documented zero-violation paths for COPY-01 through COPY-04 and COPY-06, and fixed the 4 COPY-05 violations found during Task 1.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All consumer-facing copy passes brand compliance
- Zero forbidden adjectives remain in any rendered text
- Ready for Phase 09-03 (deployment QA or remaining SEO/deployment tasks)

---
*Phase: 09-seo-deployment-copy-qa*
*Completed: 2026-03-13*
