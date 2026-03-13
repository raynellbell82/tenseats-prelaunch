# Roadmap: Tenseats Pre-Launch Site

## Overview

Build a standalone Next.js + Convex pre-launch site from a copied source repo. The work flows from infrastructure scaffolding through layout, individual content pages, the Stripe-powered launch flow, auth, city pages, and finally deployment readiness with brand compliance validation. Each phase delivers a coherent, independently verifiable slice of the site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scaffold** - Copy source files, init project, connect to shared Convex deployment (completed 2026-03-13)
- [x] **Phase 2: Layout & Navigation** - Root layout, providers, landing header, footer (completed 2026-03-13)
- [x] **Phase 3: Homepage** - Hero, countdown, founding banner, CTAs at / (completed 2026-03-13)
- [x] **Phase 4: Join Page** - 5-section join page with Stripe checkout at /join (completed 2026-03-13)
- [x] **Phase 5: Auth** - OTP signup/login, session persistence at /signup and /login (completed 2026-03-13)
- [x] **Phase 6: Launch Flow** - City search, slot grid, queue, Stripe checkout, success/expired pages (completed 2026-03-13)
- [x] **Phase 7: City Pages** - 32 metro pages with city data, static generation, per-city SEO (completed 2026-03-13)
- [x] **Phase 8: Why Tenseats Page** - Brand story page with personas, economics table at /why-tenseats (completed 2026-03-13)
- [x] **Phase 8.1: Cities Globe** - INSERTED — Interactive 3D globe on homepage with region-tabbed city navigation pills (completed 2026-03-13)
- [x] **Phase 9: SEO, Deployment & Copy QA** - Sitemap, Dockerfile, build health, brand compliance audit (completed 2026-03-13)
- [x] **Phase 10: Wire City Slug to Launch Flow** - Fix initialCitySlug prop so city pages pre-filter launch search (gap closure) (completed 2026-03-13)
- [ ] **Phase 11: Nav & Auth Wiring Fixes** - Fix /cities nav 404, align queue signup with OTP auth (gap closure)

## Phase Details

### Phase 1: Scaffold
**Goal**: A running Next.js dev server connected to the shared Convex deployment, with all source files in place
**Depends on**: Nothing (first phase)
**Requirements**: SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07, SCAF-08, SCAF-09, SCAF-10, SCAF-11, SCAF-12, SCAF-13, SCAF-14
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts on port 3001 without error
  2. Convex _generated/ types exist and reflect the shared schema
  3. All source component, lib, and convex directories are present in the project
  4. `.env.local` contains all required env vars (Convex, Stripe, Better Auth, n8n)
  5. `convex/http.ts` does NOT exist in the project (shared router relied upon)
**Plans**: 3 plans
Plans:
- [ ] 01-01-PLAN.md — Init Next.js project, copy configs, derive package.json, install deps
- [ ] 01-02-PLAN.md — Copy component, lib, and Convex source files
- [ ] 01-03-PLAN.md — Create .env.local, connect Convex, verify dev server

### Phase 2: Layout & Navigation
**Goal**: Every page in the site shares a consistent dark-theme shell with working header navigation and footer
**Depends on**: Phase 1
**Requirements**: LAYO-01, LAYO-02, LAYO-03, LAYO-04, LAYO-05, LAYO-06
**Success Criteria** (what must be TRUE):
  1. Visiting any route shows the LandingHeader with nav links to /join, /why-tenseats, /cities
  2. Mobile hamburger menu opens and closes correctly at 375px viewport
  3. Logo loads from Convex platformSettings (getLogoUrl, getDarkLogoUrl)
  4. Footer renders on all pages
  5. Dark theme is applied by default — no flash of light theme on load
**Plans**: 2 plans
Plans:
- [ ] 02-01-PLAN.md — Create Providers (ThemeProvider + ConvexClientProvider) and root layout with fonts, footer, toaster
- [ ] 02-02-PLAN.md — Create LandingHeader with nav links, mobile hamburger menu, logo, and theme toggle

### Phase 3: Homepage
**Goal**: Visitors landing on / see the Tenseats story, a live countdown, and clear paths to join or learn more
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06
**Success Criteria** (what must be TRUE):
  1. Homepage renders at / with the headline "Discover events worth attending" (locked copy)
  2. Countdown timer ticks live from Convex launchConfig data
  3. Founding membership pill/banner is visible on the page
  4. "Get Started" CTA navigates to /signup
  5. "Learn about our community" link navigates to /why-tenseats
**Plans**: 1 plan
Plans:
- [ ] 03-01-PLAN.md — Copy HeroSection from source, fix /community to /why-tenseats link, wire homepage page.tsx

### Phase 4: Join Page
**Goal**: Visitors at /join can read the Tenseats value proposition and navigate toward founding membership checkout
**Depends on**: Phase 2
**Requirements**: JOIN-01, JOIN-02, JOIN-03, JOIN-04, JOIN-05, JOIN-06
**Success Criteria** (what must be TRUE):
  1. /join renders all 5 sections: hero, food-as-language, free seat, reserve spot, CTA footer
  2. JoinHero displays "Find where locals only whisper." headline (locked copy)
  3. ReserveSpotSection renders tier cards with CTAs that link to /launch
  4. Page is readable and usable at 375px viewport width
**Plans**: 1 plan
Plans:
- [ ] 04-01-PLAN.md — Create /join route page assembling all 5 existing join components with LandingHeader

### Phase 5: Auth
**Goal**: Visitors can create an account or log in via OTP email and stay authenticated across sessions
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. /signup renders a centered OTP email form with LandingHeader
  2. /login renders a centered OTP email form with LandingHeader
  3. Submitting a valid email triggers a Better Auth OTP email
  4. After OTP entry, user is authenticated and redirected
  5. Refreshing the browser preserves the session (user stays logged in)
**Plans**: 2 plans
Plans:
- [x] 05-01-PLAN.md — Copy validation schema, create auth layout with LandingHeader, create signup/login/verify-email pages, patch redirects to /
- [ ] 05-02-PLAN.md — Replace password-based login form with OTP-first email flow (gap closure for AUTH-02)

### Phase 6: Launch Flow
**Goal**: An authenticated visitor can search for their city, browse founding slots, join the queue or complete Stripe checkout, and land on a confirmation page
**Depends on**: Phase 5
**Requirements**: LNCH-01, LNCH-02, LNCH-03, LNCH-04, LNCH-05, LNCH-06, LNCH-07, LNCH-08
**Success Criteria** (what must be TRUE):
  1. /launch shows a city search input that filters available cities
  2. Selecting a city displays the slot grid with available founding spots
  3. Submitting the queue form saves data to Convex and shows queue position at /launch/queue
  4. Clicking checkout creates a Stripe session and redirects to Stripe
  5. After successful payment, /launch/success renders confirmation
  6. Visiting /launch/expired with an expired session renders the expired page
**Plans**: 2 plans
Plans:
- [ ] 06-01-PLAN.md — Create /launch page with city search, slot grid, queue signup and /launch/queue page with queue status
- [ ] 06-02-PLAN.md — Create /launch/checkout with tier selector and Stripe redirect, /launch/success confirmation, /launch/expired with rejoin

### Phase 7: City Pages
**Goal**: All 32 metro landing pages exist, are statically generated, contain city-specific copy and personas, and each drives visitors toward /launch
**Depends on**: Phase 2
**Requirements**: CITY-01, CITY-02, CITY-03, CITY-04, CITY-05, CITY-06, CITY-07, CITY-08, CITY-09, CITY-10
**Success Criteria** (what must be TRUE):
  1. Visiting /cities/[any-of-32-slugs] renders that city's page without a 404
  2. Each city page has a unique hero headline and subheadline under 25 words
  3. "Reserve My Seat" CTA links to /launch?city=[slug]
  4. Three food scene blocks display for each city
  5. Three persona role cards display for each city, each linking to /join
  6. Per-city meta title and description are present in the page head
**Plans**: 2 plans
Plans:
- [ ] 07-01-PLAN.md — Create lib/city-data.ts with CityData type, METROS_DATA re-export, and all 32 city entries
- [ ] 07-02-PLAN.md — Create 4 city components (hero, food scene, personas, reserve) and city page route with static generation

### Phase 8: Why Tenseats Page
**Goal**: Visitors at /why-tenseats understand what Tenseats is, who it's for, and why the economics are different — and are moved to act
**Depends on**: Phase 2
**Requirements**: WHY-01, WHY-02, WHY-03, WHY-04, WHY-05, WHY-06, WHY-07, WHY-08
**Success Criteria** (what must be TRUE):
  1. /why-tenseats renders all 5 sections: hero, problem/solution, personas, economics, CTA
  2. WhyHero displays "Built different. On purpose." headline (locked copy)
  3. WhyProblem shows two-column layout with correct locked headlines
  4. WhyPersonas shows 6 role cards (Guest, Chef, Mixologist, Curator, Venue Host, Facilitator)
  5. WhyEconomics comparison table renders with $1.99 row and 4 competitor columns
  6. Comparison table is usable and not overflowing at 375px viewport
**Plans**: 2 plans
Plans:
- [ ] 08-01-PLAN.md — Create WhyHero, WhyProblem, and WhyPersonas components
- [ ] 08-02-PLAN.md — Create WhyEconomics, WhyCta, and /why-tenseats page route

### Phase 8.1: Cities Globe (INSERTED)
**Goal**: Visitors on the homepage can see all 32 Tenseats cities on an interactive 3D globe and navigate to any city page via region-filtered clickable pills
**Depends on**: Phase 7, Phase 8
**Requirements**: GLOB-01, GLOB-02, GLOB-03, GLOB-04, GLOB-05, GLOB-06, GLOB-07
**Success Criteria** (what must be TRUE):
  1. Homepage renders an interactive 3D globe (cobe) below the hero with 32 orange city markers
  2. Region tabs (South, Midwest, Northeast, West) filter the city pills below the globe
  3. Hovering a pill rotates the globe to that city; clicking navigates to /cities/[slug]
  4. Globe auto-rotates when idle and starts focused on the continental US
  5. If WebGL fails, the section degrades to tabs + pills without the globe
  6. Section is responsive: 500px desktop, 400px tablet, 300px mobile globe canvas
**Plans**: 1 plan
Plans:
- [ ] 08.1-01-PLAN.md — Install cobe, create city regions data, build CitiesGlobe component, wire into homepage

### Phase 9: SEO, Deployment & Copy QA
**Goal**: The site builds cleanly, is Coolify-deployable, ranks correctly in search, and every consumer-facing string passes brand compliance
**Depends on**: Phase 7, Phase 8
**Requirements**: DEPL-01, DEPL-02, DEPL-03, DEPL-04, DEPL-05, DEPL-06, DEPL-07, COPY-01, COPY-02, COPY-03, COPY-04, COPY-05, COPY-06
**Success Criteria** (what must be TRUE):
  1. /sitemap.xml returns 36 URLs (homepage + join + why-tenseats + launch + 32 city pages)
  2. /robots.txt allows all crawlers and references the sitemap
  3. `docker build` completes with standalone Next.js output
  4. `npm run build` exits with zero TypeScript errors and zero console errors in the browser
  5. No page at 375px viewport has horizontal overflow
  6. Search through all rendered copy finds zero instances of forbidden adjectives, "restaurant" in heroes, or lowercase "insider"
**Plans**: 3 plans
Plans:
- [ ] 09-01-PLAN.md — Create sitemap.ts, robots.ts, health check endpoint, Dockerfile and .dockerignore
- [ ] 09-02-PLAN.md — Audit and fix all consumer-facing copy for brand compliance (COPY-01 through COPY-06)
- [ ] 09-03-PLAN.md — Run production build, fix errors, verify console and mobile viewport (human checkpoint)

### Phase 10: Wire City Slug to Launch Flow
**Goal**: When a visitor arrives at /launch?city=[slug] from a city page, the city search is pre-filled and the slot grid is immediately visible — no manual re-search required
**Depends on**: Phase 6, Phase 7
**Requirements**: LNCH-01, CITY-06
**Gap Closure:** Closes gaps from v1.0 audit (initialCitySlug prop ignored)
**Success Criteria** (what must be TRUE):
  1. Navigating from /cities/chicago-il "Reserve My Seat" to /launch?city=chicago-il pre-selects Chicago in the city search
  2. The slot grid for the pre-selected city is visible on load without user interaction
  3. Navigating to /launch without a city query param still shows the empty search (no regression)
Plans:
- [ ] 10-01-PLAN.md — Resolve initialCitySlug to metro ID and wire to LaunchCitySearch default value

### Phase 11: Nav & Auth Wiring Fixes
**Goal**: Navigation links resolve correctly and queue signup uses the same OTP auth as the rest of the site
**Depends on**: Phase 2, Phase 6
**Requirements**: LAYO-03, LAYO-04
**Gap Closure:** Closes gaps from v1.0 audit (nav 404, queue auth inconsistency)
**Success Criteria** (what must be TRUE):
  1. Clicking "Cities" in the header nav scrolls to the cities globe section (no 404)
  2. Mobile hamburger "Cities" link behaves the same
  3. Queue signup form uses OTP email flow, not password-based signUp
**Plans**: 1 plan
Plans:
- [ ] 11-01-PLAN.md — Fix /cities nav link target, align queue signup form with OTP auth

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 8.1 -> 9 -> 10 -> 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold | 3/3 | Complete   | 2026-03-13 |
| 2. Layout & Navigation | 2/2 | Complete   | 2026-03-13 |
| 3. Homepage | 1/1 | Complete   | 2026-03-13 |
| 4. Join Page | 2/2 | Complete   | 2026-03-13 |
| 5. Auth | 2/2 | Complete   | 2026-03-13 |
| 6. Launch Flow | 2/2 | Complete   | 2026-03-13 |
| 7. City Pages | 2/2 | Complete   | 2026-03-13 |
| 8. Why Tenseats Page | 2/2 | Complete   | 2026-03-13 |
| 8.1. Cities Globe | 0/1 | Planned    |  |
| 9. SEO, Deployment & Copy QA | 3/3 | Complete   | 2026-03-13 |
| 10. Wire City Slug to Launch Flow | 1/1 | Complete    | 2026-03-13 |
| 11. Nav & Auth Wiring Fixes | 0/1 | Planned    |  |
