---
phase: 13-city-persona-copy
plan: 01
subsystem: ui
tags: [copy, city-data, personas, content]

# Dependency graph
requires:
  - phase: 12-persona-component-foundation
    provides: PersonaCard component, topPersonas type with 6 roles including facilitator, canonical role union type
provides:
  - Complete 6-entry topPersonas arrays for 11 cities (Chicago, Austin, Atlanta, Houston, Denver, Philadelphia, New York, Washington DC, Charleston, Asheville, Dallas)
  - Canonical role order (guest, chef, mixologist, curator, venueHost, facilitator) established across all 11 cities
  - COPY-02-compliant city-specific persona copy referencing neighborhood-level subculture details
affects: [city-pages, 13-02-city-persona-copy-batch2]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Canonical persona order: guest → chef → mixologist → curator → venueHost → facilitator across all city entries"
    - "Each persona description mines city sceneBlocks for neighborhood-level specifics (not generic food scene)"
    - "Facilitator role anchored to city-specific connector context (named neighborhoods, named formats)"

key-files:
  created: []
  modified:
    - lib/city-data.ts

key-decisions:
  - "Replace entire topPersonas array for each city (not append-only) to enforce canonical role order"
  - "Existing copy preserved verbatim where brand-compliant; reordered into canonical position"
  - "Chicago treated separately: needed 5 new entries (was 1-entry city vs 3-entry for others)"
  - "Philadelphia mixologist added despite research doc listing venueHost as missing — actual file had venueHost already present"

patterns-established:
  - "Facilitator copy pattern: name the specific neighborhoods and formats the facilitator connects (e.g., Pilsen kitchen + Wicker Park audience), never generic"
  - "Mixologist copy pattern: name the local spirit/beverage tradition and the specific pop-up format to partner with"
  - "venueHost copy pattern: name the specific neighborhood/architecture type that makes the space distinctive"
  - "curator copy pattern: name the specific underground circuit or format that runs ahead of press coverage"

requirements-completed: [COPY-01, COPY-02, COPY-03, DATA-01]

# Metrics
duration: 12min
completed: 2026-03-13
---

# Phase 13 Plan 01: City Persona Copy (Cities 1-11) Summary

**66 persona entries written for 11 cities (Chicago through Dallas) with city-specific COPY-02-compliant copy in canonical 6-role order — covering all Tier 1 cities and first half of Tier 2**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-13T~14:40Z
- **Completed:** 2026-03-13T~14:52Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Chicago expanded from 1 entry to 6 (added guest, curator, venueHost, facilitator alongside existing chef + mixologist)
- 10 cities (Austin, Atlanta, Houston, Denver, Philadelphia, New York, DC, Charleston, Asheville, Dallas) expanded from 3 entries to 6 each
- All 11 cities verified in canonical order: guest, chef, mixologist, curator, venueHost, facilitator
- Zero forbidden adjectives confirmed via grep across full file
- TypeScript compiles with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Persona copy for cities 1-6** - `75638e9` (feat)
2. **Task 2: Persona copy for cities 7-11** - `ef5932d` (feat)

## Files Created/Modified

- `lib/city-data.ts` - 6-entry topPersonas arrays added for 11 cities; 237 lines added, 39 lines removed (net: +198 lines of persona copy)

## Decisions Made

- Replaced entire topPersonas arrays (not append-only) to enforce consistent canonical role order — cleaner for grid rendering and future maintenance
- Existing copy preserved verbatim where brand-compliant; only reordered into canonical position
- Chicago required special handling: 5 new entries vs 3 for all other cities (was the only 1-entry city)
- Philadelphia: research doc said mixologist was missing but actual file showed venueHost already present. Added mixologist, curator, facilitator instead — worked with actual file state

## Deviations from Plan

**1. [Rule 1 - Data correction] Philadelphia actual state differed from research doc**
- **Found during:** Task 1 (Philadelphia city write)
- **Issue:** Research doc listed Philadelphia as having "chef, guest, mixologist" — file actually had "chef, guest, venueHost"
- **Fix:** Added mixologist, curator, facilitator (the actual missing roles) rather than venueHost, curator, facilitator as the plan suggested — result is the same 6-entry canonical array
- **Files modified:** lib/city-data.ts
- **Verification:** All 6 roles present in canonical order, TypeScript passes

---

**Total deviations:** 1 auto-corrected (data mismatch between research doc and actual file state)
**Impact on plan:** No impact on output — same 6 roles delivered, different 3 were added. Final state is identical canonical 6-entry array.

## Issues Encountered

None — pure copy-writing execution with single data mismatch corrected inline.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Cities 1-11 complete with 66 total persona entries (6 per city)
- Phase 13 Plan 02 can proceed with cities 12-21 (Detroit through Cincinnati batch)
- Pattern established: all future city batches should use same canonical order and same city-specific sourcing approach (mine sceneBlocks, name neighborhoods, anchor facilitator to specific connector context)
- Remaining 21 cities still need 3 new entries each + facilitator; Chicago pattern (5-entry expansion) does not repeat

---
*Phase: 13-city-persona-copy*
*Completed: 2026-03-13*
