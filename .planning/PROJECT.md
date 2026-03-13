# Tenseats Pre-Launch Site

## What This Is

A standalone Next.js + Convex pre-launch website for Tenseats — a food-focused social marketplace launching in 32 US cities. Lives at `tenseats.io` and serves as the public face until the full marketplace app replaces it via a Coolify deployment swap. Connects to the same Convex deployment (`api.tenseats.io`) as the main app, sharing users, metros, launch slots, and pre-registration tables.

## Core Value

Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city-specific landing pages — all on a shared backend so accounts carry over seamlessly when the full marketplace launches.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with live countdown from Convex launchConfig, founding membership banner, and hero CTA
- [ ] Join page (`/join`) with 5 sections: hero, food-as-language, free seat, reserve spot, CTA footer
- [ ] Why Tenseats page (`/why-tenseats`) with 5 sections: hero, problem/solution, personas, economics comparison, CTA
- [ ] Dynamic city pages (`/cities/[slug]`) for all 32 US metros with city-specific copy, food scene blocks, personas, and reservation widget
- [ ] Launch flow (`/launch`) with city search, slot grid, queue signup, Stripe checkout, success/expired pages
- [ ] Auth via Better Auth OTP (signup, login, email verification, session persistence)
- [ ] Shared Convex backend — no schema conflicts, no separate deployment, full copy of schema.ts
- [ ] Landing header with nav links to Join, Why Tenseats, Cities
- [ ] Dark theme default matching main app's CSS variable system
- [ ] SEO: sitemap.xml with all 34 URLs, robots.txt, per-page meta tags
- [ ] Coolify-ready Dockerfile with standalone Next.js output
- [ ] City pages statically generated via `generateStaticParams()` from METROS_DATA
- [ ] Stripe checkout redirects use `NEXT_PUBLIC_APP_URL` for success/cancel URLs
- [ ] All accepted copy from `tenseats-copy-writer` skill enforced (locked decisions)
- [ ] Mobile-responsive (375px minimum, no horizontal overflow)
- [ ] Footer shared component from main app

### Out of Scope

- Modifying the main app repo (read-only source for copying) — auth trusted origins for localhost:3001 not added
- Admin features / SetupProvider wizard
- Deploying a separate Convex schema or HTTP router
- Real-time chat, video posts, OAuth login, mobile app
- Notifications, moderation, content management beyond pre-registration
- Any Convex `http.ts` deployment (relies on existing shared HTTP router)

## Context

- **Source repo:** `/Users/tenseats/Documents/dev/Tenseats-marketplace-platform` (also cloneable from `https://github.com/raynellbell82/Tenseats-marketplace-platform.git` to `/tmp/tenseats-source`)
- **Shared Convex deployment:** Both apps point to `api.tenseats.io`. Users who create accounts on pre-launch site log into the marketplace seamlessly when it goes live — same domain, deployment swap
- **Port:** Dev runs on 3001 (main app uses 3000)
- **Auth limitation:** `localhost:3001` is NOT in trusted origins (main app not modified). Production auth works fine via shared `SITE_URL=https://tenseats.io`. Local dev auth may fail silently
- **Dependencies:** Copied from source `package.json` with only `name` and `scripts.dev` changed — exact version parity across all ~90 deps
- **Tailwind v4:** Uses `@import "tailwindcss"` syntax, no `tailwind.config.ts` file
- **Copy rules:** All consumer-facing copy locked via `tenseats-copy-writer` skill. Key: "Insider" always capital I, never say "restaurant" in hero copy, subheadline max 25 words, forbidden adjectives list enforced
- **Component strategy:** Copy from main repo, don't install as package. Modify only `landing-header.tsx` (nav links) and `providers.tsx` (remove SetupProvider)

## Constraints

- **Schema safety**: Must copy FULL `schema.ts` unchanged — any diff breaks the shared Convex deployment
- **No main app modifications**: Source repo is read-only. Copy files, do not modify originals
- **Convex connection**: Use `CONVEX_DEPLOYMENT` env var to connect to existing deployment, never create a new project
- **Brand compliance**: All copy decisions from `tenseats-copy-writer` skill are locked. Cannot rewrite without re-running the skill
- **Tech stack**: Next.js 16.1.3, React 19, Convex 1.31.5, Better Auth 1.4.18, Stripe, Tailwind v4, shadcn/ui, Framer Motion
- **Timeline**: ASAP — speed matters
- **Deployment**: Coolify on `tenseats.io`, Docker standalone build

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Copy full schema.ts unchanged | Partial schema would conflict with shared Convex deployment | — Pending |
| No main app modifications | User directive — source repo is read-only | — Pending |
| Package.json from source | Exact version parity across ~90 deps, no drift | — Pending |
| Dark theme default | Matches Tenseats aesthetic from main app | — Pending |
| Port 3001 for dev | Avoids conflict with main app on port 3000 | — Pending |
| Static city pages | 32 metros via generateStaticParams from METROS_DATA | — Pending |
| No http.ts deployment | Relies on existing shared HTTP router in Convex | — Pending |

---
*Last updated: 2026-03-12 after initialization*
