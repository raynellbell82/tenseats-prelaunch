# Roadmap: Tenseats Pre-Launch Site

## Milestones

- ✅ **v1.0 Pre-Launch Site** — Phases 1-11 (shipped 2026-03-13)
- ✅ **v1.1 City Persona Copy** — Phases 12-13 (shipped 2026-03-13)
- 🚧 **v1.2 Post-Signup Experience** — Phases 20-25 (in progress)

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

<details>
<summary>✅ v1.1 City Persona Copy (Phases 12-13) — SHIPPED 2026-03-13</summary>

- [x] Phase 12: Persona Component Foundation (1/1 plans) — completed 2026-03-13
- [x] Phase 13: City Persona Copy (3/3 plans) — completed 2026-03-13

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

### 🚧 v1.2 Post-Signup Experience (In Progress)

**Milestone Goal:** Create distinctive post-signup pages — verification prompt, guest welcome, and vendor onboarding success with Stripe connect guidance — plus onboarding step persistence backed by the shared Convex schema.

- [x] **Phase 20: Schema Coordination** — Generate the main-app prompt and verify schema deployment before persistence work begins (completed 2026-03-14)
- [ ] **Phase 21: Social Icons** — Generate custom Instagram and Pinterest SVG icons for use across success pages
- [ ] **Phase 22: Verification Page** — Build the shared "almost there" page with branded email-check messaging
- [ ] **Phase 23: Guest Success Page** — Build guest success page with community welcome, address book reminder, and social links
- [ ] **Phase 24: Vendor Success Page** — Build vendor success page with Stripe connect step, Zoho One info, and social links
- [ ] **Phase 25: Onboarding Persistence** — Wire completed steps to Convex per-user storage so progress survives sessions

## Phase Details

### Phase 20: Schema Coordination
**Goal**: The main app has a complete prompt documenting the post-signup flow, and the shared Convex schema includes the onboarding progress table before any persistence code is written
**Depends on**: Nothing (first phase of milestone)
**Requirements**: SCHEMA-01, SCHEMA-02
**Success Criteria** (what must be TRUE):
  1. A prompt document exists that covers every aspect of the post-signup experience for the main app developer to implement (pages, persistence logic, Stripe step, Zoho messaging, social links)
  2. The shared Convex backend has the onboarding progress schema table deployed and queryable before Phase 25 begins
  3. No onboarding persistence code is written until SCHEMA-02 is confirmed (schema deployed)
**Plans:** 2/2 plans complete
Plans:
- [ ] 20-01-PLAN.md — Generate comprehensive Claude Code prompt for main app post-signup experience
- [ ] 20-02-PLAN.md — Verify schema deployment and copy updated schema to prelaunch repo

### Phase 21: Social Icons
**Goal**: Custom monoline SVG icons for Instagram and Pinterest are available as importable components, matching the brand's existing icon aesthetic
**Depends on**: Nothing (independent)
**Requirements**: SOCIAL-01, SOCIAL-02
**Success Criteria** (what must be TRUE):
  1. An Instagram icon component renders correctly at standard icon sizes in both light and dark themes via `currentColor`
  2. A Pinterest icon component renders correctly at standard icon sizes in both light and dark themes via `currentColor`
  3. Both icons follow the same monoline stroke style as existing persona icons
**Plans**: TBD

### Phase 22: Verification Page
**Goal**: Users who complete queue signup land on a warm, branded "almost there" page that tells them to check their email — the same page works for both guest and vendor signups
**Depends on**: Phase 21 (social icons may appear on this page or related pages)
**Requirements**: VERIFY-01, VERIFY-02, DESIGN-01
**Success Criteria** (what must be TRUE):
  1. After queue signup, a guest user is redirected to the "almost there" page and sees a branded message telling them to check their email for a verification code
  2. After queue signup, a vendor user hits the same "almost there" page — the page is not role-specific
  3. The page design is visually distinctive and warm — not a generic form confirmation screen
  4. All three post-signup pages (this page, guest success, vendor success) share a coherent design language that feels like a purposeful product moment
**Plans**: TBD

### Phase 23: Guest Success Page
**Goal**: Verified guest users land on a success page that makes them feel welcomed into the Tenseats community, reminds them to safelist the support email, and points them to social channels
**Depends on**: Phase 22 (design language established)
**Requirements**: GSUCCESS-01, GSUCCESS-02, GSUCCESS-03
**Success Criteria** (what must be TRUE):
  1. After OTP verification, a guest user sees a dedicated success page with inspirational welcome-to-community messaging
  2. The page prominently displays a reminder to add `supportteams@tenseats.io` to their address book
  3. The page shows Instagram and Pinterest social links using the custom icons from Phase 21
  4. The page design matches the quality and brand coherence established in Phase 22
**Plans**: TBD

### Phase 24: Vendor Success Page
**Goal**: Verified vendor users (Chef, Mixologist, Venue Host, Creator) land on a success page that welcomes them, offers an optional Stripe connect step, explains Zoho One back-of-house tools, and includes social links
**Depends on**: Phase 23 (design language, social icon usage pattern)
**Requirements**: VSUCCESS-01, VSUCCESS-02, VSUCCESS-03, VSUCCESS-04
**Success Criteria** (what must be TRUE):
  1. After OTP verification, a vendor-role user sees a dedicated success page with welcome messaging appropriate to their role
  2. The page offers an optional "Connect your Stripe account" step with clear messaging that this can be done now or at launch
  3. The page explains Zoho One back-of-house setup with the tagline "one fee for 50+ best-in-class tools" and a working link to `https://go.zoho.com/Slvq`
  4. The page displays Instagram and Pinterest social links matching the guest success page layout
**Plans**: TBD

### Phase 25: Onboarding Persistence
**Goal**: Completed onboarding steps survive sessions — users who return after logging out see their progress and are not prompted to repeat steps they have already completed
**Depends on**: Phase 20 (schema deployed), Phase 24 (success pages exist with steps to persist)
**Requirements**: ONBOARD-01, ONBOARD-02
**Success Criteria** (what must be TRUE):
  1. When a vendor user completes the Stripe connect step, that completion is stored per-user in the Convex backend
  2. When a vendor user logs back in, the vendor success page shows which steps are already complete and does not re-prompt them
  3. A user who has not completed any steps sees the full onboarding flow unchanged
**Plans**: TBD

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
| 12. Persona Component Foundation | v1.1 | 1/1 | Complete | 2026-03-13 |
| 13. City Persona Copy | v1.1 | 3/3 | Complete | 2026-03-13 |
| 20. Schema Coordination | 2/2 | Complete    | 2026-03-14 | - |
| 21. Social Icons | v1.2 | 0/? | Not started | - |
| 22. Verification Page | v1.2 | 0/? | Not started | - |
| 23. Guest Success Page | v1.2 | 0/? | Not started | - |
| 24. Vendor Success Page | v1.2 | 0/? | Not started | - |
| 25. Onboarding Persistence | v1.2 | 0/? | Not started | - |
