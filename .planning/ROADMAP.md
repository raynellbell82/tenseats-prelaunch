# Roadmap: Tenseats Pre-Launch Site

## Milestones

- ✅ **v1.0 Pre-Launch Site** — Phases 1-11 (shipped 2026-03-13)
- 🚧 **v1.1 City Persona Copy** — Phases 12-13 (in progress)

## Phases

<details>
<summary>✅ v1.0 Pre-Launch Site (Phases 1-11) — SHIPPED 2026-03-13</summary>

- [x] Phase 1: Scaffold (3/3 plans) — completed 2026-03-13
- [x] Phase 2: Layout & Navigation (2/2 plans) — completed 2026-03-13
- [x] Phase 3: Homepage (1/1 plans) — completed 2026-03-13
- [x] Phase 4: Join Page (2/2 plans) — completed 2026-03-13
- [x] Phase 5: Auth (2/2 plans) — completed 2026-03-13
- [x] Phase 6: Launch Flow (2/2 plans) — completed 2026-03-13
- [x] Phase 7: City Pages (2/2 plans) — completed 2026-03-13
- [x] Phase 8: Why Tenseats Page (2/2 plans) — completed 2026-03-13
- [x] Phase 8.1: Cities Globe (1/1 plans) — completed 2026-03-13
- [x] Phase 9: SEO, Deployment & Copy QA (3/3 plans) — completed 2026-03-13
- [x] Phase 10: Wire City Slug to Launch Flow (1/1 plans) — completed 2026-03-13
- [x] Phase 11: Nav & Auth Wiring Fixes (1/1 plans) — completed 2026-03-13

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 City Persona Copy (In Progress)

**Milestone Goal:** Expand every city page to show all 6 persona cards with culturally-specific copy reflecting each city's unique food, drink, and hospitality scene.

- [x] **Phase 12: Persona Component Foundation** - Update types, component, and icon maps to support all 6 personas including Facilitator (completed 2026-03-13)
- [ ] **Phase 13: City Persona Copy** - Research and write city-specific persona copy for all 32 cities × 6 personas

## Phase Details

### Phase 12: Persona Component Foundation
**Goal**: The persona grid component fully supports 6 roles with a responsive layout and Facilitator rendered correctly alongside the existing 5 roles
**Depends on**: Phase 11 (v1.0 complete)
**Requirements**: COMP-01, COMP-02, COMP-03, DATA-02
**Success Criteria** (what must be TRUE):
  1. Any city page displays 6 persona cards in a 3×2 desktop / 2×3 tablet / 1×6 mobile grid without overflow or layout breaks
  2. The Facilitator card appears with a distinct icon and correctly labeled role title alongside Guest, Chef, Mixologist, Curator, and Venue Host
  3. Card design matches the reference: icon at top, role title, description — clean dark card with no extraneous UI
  4. The CityData TypeScript type accepts "facilitator" in the role union without type errors
**Plans:** 1/1 plans complete
Plans:
- [ ] 12-01-PLAN.md — Update types, create custom SVG icons, extract shared PersonaCard, rewire both persona sections

### Phase 13: City Persona Copy
**Goal**: All 32 city pages display complete, culturally-specific persona copy for all 6 roles — copy that locals would recognize, not tourist-level generics
**Depends on**: Phase 12
**Requirements**: COPY-01, COPY-02, COPY-03, DATA-01
**Success Criteria** (what must be TRUE):
  1. Every city page shows 6 populated persona cards — no placeholder text, no missing roles
  2. Each city's persona descriptions reference that city's specific food/drink subculture (local neighborhoods, underground scenes, regional ingredients, or small operators) rather than generic claims any city could make
  3. All 192 persona entries (32 cities × 6 roles) pass tenseats-copy-writer brand compliance — no forbidden adjectives, no claims that contradict brand voice
  4. The topPersonas array in city-data.ts contains exactly 6 entries per city across all 32 metros
**Plans:** 1/3 plans executed
Plans:
- [ ] 13-01-PLAN.md — Write persona copy for cities 1-11 (Chicago through Dallas)
- [ ] 13-02-PLAN.md — Write persona copy for cities 12-22 (Detroit through Scottsdale)
- [ ] 13-03-PLAN.md — Write persona copy for cities 23-32 (Ann Arbor through Meridian) + full validation

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffold | v1.0 | 3/3 | Complete | 2026-03-13 |
| 2. Layout & Navigation | v1.0 | 2/2 | Complete | 2026-03-13 |
| 3. Homepage | v1.0 | 1/1 | Complete | 2026-03-13 |
| 4. Join Page | v1.0 | 2/2 | Complete | 2026-03-13 |
| 5. Auth | v1.0 | 2/2 | Complete | 2026-03-13 |
| 6. Launch Flow | v1.0 | 2/2 | Complete | 2026-03-13 |
| 7. City Pages | v1.0 | 2/2 | Complete | 2026-03-13 |
| 8. Why Tenseats Page | v1.0 | 2/2 | Complete | 2026-03-13 |
| 8.1. Cities Globe | v1.0 | 1/1 | Complete | 2026-03-13 |
| 9. SEO, Deployment & Copy QA | v1.0 | 3/3 | Complete | 2026-03-13 |
| 10. Wire City Slug to Launch Flow | v1.0 | 1/1 | Complete | 2026-03-13 |
| 11. Nav & Auth Wiring Fixes | v1.0 | 1/1 | Complete | 2026-03-13 |
| 12. Persona Component Foundation | 1/1 | Complete    | 2026-03-13 | - |
| 13. City Persona Copy | 1/3 | In Progress|  | - |
