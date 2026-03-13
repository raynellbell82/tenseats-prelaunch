# Phase 13: City Persona Copy - Research

**Researched:** 2026-03-13
**Domain:** Content/copy authoring — TypeScript data file editing, brand compliance, city-specific cultural knowledge
**Confidence:** HIGH

---

## Summary

Phase 13 is a pure copy-writing and data-entry phase. There is no new component work, no new dependencies, and no architecture decisions to make — Phase 12 established all of that. The sole task is expanding `lib/city-data.ts` so every city's `topPersonas` array contains exactly 6 entries covering all 6 roles (chef, mixologist, venueHost, curator, guest, facilitator), with copy that meets Tenseats brand voice standards and references each city's specific food subculture.

The data audit reveals: 31 of 32 cities have 3 personas; Chicago has only 1. Every single city is missing a facilitator entry (32/32). Mixologist is the second most-missing role (25 cities), followed by venueHost (21), curator (19), and guest (1 — Chicago). The total new entries required is 101 persona objects across 32 cities.

The brand voice constraint is strict and documented. The tenseats-copy-writer skill defines forbidden adjectives, structural patterns, word count targets, and a vocabulary that all copy must follow. The description field for each persona card renders at `text-sm leading-relaxed` in ~30-60 words; the cityHeadline renders at `text-lg font-semibold`. Both fields must clear the brand compliance check against forbidden terms (amazing, incredible, unique, best-in-class, world-class, revolutionary) and structural anti-patterns (passive CTAs, adjective stacking, corporate filler).

**Primary recommendation:** Expand topPersonas city by city in a single plan, writing all 101 missing entries in one pass against city-data.ts, using the tenseats-copy-writer brand voice as the compliance standard. No waves, no dependencies — pure file editing.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COPY-01 | Each city page displays all 6 persona cards with city-specific headline and description | Requires adding missing roles to topPersonas array in city-data.ts — 101 new entries across 32 cities |
| COPY-02 | Persona copy references lesser-known food scene specifics locals (not tourists) would recognize | Each city's existing sceneIntro and sceneBlocks contain the subculture references to draw from; copy must go neighborhood-level not generic |
| COPY-03 | All persona copy passes tenseats-copy-writer brand compliance | Forbidden adjectives list + voice pillars documented in .claude/skills/tenseats-copy-writer/references/brand-voice.md |
| DATA-01 | topPersonas array in city-data.ts expanded to 6 entries per city for all 32 cities | 31 cities have 3 entries; Chicago has 1 entry; every city needs facilitator added; total of 101 new persona objects |
</phase_requirements>

---

## Data Audit: Current State

### Persona Counts Per City (Pre-Phase-13)

| City | Current Count | Missing Roles |
|------|--------------|---------------|
| chicago-il | 1 (chef only) | mixologist, venueHost, curator, guest, facilitator |
| austin-tx | 3 (chef, mixologist, guest) | venueHost, curator, facilitator |
| atlanta-ga | 3 (chef, venueHost, guest) | mixologist, curator, facilitator |
| houston-tx | 3 (chef, curator, guest) | mixologist, venueHost, facilitator |
| denver-co | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| philadelphia-pa | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| new-york-ny | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| washington-dc | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| charleston-sc | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| asheville-nc | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| dallas-tx | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| detroit-mi | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| charlotte-nc | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| columbus-oh | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| orlando-fl | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| cincinnati-oh | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| pittsburgh-pa | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| tampa-fl | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| st-petersburg-fl | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| milwaukee-wi | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| phoenix-az | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| scottsdale-az | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| ann-arbor-mi | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| grand-rapids-mi | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| memphis-tn | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| indianapolis-in | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| buffalo-ny | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| birmingham-al | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| greenville-sc | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |
| cleveland-oh | 3 (chef, guest, venueHost) | mixologist, curator, facilitator |
| oklahoma-city-ok | 3 (chef, guest, mixologist) | venueHost, curator, facilitator |
| meridian-ms | 3 (chef, guest, curator) | mixologist, venueHost, facilitator |

**Totals:**
- Cities with <6 personas: 32 of 32
- Total missing entries: 101
- Every city missing: facilitator (32/32)
- Mixologist missing: 25 cities
- venueHost missing: 21 cities
- curator missing: 19 cities
- guest missing: 1 city (Chicago only)

---

## Standard Stack

### Core
| Component | Location | Purpose | Notes |
|-----------|----------|---------|-------|
| city-data.ts | lib/city-data.ts | Single source of truth for all city content | Edit this file only — no other files require changes |
| PersonaCard | components/shared/persona-card.tsx | Renders cityHeadline + cityDescription | headline prop optional (string), description required (string) |
| tenseats-copy-writer skill | .claude/skills/tenseats-copy-writer/ | Brand compliance reference | Read brand-voice.md before generating any copy |

### No New Dependencies
This phase installs nothing and creates no new files. The only change is editing `lib/city-data.ts`.

---

## Architecture Patterns

### Data Structure (Established in Phase 12)

The `topPersonas` array in each city entry accepts objects of this shape:

```typescript
{
  role: "chef" | "mixologist" | "venueHost" | "curator" | "guest" | "facilitator";
  cityHeadline: string;   // 5-10 words — renders as h3 text-lg font-semibold
  cityDescription: string; // 25-50 words — renders as p text-sm leading-relaxed
}
```

The order of entries in the array controls the card render order. Convention from existing cities: chef first, then role variation. Phase 13 should establish a consistent 6-role order across all cities.

### Recommended Role Order (for visual grid consistency)

```
guest → chef → mixologist → curator → venueHost → facilitator
```

Rationale: guest leads (consumer-first positioning), chef second (primary creator), mixologist and curator are discovery/craft roles, venueHost and facilitator are connective roles. This order places the two revenue-generating creators (chef, mixologist) alongside the primary consumer (guest) in the top row of the 3x2 grid.

### The Facilitator Role — Definition Gap

The facilitator role exists in why-personas.tsx with the description "You connect the dots between chefs, spaces, and the right guests — then step back and let the night speak." This is the platform definition. City-specific facilitator copy should describe what a facilitator does in that city's particular context — who they connect, what scene they navigate, what they know that others don't.

Facilitator is not a social media influencer or a press agent. They are a local food scene connector: the person who knows which chef needs a space, which venue is looking for an event, which guest list is worth inviting.

---

## Brand Compliance Rules (from tenseats-copy-writer skill)

### Forbidden Words — Copy must NEVER use
- amazing, incredible, unique, best-in-class, world-class, revolutionary
- "restaurant" in description copy (use: table, seat, experience, event)
- Passive voice in role framing ("Be invited" is wrong, "earn access" is right)

### Required Voice Patterns
- Sensory verbs: whisper, find, taste, discover, earn, belong
- Discovery mechanic language: hidden, unlisted, word of mouth, whisper network, before anyone else
- Speak directly to "you" — the reader is the protagonist
- Fragments are allowed when they add rhythm
- Em-dash and period-as-pause are approved punctuation tools

### Word Count Targets for Persona Card Elements

| Element | Target | Hard Max |
|---------|--------|----------|
| cityHeadline | 5-8 words | 10 words |
| cityDescription | 25-50 words | 60 words |

### Tone Pillars to Apply
- **Evocative:** Create a feeling before explaining a feature
- **Insider:** Speak as if the reader is already in the know
- **Direct:** No corporate filler, no adjective stacking
- **Restrained:** Specificity over superlatives
- **Earned:** Reader feels chosen, not sold to

---

## Copy Quality Standard: COPY-02

COPY-02 requires copy that goes "beyond surface-level food culture." The bar is: locals (not tourists) would recognize these references. Each city's existing `sceneIntro` and `sceneBlocks` in city-data.ts are the research foundation for each city — they already contain the neighborhood names, subculture specifics, and insider references that persona copy must echo.

### What "Surface Level" Looks Like (Fail Examples)
- "Chicago has a great food scene" — generic
- "Find the best restaurants in Atlanta" — tourist-level + uses forbidden "restaurants"
- "New York is a world-class food city" — forbidden "world-class"
- "Houston has diverse cuisine" — too generic, doesn't name anything specific

### What "COPY-02 Level" Looks Like (Pass Examples, from existing copy)
- "Atlanta's borrowed kitchens on Monday nights have incubated some of the South's most-talked-about concepts" — names the specific night, specific format
- "Philadelphia's particular licensing laws mean intimate dinners in rowhomes and borrowed kitchens are the city's most beloved dining format" — names the structural reason that makes Philly distinctive
- "Asheville's craft beverage scene — cider, mead, beer, and emerging wine culture — creates pairing opportunities that no other mid-sized city offers" — names specific beverage types, calls out city size

### How to Mine Each City for COPY-02 References

For each missing persona, the source material is the city's own `sceneBlocks` — each block has a heading, description, and unsplashQuery. The persona copy should reference what those blocks describe. Example: Denver's sceneBlocks reference LoDo warehouse spaces, Colorado craft spirits, farm-to-altitude menus — Denver's mixologist persona should name the high-altitude cocktail opportunity, not generic "great craft cocktails."

---

## Common Pitfalls

### Pitfall 1: Generic Facilitator Copy
**What goes wrong:** The facilitator persona gets vague copy ("connects people in the food scene") that could apply to any city.
**Why it happens:** Facilitator is the newest and least-defined role — no prior persona copy exists as a template.
**How to avoid:** Anchor every facilitator entry to something city-specific: the specific neighborhoods they navigate, the specific format they connect (e.g., "Detroit's Eastern Market pop-ups need the right chef-venue matchmaker"; "Philadelphia's BYOB circuit runs on the right introductions").
**Warning signs:** If the facilitator copy could apply to 3+ other cities, it's too generic.

### Pitfall 2: Inconsistent Role Order
**What goes wrong:** Some cities list guest-chef-mixologist, others list chef-venueHost-guest, creating a visually jarring grid where the card positions shift city to city.
**Why it happens:** Existing 3-entry cities each chose different role orders.
**How to avoid:** Establish one canonical order for all 32 cities when writing Phase 13 entries: guest, chef, mixologist, curator, venueHost, facilitator.
**Warning signs:** If the planner creates a task that just "adds the missing 3" without addressing existing order, this pitfall lands.

### Pitfall 3: Forbidden Adjective Violations
**What goes wrong:** Copy contains "unique," "amazing," or similar forbidden words — especially in the heat of writing 101 entries.
**Why it happens:** These adjectives are natural defaults in food writing.
**How to avoid:** Run a final grep scan on all new copy for the forbidden word list before marking the task done: `amazing|incredible|unique|best-in-class|world-class|revolutionary`.
**Warning signs:** Any superlative that doesn't reference a specific fact is a red flag.

### Pitfall 4: Chicago Has Only 1 Existing Persona
**What goes wrong:** A plan treats Chicago as a "3-entry city" like the others and writes only 3 new entries, leaving it at 4 total.
**Why it happens:** The audit isn't read carefully; 31 cities have 3, but Chicago has 1.
**How to avoid:** Chicago requires 5 new persona entries (mixologist, venueHost, curator, guest, facilitator). The existing chef entry is the only one that should be kept.
**Warning signs:** Any plan that writes the same count for Chicago as all other cities.

### Pitfall 5: Description Overrun
**What goes wrong:** Descriptions exceed 60 words and render poorly at `text-sm` in the card.
**Why it happens:** Food writing naturally runs long; the card doesn't enforce a character limit.
**How to avoid:** Count words during writing. Target 25-50 words; stop at 60.
**Warning signs:** Any description longer than 3 sentences is likely over the limit.

---

## Code Examples

### Correctly Formatted topPersonas Entry
```typescript
// Source: lib/city-data.ts — existing chicago-il entry (Phase 12-delivered pattern)
{
  role: "chef",
  cityHeadline: "Host Chicago's next cult table",
  cityDescription:
    "Chicago's supper club culture rewards chefs who take risks in intimate spaces. Your 13-seat counter dinner could become the city's most whispered-about table in a single season.",
},
```

### Verified Complete 6-Entry Array Format
```typescript
topPersonas: [
  {
    role: "guest",
    cityHeadline: "[5-8 word guest headline]",
    cityDescription: "[25-50 word city-specific guest description]",
  },
  {
    role: "chef",
    cityHeadline: "[existing or revised chef headline]",
    cityDescription: "[existing or revised chef description]",
  },
  {
    role: "mixologist",
    cityHeadline: "[5-8 word mixologist headline]",
    cityDescription: "[25-50 word city-specific mixologist description]",
  },
  {
    role: "curator",
    cityHeadline: "[5-8 word curator headline]",
    cityDescription: "[25-50 word city-specific curator description]",
  },
  {
    role: "venueHost",
    cityHeadline: "[5-8 word venueHost headline]",
    cityDescription: "[25-50 word city-specific venueHost description]",
  },
  {
    role: "facilitator",
    cityHeadline: "[5-8 word facilitator headline]",
    cityDescription: "[25-50 word city-specific facilitator description]",
  },
],
```

### Verification Command (post-write)
```bash
# Check for forbidden adjectives in all new persona copy
grep -n "amazing\|incredible\|unique\|best-in-class\|world-class\|revolutionary" lib/city-data.ts

# TypeScript compile check
npx tsc --noEmit 2>&1 | head -30

# Count total persona entries (should be 192 = 32 cities x 6)
grep -c 'role: "' lib/city-data.ts
```

---

## Planning Strategy Recommendation

### Task Structure

Given 101 entries across 32 cities, the work should be organized into geographic/tier batches to keep each task to a reviewable size. Three waves is natural:

**Wave 1 — Tier 1 Cities (3 cities): Chicago, Austin, Atlanta**
Chicago needs 5 new entries (highest count); Austin and Atlanta each need 3. Total: 11 entries.

**Wave 2 — Tier 2 Cities (9 cities): Houston, Denver, Philadelphia, New York, Washington DC, Charleston, Asheville, Dallas, Detroit**
Each needs 3 new entries. Total: 27 entries.

**Wave 3a — Tier 2 continued (4 cities): Charlotte, Columbus, Orlando, Cincinnati**
Each needs 3 new entries. Total: 12 entries.

**Wave 3b — Tier 3 Cities (16 cities): Pittsburgh, Tampa, St. Petersburg, Milwaukee, Phoenix, Scottsdale, Ann Arbor, Grand Rapids, Memphis, Indianapolis, Buffalo, Birmingham, Greenville, Cleveland, Oklahoma City, Meridian**
Each needs 3 new entries. Total: 51 entries.

The planner may choose to collapse these further since the work is autonomous text editing with no dependencies between cities. A single large task with all 32 cities is also valid given the `mode: yolo` config.

### Order of Existing Entries — Rewrite vs. Append

The existing 3 entries per city do NOT need to be rewritten. However, to achieve a consistent visual order (guest → chef → mixologist → curator → venueHost → facilitator), the array should be reordered when writing new entries. The cleanest approach: replace the entire `topPersonas` array for each city with all 6 entries in canonical order, including the existing 3 (verbatim or lightly revised for voice consistency if the existing copy violates brand standards).

Note: Atlanta's existing array lists roles as [chef, venueHost, guest] — these are out of canonical order. Reordering is worth doing during this phase since the entire array is being rewritten anyway.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | TypeScript compiler (tsc) — no unit test framework present for copy data |
| Config file | tsconfig.json |
| Quick run command | `npx tsc --noEmit 2>&1 \| head -30` |
| Full suite command | `npm run build 2>&1 \| tail -20` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | topPersonas has exactly 6 entries per city | manual count + grep | `grep -c 'role: "' lib/city-data.ts` (expected: 192) | N/A — grep against source |
| DATA-01 | Type valid: role is one of 6 allowed values | type check | `npx tsc --noEmit` | ✅ tsconfig.json exists |
| COPY-01 | All 6 cards render on city pages | smoke | `npm run build` (build success means JSX valid) | ✅ |
| COPY-03 | No forbidden adjectives in copy | lint-style | `grep -n "amazing\|incredible\|unique\|best-in-class\|world-class" lib/city-data.ts` | ✅ source file exists |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` — zero type errors
- **Per wave merge:** `npm run build` — build passes
- **Phase gate:** `grep -c 'role: "' lib/city-data.ts` returns 192 before `/gsd:verify-work`

### Wave 0 Gaps
None — existing test infrastructure (TypeScript + build) covers all automated checks for this phase. No new test files needed; DATA-01 is verified by counting role entries in the source file.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Brand voice compliance | Custom rules engine | Read brand-voice.md, manually apply during writing |
| City cultural research | External API or scraper | Use existing sceneIntro/sceneBlocks already in city-data.ts as the ground truth |
| Copy variation | Template generator | Write each entry distinctly — templates produce the generic copy COPY-02 prohibits |
| Type validation | Runtime schema check | TypeScript compiler catches role type violations at build time |

---

## State of the Art

| Aspect | Current State | Phase 13 Target |
|--------|--------------|-----------------|
| Personas per city | 1-3 entries | 6 entries (all roles) |
| Roles covered | chef, guest, + 1 variable | chef, guest, mixologist, curator, venueHost, facilitator |
| Facilitator presence | 0 cities | 32 cities |
| COPY-02 compliance | Partial (existing 3 entries vary in quality) | Full — all 192 entries must pass |

---

## Open Questions

1. **Role order rewrite vs. append-only**
   - What we know: Appending 3 entries is less risky; rewriting the full array is cleaner for display order
   - What's unclear: Whether the user wants canonical order enforced now or just completion
   - Recommendation: Rewrite the full array for each city — the plan is writing-heavy anyway, and canonical order makes future maintenance easier. Claude can preserve all existing copy verbatim while reordering.

2. **Chicago's chef entry — preserve verbatim or revise**
   - What we know: Chicago has 1 existing chef entry from Phase 12 that was written as a placeholder before the full 6-entry pattern was established
   - What's unclear: The existing chef copy is good quality — "Host Chicago's next cult table" / supper club culture copy — but it predates the full card
   - Recommendation: Keep Chicago's chef entry verbatim. It passes brand compliance and is city-specific.

---

## Sources

### Primary (HIGH confidence)
- `lib/city-data.ts` — direct file inspection, all 32 city entries read, persona counts verified by script
- `components/shared/persona-card.tsx` — component interface confirmed, rendering behavior verified
- `.claude/skills/tenseats-copy-writer/references/brand-voice.md` — brand compliance rules read directly
- `.claude/skills/tenseats-copy-writer/references/copy-patterns.md` — structural patterns read directly
- `.planning/REQUIREMENTS.md` — requirement text read directly
- `.planning/phases/12-persona-component-foundation/12-01-SUMMARY.md` — Phase 12 completion state confirmed

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — project state and scope constraints confirmed

---

## Metadata

**Confidence breakdown:**
- Data audit (current state): HIGH — verified by script against actual file
- Brand compliance rules: HIGH — read directly from skill files
- Copy quality bar: HIGH — COPY-02 defined in requirements, examples extracted from existing high-quality city entries
- Planning strategy (wave structure): MEDIUM — task batching is a planner decision; the entry count is HIGH confidence

**Research date:** 2026-03-13
**Valid until:** Stable — no external dependencies; valid until city-data.ts structure changes
