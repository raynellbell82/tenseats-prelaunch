# Tenseats Pre-Launch Site

## What This Is

A standalone Next.js + Convex pre-launch website for Tenseats — a food-focused social marketplace launching in 32 US cities. Lives at `tenseats.io` and serves as the public face until the full marketplace app replaces it via a Coolify deployment swap. Connects to the same Convex deployment (`api.tenseats.io`) as the main app, sharing users, metros, launch slots, and pre-registration tables.

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

### Active

## Current Milestone: v1.2 Post-Signup Experience

**Goal:** Create distinctive post-signup pages — a shared "almost there" verification prompt, a guest welcome/success page, and a vendor onboarding success page with Stripe connect and back-of-house guidance.

**Target features:**
- Shared "almost there" page (check your email for verification code)
- Guest success page (inspirational welcome, community messaging, social links)
- Vendor success page (Stripe connect step, Zoho One back-of-house info, progress persistence)
- Custom Instagram and Pinterest social icons
- Onboarding step persistence (save completed steps per user, resume on next login)

### Out of Scope

- Modifying the main app repo (read-only source for copying) — auth trusted origins for localhost:3001 not added
- Admin features / SetupProvider wizard
- Deploying a separate Convex schema or HTTP router
- Real-time chat, video posts, OAuth login, mobile app
- Notifications, moderation, content management beyond pre-registration
- Any Convex `http.ts` deployment (relies on existing shared HTTP router)

## Context

**Current State:** v1.1 shipped. 14 phases, 26 plans, 128 commits, 20,373 LOC TypeScript.

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

---
*Last updated: 2026-03-14 after v1.2 milestone start*
