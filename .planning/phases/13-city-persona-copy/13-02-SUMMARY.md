---
phase: 13-city-persona-copy
plan: 02
subsystem: ui
tags: [copy, city-data, personas, content]

# Dependency graph
requires:
  - phase: 13-city-persona-copy
    plan: 01
    provides: Canonical role order established, first 11 cities complete, patterns set
provides:
  - Complete 6-entry topPersonas arrays for 11 more cities (Detroit through Scottsdale)
  - Canonical role order (guest, chef, mixologist, curator, venueHost, facilitator) enforced across all 11 cities
  - COPY-02-compliant city-specific persona copy referencing neighborhood-level subculture details
affects: [city-pages, 13-03-city-persona-copy-batch3]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Facilitator copy anchored to named neighborhoods and specific connector context (e.g., 'Eastern Market chef needs a Midtown venue')"
    - "Mixologist copy names specific local spirit/ingredient tradition (Detroit craft spirits, Tampa rum heritage, Sonoran botanicals)"
    - "Curator copy identifies the undocumented or under-covered scene element specific to each city"
    - "venueHost copy names the architectural type or neighborhood characteristic that makes the space distinctive"

key-files:
  created: []
  modified:
    - lib/city-data.ts

key-decisions:
  - "Replaced entire topPersonas arrays (not append-only) to enforce canonical role order across all 11 cities"
  - "Existing 3-entry copy preserved and reordered; new entries written from sceneBlocks cultural specifics"
  - "Orlando venueHost copy preserved verbatim (was already in correct canonical position)"
  - "Pittsburgh mixologist added despite research noting only venueHost/curator/facilitator missing — actual file had venueHost already present"

requirements-completed: [COPY-01, COPY-02, COPY-03, DATA-01]

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 13 Plan 02: City Persona Copy (Cities 12-22) Summary

**66 persona entries written for 11 cities (Detroit through Scottsdale) with city-specific COPY-02-compliant copy in canonical 6-role order — completing all Tier 2 second-half cities and first-half Tier 3 cities**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-13T~15:02Z
- **Completed:** 2026-03-13T~15:10Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Detroit expanded from 3 to 6 entries: added mixologist (Corktown craft spirits), curator (Eastern Market pipeline), facilitator (Eastern Market-to-Midtown matchmaker)
- Charlotte expanded from 3 to 6: added mixologist (NoDa arts crowd), venueHost (Plaza Midwood spaces), facilitator (NoDa-to-South End connector)
- Columbus expanded from 3 to 6: added mixologist (Short North cocktail culture), venueHost (Short North arts studios), facilitator (Franklinton-to-Short North connector)
- Orlando expanded from 3 to 6: added mixologist (Mills 50 Vietnamese corridor), curator (Winter Park/Audubon undocumented scene), facilitator (Mills 50-to-Audubon Park connector)
- Cincinnati expanded from 3 to 6: added curator (OTR Italianate revival mid-stride), venueHost (OTR architecture), facilitator (Findlay Market-to-OTR matchmaker)
- Pittsburgh expanded from 3 to 6: added mixologist (Lawrenceville bar scene), curator (Strip District Eastern European archive), facilitator (Strip District-to-Lawrenceville connector)
- Tampa expanded from 3 to 6: added mixologist (Gulf Coast Cuban rum heritage), curator (Ybor immigrant food traditions evolution), facilitator (Ybor-to-Armature Works matchmaker)
- St. Petersburg expanded from 3 to 6: added mixologist (EDGE District gallery crowd), curator (Warehouse Arts District art-food crossover), facilitator (Central Arts District bridge role)
- Milwaukee expanded from 3 to 6: added curator (Third Ward supper club tradition), venueHost (Third Ward warehouse spaces), facilitator (Walker's Point word-of-mouth connector)
- Phoenix expanded from 3 to 6: added mixologist (desert botanicals + Sonoran agave spirits), venueHost (Roosevelt Row gallery spaces), facilitator (Sonoran chef-to-Roosevelt-Row connector)
- Scottsdale expanded from 3 to 6: added mixologist (Verde Valley/Arizona wine pairing), curator (Old Town supper club circuit), facilitator (North Scottsdale private dining matchmaker)
- All 11 cities verified in canonical order: guest, chef, mixologist, curator, venueHost, facilitator
- Zero forbidden adjectives confirmed via grep across full file
- TypeScript compiles with zero errors
- Combined with Plan 01: 22 of 32 cities now have complete 6-entry persona arrays

## Task Commits

Each task was committed atomically:

1. **Task 1: Persona copy for cities 12-17** - `5be7c1a` (feat)
2. **Task 2: Persona copy for cities 18-22** - `c3daa95` (feat)

## Files Created/Modified

- `lib/city-data.ts` - 6-entry topPersonas arrays expanded for 11 cities; 242 lines added, 44 lines removed (net: +198 lines of persona copy)

## Decisions Made

- Replaced entire topPersonas arrays (not append-only) to enforce consistent canonical role order — consistent with Plan 01 decision
- Existing copy preserved verbatim where brand-compliant; only reordered into canonical position
- Pittsburgh: research doc listed missing roles as venueHost/curator/facilitator — actual file had venueHost already present. Added mixologist, curator, facilitator (the actual missing roles). Result is the same 6-entry canonical array.
- Detroit Orlando Cincinnati: existing venueHost or guest entries were in non-canonical positions — reordered during full array replacement

## Deviations from Plan

**1. [Rule 1 - Data correction] Pittsburgh actual state differed from research doc**
- **Found during:** Task 1 (Pittsburgh city write)
- **Issue:** Research doc listed Pittsburgh as having "chef, guest, mixologist" — actual file already had venueHost present in the 3-entry array
- **Fix:** Added mixologist, curator, facilitator (the actual missing roles) rather than venueHost, curator, facilitator as the plan suggested
- **Files modified:** lib/city-data.ts
- **Verification:** All 6 roles present in canonical order, TypeScript passes

---

**Total deviations:** 1 auto-corrected (data mismatch between research doc and actual file state — same pattern as Plan 01 Philadelphia deviation)
**Impact on plan:** No impact on output — same 6 roles delivered, different 3 were added. Final state is identical canonical 6-entry array.

## Issues Encountered

None — pure copy-writing execution with single data mismatch corrected inline.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Cities 12-22 complete with 66 new total persona entries (6 per city)
- Phase 13 Plan 03 can proceed with cities 23-32 (Ann Arbor through Meridian batch)
- 10 cities remain: Ann Arbor, Grand Rapids, Memphis, Indianapolis, Buffalo, Birmingham, Greenville, Cleveland, Oklahoma City, Meridian
- All 10 remaining cities have 3 existing entries — each needs 3 new entries (mixologist or venueHost + curator + facilitator based on which roles are missing per city)
- Total persona entries: 163 in file (162 city entries + 1 type definition match) = 22 cities × 6 (132) + 10 cities × 3 (30) = 162 confirmed

---
*Phase: 13-city-persona-copy*
*Completed: 2026-03-13*
