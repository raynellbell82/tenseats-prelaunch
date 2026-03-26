# Milestones

## v1.3 Subscription Management (Shipped: 2026-03-26)

**Phases completed:** 5 phases, 10 plans, 15 tasks

**Key accomplishments:**

- Added `stripeBillingCustomerId` to Convex users table in both repos and renamed `STRIPE_WEBHOOK_SECRET` to `STRIPE_CONNECT_WEBHOOK_SECRET` in the Connect webhook handler
- Three Convex billing primitives added to subscriptions.ts: setStripeBillingCustomerId internalMutation, syncCustomerToComponent internalAction, and syncMyBillingCustomer action for lazy client-side sync
- Insider-only post-fulfillment sync bridge injected into membershipWebhooks.ts — new Insider checkouts auto-register with the @convex-dev/stripe billing component via a non-fatal try/catch after fulfillMembership + markEventProcessed succeed
- Sequential Stripe backfill migration with getActiveInsiders/backfillSingleInsider/runBackfill and convex/billing/ directory synced to prelaunch repo for Phase 16 type references
- MembershipTierBadge
- 1. [Rule 1 - Bug] Fixed TS2352 type error in payments cast
- Code analysis confirms all three membership tier display paths correct — early_bird/founding labeled as lifetime with burnt-sienna badge, insider with subscription badge and gated billing UI; build exits 0 after fixing 3 pre-existing TypeScript errors
- Backend wiring for Stripe Customer Portal and checkout auto-sync confirmed present; human e2e verification of TEST-02 and TEST-03 deferred by user

---

## v1.2 Post-Signup Experience (Shipped: 2026-03-15)

**Phases completed:** 6 phases, 9 plans, 41 commits

**Key accomplishments:**

- Comprehensive Claude Code prompt for main app post-signup implementation (732-line prescriptive document)
- Shared post-signup design system: PostSignupLayout, VerticalTimeline, dark premium aesthetic with Framer Motion stagger animations
- Branded "almost there" verification page with email masking, resend cooldown, and 3-step timeline
- Guest success page with community welcome, click-to-copy support email, and social links
- Vendor success page with role-specific headlines, optional Stripe Connect, Zoho One card, and social links
- Stripe Connect onboarding persistence: backend mutations/queries, webhook endpoint, reactive UI status

**Stats:**

- 41 commits | 43 files | +5,224 / -59 lines | 21,433 LOC TypeScript
- Timeline: 2026-03-14 (~7 hours)
- Git range: c52e4b9..fe88e8c

### Known Gaps

- **ONBOARD-02**: "When a user logs back in, they see their progress and can resume from where they left off." Implementation covers Stripe Connect step only — vendor page shows reactive "Stripe Connected" status. General onboarding progress resumption deferred to v1.3.
- **Environment setup required**: `STRIPE_CONNECT_WEBHOOK_SECRET` and `CONVEX_DEPLOY_KEY` must be set before Stripe Connect webhook works in production.

---

## v1.1 City Persona Copy (Shipped: 2026-03-13)

**Phases completed:** 2 phases, 4 plans, 8 tasks

**Key accomplishments:**

- 6 custom monoline SVG persona icons and shared PersonaCard component with framer-motion scroll animations
- Facilitator added as 6th persona role across type system, icon map, and display map
- 192 culturally-specific persona descriptions written (32 cities × 6 roles) referencing named neighborhoods and local food scenes
- Full brand compliance validated — zero forbidden adjectives across all persona copy
- City-personas and why-personas sections refactored to shared PersonaCard in responsive 3×2 grid

**Stats:**

- 19 commits | 20 files | +2,740 / -279 lines | 20,373 LOC TypeScript
- Timeline: 2026-03-13 (~1.2 hours)
- Git range: 7775650..7548c06

---

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
