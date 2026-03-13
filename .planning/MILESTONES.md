# Milestones

## v1.0 Pre-Launch Site (Shipped: 2026-03-13)

**Phases completed:** 12 phases, 22 plans, 0 tasks

**Key accomplishments:**
- Full Next.js + Convex pre-launch site scaffolded from source marketplace repo with shared backend
- 32 statically-generated city landing pages with city-specific copy, personas, and food scene blocks
- Interactive 3D globe (cobe) on homepage with region-tabbed city navigation
- OTP email auth via Better Auth with signup, login, and email verification flows
- Stripe-powered launch flow with city search, slot grid, queue signup, checkout, and success/expired pages
- SEO & deployment readiness — sitemap, robots.txt, Dockerfile, brand compliance across all copy

**Stats:**
- 109 commits | 207 files | 16,228 LOC TypeScript
- Timeline: 2026-03-12 → 2026-03-13 (1 day)
- Git range: 6e69b3c..53af6ed

**Known Gaps (accepted as tech debt):**
- Queue signup OTP redirect hits /verify-email session guard — unauthenticated queue users get bounced to /login
- ReserveSpotSection CTAs on /join link to /launch without ?city= pre-fill (degraded UX)
- Dead code: request-reset-form.tsx, reset-password-form.tsx (no route pages)
- Dead exports: fixConvexUrl (utils.ts), listActive alias (metros.ts)

---

