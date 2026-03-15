# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Pre-Launch Site

**Shipped:** 2026-03-13
**Phases:** 12 | **Plans:** 22 | **Commits:** 109

### What Was Built
- Full pre-launch site with homepage, join, why-tenseats, 32 city pages, auth, and launch flow
- Interactive 3D globe with region-tabbed city navigation
- Stripe-powered founding membership checkout with queue system
- OTP email auth integrated with shared Convex backend
- SEO infrastructure (sitemap, robots.txt) and Coolify-ready Dockerfile

### What Worked
- Copy-from-source strategy avoided dependency drift — exact version parity across ~90 packages
- Server Component page pattern (page.tsx as Server Component rendering Client Components) was consistent and clean
- Static generation of 32 city pages via generateStaticParams from shared METROS_DATA
- Brand compliance audit (Phase 9) caught forbidden adjectives and copy violations early
- Gap closure phases (10, 11) efficiently fixed integration issues found by milestone audit

### What Was Inefficient
- Queue signup OTP flow was rewritten in Phase 11 but the /verify-email session guard issue wasn't caught until integration check — the same "gap" was flagged 3 times across audit cycles
- Phase 4 had a false gap (documentation mismatch, not missing implementation) that consumed a plan slot
- Phase 8.1 plan count shows 0/1 in roadmap progress table despite being complete — tracking inconsistency

### Patterns Established
- All pages follow Server Component → Client Component rendering pattern
- Navigation links use hash anchors for same-page sections (/#cities-globe) instead of separate routes
- All auth flows use OTP via Better Auth emailOtp plugin — no password-based auth
- City data lives in lib/city-data.ts (client-safe) with METROS_DATA re-exported from Convex types
- Copy compliance: "Insider" always capitalized, no "restaurant" in heroes, 25-word subheadline limit

### Key Lessons
1. Cross-phase integration checks should happen earlier — the queue OTP → verify-email session guard issue survived through multiple audit cycles because each phase verified in isolation
2. Copy-from-source projects benefit from aggressive early verification — the shared Convex deployment constraint meant any schema drift would be catastrophic
3. Gap closure phases (decimal or appended) are efficient for fixing integration issues but should resolve completely in one pass — looping on the same gap wastes context

### Cost Observations
- Model mix: Orchestration on opus, execution on sonnet
- Entire v1.0 built in ~1 day
- Notable: 22 plans across 12 phases completed with high parallelization efficiency

---

## Milestone: v1.1 — City Persona Copy

**Shipped:** 2026-03-13
**Phases:** 2 | **Plans:** 4 | **Commits:** 19

### What Was Built
- Shared PersonaCard component with 6 custom monoline SVG icons and framer-motion scroll animations
- Facilitator added as 6th persona role across type system, icon map, and display map
- 192 culturally-specific persona descriptions (32 cities × 6 roles) with neighborhood-level specificity
- Brand compliance validation — zero forbidden adjectives across all persona copy

### What Worked
- Sequential wave execution (3 waves on same file) avoided merge conflicts — each wave picked up where the last left off
- Research phase pre-computed which roles were missing per city, so execution agents didn't need to analyze the data file
- Auto-correcting data deviations (Pittsburgh already had venueHost, 3 pre-existing "restaurant" violations) kept plans moving without human intervention
- Plan 13-03 validation task caught and fixed issues created by earlier plans — verification-at-end pattern works

### What Was Inefficient
- 3 separate plans for a single file (lib/city-data.ts) meant 3 sequential waves — could have been 2 waves or even 1 plan with more tasks
- Research phase listed role gaps that didn't match actual file state (Pittsburgh, Philadelphia) — research accuracy vs codebase reality gap

### Patterns Established
- Canonical persona role order enforced: guest → chef → mixologist → curator → venueHost → facilitator
- Replace full arrays (not append-only) when enforcing order constraints
- Copy spot-checks: 5 random cities sampled for cultural specificity verification

### Key Lessons
1. When all plans modify the same file, sequential waves are forced regardless of parallelization setting — plan structure should account for file-level dependencies
2. Research-generated gap lists should be verified against actual codebase state before planning — stale research creates in-execution deviations
3. Brand compliance validation as a dedicated task (not just per-plan checks) catches cross-plan issues efficiently

### Cost Observations
- Model mix: Orchestration on opus, execution and verification on sonnet
- Entire v1.1 built in ~1.2 hours (including research, planning, execution, verification, audit)
- Notable: 192 persona entries written and validated in 3 execution sessions (~27 min total execution)

---

## Milestone: v1.2 — Post-Signup Experience

**Shipped:** 2026-03-15
**Phases:** 6 | **Plans:** 9 | **Commits:** 41

### What Was Built
- 732-line Claude Code prompt for main app post-signup implementation
- Shared post-signup design system (PostSignupLayout, VerticalTimeline) with dark premium Framer Motion aesthetic
- Branded "almost there" verification page with email masking, resend cooldown, role-based post-OTP routing
- Guest success page with community welcome, click-to-copy support email, social links
- Vendor success page with 4 role-specific headlines, Stripe Connect, Zoho One card, social links
- Stripe Connect persistence: schema fields, Convex mutations/queries, webhook endpoint, reactive UI

### What Worked
- Schema coordination as first phase (20) was excellent — prompt doc gave complete specification, schema gate prevented premature persistence work
- Shared design system extracted in Phase 22 made Phases 23/24 fast — PostSignupLayout + VerticalTimeline reused cleanly
- SocialLinks extracted as shared component in Phase 23 was immediately consumed by Phase 24 without modification
- Visual checkpoints at each page caught design issues early — all 3 pages approved in-flow
- Phase 25 backend/frontend split was clean — two focused plans (5 min each) instead of one complex plan

### What Was Inefficient
- Phase 25 was never verified (no VERIFICATION.md) — gap discovered at milestone audit
- ONBOARD-01 not listed in Phase 25-01 SUMMARY requirements_completed frontmatter despite being implemented
- The v1.2 progress table in ROADMAP.md had inconsistent column alignment (missing milestone column for phases 20-25)
- ONBOARD-02 marked as partial because the requirement text ("resume from where they left off") is broader than what was built (Stripe Connect status only)

### Patterns Established
- Post-signup pages follow PostSignupLayout wrapper → motion.div sections with itemVariants → VerticalTimeline for step visualization
- Stripe Connect: save accountId on create (public mutation via fetchAuthMutation), confirm on webhook (internal mutation via Convex HTTP API with deploy key)
- useQuery skip pattern: `skip: !session?.user?.emailVerified` prevents Convex auth errors on unauthenticated access
- Social links use custom monoline SVG components matching persona icon aesthetic (currentColor, strokeWidth 1.5)

### Key Lessons
1. Always run the verifier on every phase — Phase 25 missing VERIFICATION.md created audit friction and ONBOARD-01 tracking gap
2. Requirement text precision matters — "resume from where they left off" was interpreted as Stripe Connect status only, but the user may have expected broader onboarding progress. Clarify scope during requirements definition.
3. Schema coordination phases with gating are highly effective for shared-backend projects — prevents downstream phases from building on undeployed changes
4. Env var dependencies (webhook secrets, deploy keys) should be documented as blockers in the requirements, not just in summaries

### Cost Observations
- Model mix: Orchestration on opus, execution on sonnet, integration check on sonnet
- Entire v1.2 built in ~7 hours (including 6 phases, 9 plans, audit, milestone completion)
- Notable: Phase 25 plans executed in ~5 min each — small focused plans are highly efficient

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v1.0 | 109 | 12 | Initial build — copy-from-source with shared backend |
| v1.1 | 19 | 2 | Content-focused milestone — data expansion with brand compliance |
| v1.2 | 41 | 6 | Post-signup UX — design system, 3 pages, Stripe Connect persistence |

### Top Lessons (Verified Across Milestones)

1. Integration testing across phase boundaries catches issues that per-phase verification misses
2. Copy-from-source projects need early schema validation against the shared deployment
3. Research accuracy degrades with codebase changes — always verify research against actual file state before execution
4. Always run the verifier on every phase — missing VERIFICATION.md creates audit friction (v1.2 Phase 25)
5. Requirement text precision matters — ambiguous scope leads to partial satisfaction (v1.2 ONBOARD-02)
