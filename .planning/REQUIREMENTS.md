# Requirements: Tenseats Pre-Launch Site

**Defined:** 2026-03-12
**Core Value:** Convert visitors into Early Bird or Founding members while telling the Tenseats story across 32 city pages — on a shared backend so accounts carry over to the full marketplace.

## v1 Requirements

### Scaffold & Infrastructure

- [x] **SCAF-01**: Clone source repo to temp directory and copy all required component, convex, and lib files
- [x] **SCAF-02**: Initialize Next.js 16.1.3 project with correct flags (no src-dir, skip-install, disable-git, use-npm)
- [x] **SCAF-03**: Delete create-next-app boilerplate before copying source files
- [x] **SCAF-04**: Copy config files from source (tsconfig.json, postcss.config.mjs, components.json, globals.css)
- [x] **SCAF-05**: Create standalone next.config.ts with image domains for api.tenseats.io and unsplash
- [x] **SCAF-06**: Copy component directories (ui, launch, join, auth, shared/footer) from source
- [x] **SCAF-07**: Copy lib files (auth-client.ts, convex.tsx, utils.ts, auth-server.ts) from source
- [x] **SCAF-08**: Copy Convex files — full schema.ts, auth files, launch/, metros.ts, platformSettings.ts, emailTemplates.ts, webhookSigning.ts, convex.config.ts
- [x] **SCAF-09**: Copy convex.json from source (functions config with better-auth external package)
- [x] **SCAF-10**: Do NOT copy convex/http.ts — rely on existing shared HTTP router
- [x] **SCAF-11**: Derive package.json from source with only name and scripts.dev changed, run npm install
- [x] **SCAF-12**: Create .env.local with all required env vars (Convex, Stripe, Better Auth, n8n)
- [x] **SCAF-13**: Connect to existing Convex deployment via CONVEX_DEPLOYMENT env var, generate _generated/ types
- [x] **SCAF-14**: Create auth API route at app/api/auth/[...all]/route.ts from source

### Layout & Navigation

- [x] **LAYO-01**: Root layout with Geist fonts, ThemeProvider (dark default), ConvexClientProvider, Footer, Toaster
- [x] **LAYO-02**: Providers component with ThemeProvider and ConvexClientProvider — no SetupProvider
- [x] **LAYO-03**: Landing header with nav links to /join, /why-tenseats, /cities + mobile hamburger menu
- [x] **LAYO-04**: Logo loaded from Convex platformSettings (getLogoUrl, getDarkLogoUrl)
- [x] **LAYO-05**: Dark/light theme toggle in header
- [x] **LAYO-06**: Footer renders correctly (copied from main app)

### Homepage

- [x] **HOME-01**: Homepage at / with LandingHeader and HeroSection
- [x] **HOME-02**: Live countdown from Convex launchConfig
- [x] **HOME-03**: Founding membership pill/banner visible
- [x] **HOME-04**: "Discover events worth attending" headline (locked copy)
- [x] **HOME-05**: "Get Started" CTA links to /signup
- [x] **HOME-06**: "Learn about our community" link points to /why-tenseats

### Join Page

- [x] **JOIN-01**: Join page at /join with LandingHeader
- [x] **JOIN-02**: JoinHero with "Find where locals only whisper." headline (locked copy)
- [x] **JOIN-03**: FoodAsLanguageSection renders
- [x] **JOIN-04**: FreeSeatSection renders
- [x] **JOIN-05**: ReserveSpotSection renders tier cards with CTAs linking to /launch (Stripe checkout integration delivered by Phase 6 LNCH-04)
- [x] **JOIN-06**: JoinCtaFooter renders

### Launch Flow

- [x] **LNCH-01**: Launch page at /launch with city search
- [x] **LNCH-02**: Slot grid shows available slots for selected city
- [x] **LNCH-03**: Queue signup form submits to Convex
- [x] **LNCH-04**: Stripe checkout creates session and redirects
- [x] **LNCH-05**: Success page at /launch/success after payment
- [x] **LNCH-06**: Expired page at /launch/expired for expired sessions
- [x] **LNCH-07**: Queue page at /launch/queue shows position
- [x] **LNCH-08**: Checkout page at /launch/checkout

### Auth

- [x] **AUTH-01**: Signup page at /signup with OTP email flow
- [x] **AUTH-02**: Login page at /login with OTP email flow
- [x] **AUTH-03**: Email verification via Better Auth OTP
- [x] **AUTH-04**: Session persists across browser refresh
- [x] **AUTH-05**: Auth layout with centered form, LandingHeader

### City Pages

- [x] **CITY-01**: Dynamic city pages at /cities/[slug] for all 32 metros
- [x] **CITY-02**: generateStaticParams() produces all 32 paths from METROS_DATA
- [x] **CITY-03**: CityHero with city-specific headline, subhead, and "Reserve My Seat" CTA linking to /launch?city=[slug]
- [x] **CITY-04**: CityFoodScene with 3 scene blocks per city (heading, description)
- [x] **CITY-05**: CityPersonas with 3 role cards per city, each linking to /join
- [x] **CITY-06**: CityReserve wrapping ReserveSpotSection pre-filtered to current city
- [x] **CITY-07**: Per-city SEO metadata (title, description)
- [x] **CITY-08**: lib/city-data.ts with complete CityData type and all 32 city entries (Tier 1, 2, 3)
- [x] **CITY-09**: City data includes heroHeadline, heroSubhead, metaTagline, metaDescription, sceneIntro, sceneBlocks, topPersonas, tier
- [x] **CITY-10**: All heroSubhead copy under 25-word limit

### Why Tenseats Page

- [x] **WHY-01**: Why Tenseats page at /why-tenseats with LandingHeader
- [x] **WHY-02**: WhyHero with "Built different. On purpose." headline (locked copy)
- [x] **WHY-03**: WhyProblem two-column layout — "Sponsored. Optimized. Irrelevant." vs "The whisper, surfaced."
- [x] **WHY-04**: WhyPersonas with 6 role cards (Guest, Chef, Mixologist, Curator, Venue Host, Facilitator)
- [x] **WHY-05**: WhyEconomics with $1.99 comparison table (Tenseats vs Eventbrite vs Tock vs Luma)
- [x] **WHY-06**: WhyCta with "The Insiders are already inside." headline, countdown widget, "Become an Insider" CTA
- [x] **WHY-07**: Comparison table mobile-responsive
- [x] **WHY-08**: All section copy matches accepted copy decisions (locked)

### Cities Globe (INSERTED)

- [x] **GLOB-01**: Interactive 3D globe (cobe) on homepage showing 32 city markers with orange glowing dots
- [x] **GLOB-02**: Region-tabbed pill system (South, Midwest, Northeast, West) filtering city pills
- [x] **GLOB-03**: Pill hover rotates globe to city location with tooltip; pill click navigates to /cities/[slug]
- [x] **GLOB-04**: Globe auto-rotates when idle, starts focused on continental US
- [x] **GLOB-05**: WebGL fallback — tabs + pills remain functional if globe fails to render
- [x] **GLOB-06**: Accessible: ARIA roles on tabs, keyboard navigable pills, prefers-reduced-motion support
- [x] **GLOB-07**: Responsive: 500px desktop, 400px tablet, 300px mobile canvas sizing

### SEO & Deployment

- [x] **DEPL-01**: Sitemap at /sitemap.xml with all 34 URLs (homepage, join, why, launch + 32 cities)
- [x] **DEPL-02**: Robots.txt allowing all crawlers, pointing to sitemap
- [x] **DEPL-03**: Dockerfile for Coolify with multi-stage build and standalone output
- [x] **DEPL-04**: Health check endpoint at /api/health returning { ok: true }
- [x] **DEPL-05**: npm run build exits with zero TypeScript errors
- [x] **DEPL-06**: No console errors in browser dev tools
- [x] **DEPL-07**: Mobile viewport (375px) — no horizontal overflow

### Brand & Copy Compliance

- [x] **COPY-01**: "Insider" always capital I in all components
- [x] **COPY-02**: "restaurant" never appears in hero headlines or subheadlines
- [x] **COPY-03**: Competitors (Yelp, Eventbrite, OpenTable) not named in hero copy
- [x] **COPY-04**: All subheadlines under 25-word hard max
- [x] **COPY-05**: Forbidden adjectives (amazing, incredible, unique, best-in-class, world-class, revolutionary) not used
- [x] **COPY-06**: Discovery mechanic language used (whisper, hidden, local, access, invitation, unlisted, off-menu)

## v2 Requirements

### Enhanced City Pages

- **CITY-V2-01**: Unsplash images per city scene block (currently text-only)
- **CITY-V2-02**: Live slot counter badge on city hero ("X of 10 founding spots remaining")

### Analytics

- **ANAL-01**: Conversion tracking per city page
- **ANAL-02**: Funnel analytics (homepage → join → launch → checkout → success)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Main app modifications | User directive — source repo is read-only |
| Separate Convex deployment | Shares existing deployment at api.tenseats.io |
| HTTP router (http.ts) | Relies on existing shared router |
| SetupProvider / admin wizard | Not relevant to pre-launch site |
| Real-time chat | Not a pre-launch feature |
| OAuth login (Google, GitHub) | OTP email auth sufficient for pre-launch |
| Mobile native app | Web-only pre-launch site |
| Notifications system | Deferred to full marketplace |
| Content moderation | Deferred to full marketplace |
| localhost:3001 auth fix | Would require main app modification |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01 | Phase 1 | Complete |
| SCAF-02 | Phase 1 | Complete |
| SCAF-03 | Phase 1 | Complete |
| SCAF-04 | Phase 1 | Complete |
| SCAF-05 | Phase 1 | Complete |
| SCAF-06 | Phase 1 | Complete |
| SCAF-07 | Phase 1 | Complete |
| SCAF-08 | Phase 1 | Complete |
| SCAF-09 | Phase 1 | Complete |
| SCAF-10 | Phase 1 | Complete |
| SCAF-11 | Phase 1 | Complete |
| SCAF-12 | Phase 1 | Complete |
| SCAF-13 | Phase 1 | Complete |
| SCAF-14 | Phase 1 | Complete |
| LAYO-01 | Phase 2 | Complete |
| LAYO-02 | Phase 2 | Complete |
| LAYO-03 | Phase 11 | Complete |
| LAYO-04 | Phase 11 | Complete |
| LAYO-05 | Phase 2 | Complete |
| LAYO-06 | Phase 2 | Complete |
| HOME-01 | Phase 3 | Complete |
| HOME-02 | Phase 3 | Complete |
| HOME-03 | Phase 3 | Complete |
| HOME-04 | Phase 3 | Complete |
| HOME-05 | Phase 3 | Complete |
| HOME-06 | Phase 3 | Complete |
| JOIN-01 | Phase 4 | Complete |
| JOIN-02 | Phase 4 | Complete |
| JOIN-03 | Phase 4 | Complete |
| JOIN-04 | Phase 4 | Complete |
| JOIN-05 | Phase 4 | Complete |
| JOIN-06 | Phase 4 | Complete |
| AUTH-01 | Phase 5 | Complete |
| AUTH-02 | Phase 5 | Complete |
| AUTH-03 | Phase 5 | Complete |
| AUTH-04 | Phase 5 | Complete |
| AUTH-05 | Phase 5 | Complete |
| LNCH-01 | Phase 10 | Complete |
| LNCH-02 | Phase 6 | Complete |
| LNCH-03 | Phase 6 | Complete |
| LNCH-04 | Phase 6 | Complete |
| LNCH-05 | Phase 6 | Complete |
| LNCH-06 | Phase 6 | Complete |
| LNCH-07 | Phase 6 | Complete |
| LNCH-08 | Phase 6 | Complete |
| CITY-01 | Phase 7 | Complete |
| CITY-02 | Phase 7 | Complete |
| CITY-03 | Phase 7 | Complete |
| CITY-04 | Phase 7 | Complete |
| CITY-05 | Phase 7 | Complete |
| CITY-06 | Phase 10 | Complete |
| CITY-07 | Phase 7 | Complete |
| CITY-08 | Phase 7 | Complete |
| CITY-09 | Phase 7 | Complete |
| CITY-10 | Phase 7 | Complete |
| WHY-01 | Phase 8 | Complete |
| WHY-02 | Phase 8 | Complete |
| WHY-03 | Phase 8 | Complete |
| WHY-04 | Phase 8 | Complete |
| WHY-05 | Phase 8 | Complete |
| WHY-06 | Phase 8 | Complete |
| WHY-07 | Phase 8 | Complete |
| WHY-08 | Phase 8 | Complete |
| GLOB-01 | Phase 8.1 | Complete |
| GLOB-02 | Phase 8.1 | Complete |
| GLOB-03 | Phase 8.1 | Complete |
| GLOB-04 | Phase 8.1 | Complete |
| GLOB-05 | Phase 8.1 | Complete |
| GLOB-06 | Phase 8.1 | Complete |
| GLOB-07 | Phase 8.1 | Complete |
| DEPL-01 | Phase 9 | Complete |
| DEPL-02 | Phase 9 | Complete |
| DEPL-03 | Phase 9 | Complete |
| DEPL-04 | Phase 9 | Complete |
| DEPL-05 | Phase 9 | Complete |
| DEPL-06 | Phase 9 | Complete |
| DEPL-07 | Phase 9 | Complete |
| COPY-01 | Phase 9 | Complete |
| COPY-02 | Phase 9 | Complete |
| COPY-03 | Phase 9 | Complete |
| COPY-04 | Phase 9 | Complete |
| COPY-05 | Phase 9 | Complete |
| COPY-06 | Phase 9 | Complete |

**Coverage:**
- v1 requirements: 83 total
- Mapped to phases: 83
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after roadmap creation (phase assignments finalized, COPY folded into Phase 9 with DEPL)*
