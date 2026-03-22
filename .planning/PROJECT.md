# Tenseats Pre-Launch Site

## What This Is

A standalone Next.js + Convex pre-launch website for Tenseats — a food-focused social marketplace launching in 32 US cities. Lives at `tenseats.io` and serves as the public face until the full marketplace app replaces it via a Coolify deployment swap. Connects to the same Convex deployment (`api.tenseats.io`) as the main app, sharing users, metros, launch slots, and pre-registration tables. Includes a complete post-signup experience: branded verification page, role-based success pages (guest + vendor), Stripe Connect onboarding, and social links.

## Core Value

Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city-specific landing pages — all on a shared backend so accounts carry over seamlessly when the full marketplace launches.

## Requirements

### Validated

- ✓ Homepage with live countdown, founding membership banner, hero CTA — v1.0
- ✓ Join page (`/join`) with 5 sections: hero, food-as-language, free seat, reserve spot, CTA footer — v1.0
- ✓ Why Tenseats page (`/why-tenseats`) with 5 sections: hero, problem/solution, personas, economics comparison, CTA — v1.0
- ✓ Dynamic city pages (`/cities/[slug]`) for all 32 US metros with city-specific copy — v1.0
- ✓ Launch flow (`/launch`) with city search, slot grid, queue signup, Stripe checkout — v1.0
- ✓ Auth via Better Auth OTP (signup, login, email verification, session persistence) — v1.0
- ✓ Shared Convex backend — no schema conflicts, full copy of schema.ts — v1.0
- ✓ Landing header with nav links (Join, Why Tenseats, Cities globe section) — v1.0
- ✓ Dark theme default with theme toggle — v1.0
- ✓ SEO: sitemap.xml with 36 URLs, robots.txt, per-page meta tags — v1.0
- ✓ Coolify-ready Dockerfile with standalone Next.js output — v1.0
- ✓ City pages statically generated via `generateStaticParams()` from METROS_DATA — v1.0
- ✓ Interactive 3D globe with region tabs and city navigation pills — v1.0
- ✓ Brand compliance: locked copy enforced, forbidden adjectives removed — v1.0
- ✓ Mobile-responsive (375px minimum, no horizontal overflow) — v1.0

- ✓ 6-card responsive persona grid (3×2 desktop, 2×3 tablet, 1×6 mobile) on all city pages — v1.1
- ✓ Facilitator role added to type system, custom SVG icon, and display map — v1.1
- ✓ Shared PersonaCard component with framer-motion scroll animations — v1.1
- ✓ 192 culturally-specific persona descriptions (32 cities × 6 roles) with neighborhood-level specificity — v1.1
- ✓ Full brand compliance across all persona copy — zero forbidden adjectives — v1.1

- ✓ Shared "almost there" verification page with branded email-check messaging — v1.2
- ✓ Guest success page with community welcome, support email safelist, social links — v1.2
- ✓ Vendor success page with role-specific headlines, Stripe Connect, Zoho One card, social links — v1.2
- ✓ Custom Instagram and Pinterest monoline SVG social icons — v1.2
- ✓ Stripe Connect onboarding persistence (account ID saved, reactive status on vendor page) — v1.2
- ✓ Post-signup design system: PostSignupLayout, VerticalTimeline, dark premium aesthetic — v1.2
- ✓ Role-based post-OTP routing (guest → /launch/success/guest, vendor → /launch/success/vendor) — v1.2
- ✓ Comprehensive 732-line prompt document for main app post-signup implementation — v1.2

### Active

## Current Milestone: v1.3 Subscription Management

**Goal:** Add post-purchase subscription lifecycle management for Insider members via the already-installed `@convex-dev/stripe` component.

**Target features:**
- Membership status page (`/account/membership`) with tier display and lifetime badges
- Stripe Customer Portal integration for Insider billing management
- Walled-off `convex/billing/` namespace for subscription functions
- Post-fulfillment sync bridge for automatic Insider registration
- Backfill migration for existing Insider subscribers
- Two-repo coordination (Convex in marketplace repo, frontend in prelaunch)

### Out of Scope

- Modifying the main app repo (read-only source for copying) — auth trusted origins for localhost:3001 not added
- Admin features / SetupProvider wizard
- Deploying a separate Convex schema or HTTP router
- Real-time chat, video posts, OAuth login, mobile app
- Notifications, moderation, content management beyond pre-registration
- Any Convex `http.ts` deployment (relies on existing shared HTTP router)

## Context

**Current State:** v1.2 shipped. 20 phases, 35 plans, 169 commits, 21,433 LOC TypeScript.

- **Source repo:** `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform` (also cloneable from `https://github.com/raynellbell82/Tenseats-marketplace-platform.git` to `/tmp/tenseats-source`)
- **Shared Convex deployment:** Both apps point to `api.tenseats.io`. Users who create accounts on pre-launch site log into the marketplace seamlessly when it goes live — same domain, deployment swap
- **Port:** Dev runs on 3001 (main app uses 3000)
- **Auth limitation:** `localhost:3001` is NOT in trusted origins (main app not modified). Production auth works fine via shared `SITE_URL=https://tenseats.io`. Local dev auth may fail silently
- **Dependencies:** Copied from source `package.json` with only `name` and `scripts.dev` changed — exact version parity across all ~90 deps
- **Tailwind v4:** Uses `@import "tailwindcss"` syntax, no `tailwind.config.ts` file
- **Copy rules:** All consumer-facing copy locked via `tenseats-copy-writer` skill
- **Component strategy:** Copied from main repo, modified only `landing-header.tsx` (nav links) and `providers.tsx` (remove SetupProvider)
- **Tech stack:** Next.js 16.1.3, React 19, Convex 1.31.5, Better Auth 1.4.18, Stripe, Tailwind v4, shadcn/ui, Framer Motion, cobe

**Known Tech Debt:**
- Queue signup OTP redirect hits `/verify-email` session guard (unauthenticated queue users bounced to `/login`)
- Dead code: `request-reset-form.tsx`, `reset-password-form.tsx` (no route pages)
- Dead exports: `fixConvexUrl` (utils.ts), `listActive` alias (metros.ts)
- `/join` ReserveSpotSection CTAs link to `/launch` without `?city=` pre-fill
- Dead `VENDOR_ROLES` constant in `convex/launch/queue.ts` (duplicate of verify-email-form.tsx)
- Verified user navigating to `/verify-email` redirects to `/` instead of role-appropriate success page
- `convex/_generated/api.d.ts` manually edited (Convex sync failure) — may need regeneration
- ONBOARD-02 partial: only Stripe Connect step persists, no general onboarding progress resumption
- Stripe webhook requires `STRIPE_CONNECT_WEBHOOK_SECRET` and `CONVEX_DEPLOY_KEY` env vars (not yet set)

## Constraints

- **Schema safety**: Must copy FULL `schema.ts` unchanged — any diff breaks the shared Convex deployment
- **No main app modifications**: Source repo is read-only. Copy files, do not modify originals
- **Convex connection**: Use `CONVEX_DEPLOYMENT` env var to connect to existing deployment, never create a new project
- **Brand compliance**: All copy decisions from `tenseats-copy-writer` skill are locked
- **Deployment**: Coolify on `tenseats.io`, Docker standalone build

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Copy full schema.ts unchanged | Partial schema would conflict with shared Convex deployment | ✓ Good |
| No main app modifications | User directive — source repo is read-only | ✓ Good |
| Package.json from source | Exact version parity across ~90 deps, no drift | ✓ Good |
| Dark theme default | Matches Tenseats aesthetic from main app | ✓ Good |
| Port 3001 for dev | Avoids conflict with main app on port 3000 | ✓ Good |
| Static city pages | 32 metros via generateStaticParams from METROS_DATA | ✓ Good |
| No http.ts deployment | Relies on existing shared HTTP router in Convex | ✓ Good |
| OTP-only auth (no password) | Simpler UX, no password reset flow needed | ✓ Good |
| cobe for 3D globe | Lightweight WebGL globe with graceful fallback | ✓ Good |
| Cities nav → #cities-globe anchor | Avoids need for /cities index route | ✓ Good |
| Queue signup pre-auth | Join queue before creating auth account | ⚠️ Revisit (session guard conflict) |
| Shared PersonaCard component | Single card component for city and why pages, optional headline prop | ✓ Good |
| Custom SVG icons over Lucide | Monoline stroke icons match brand aesthetic, theme-aware via currentColor | ✓ Good |
| Replace full topPersonas arrays | Canonical role order enforced (guest→chef→mixologist→curator→venueHost→facilitator) | ✓ Good |
| City-specific CTA to /launch?city= | Persona section CTA pre-fills city for higher conversion intent | ✓ Good |
| Existing schema fields for onboarding | No new onboardingProgress table — use stripeConnectAccountId etc. | ✓ Good |
| PostSignupLayout shared wrapper | Dark premium design system consistent across all 3 post-signup pages | ✓ Good |
| saveStripeConnectAccount as public mutation | fetchAuthMutation with user JWT — ConvexHttpClient.setAdminAuth is private | ✓ Good |
| Webhook via Convex HTTP API /api/mutation | confirmStripeConnect (internal) called with deploy key, not private client API | ✓ Good |
| isStripeConnected from accountId non-null | accountId presence is the meaningful signal, not the complete boolean | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after Phase 14 (Schema & Env Wiring) complete*
