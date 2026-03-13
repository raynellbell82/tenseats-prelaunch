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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v1.0 | 109 | 12 | Initial build — copy-from-source with shared backend |
| v1.1 | 19 | 2 | Content-focused milestone — data expansion with brand compliance |

### Top Lessons (Verified Across Milestones)

1. Integration testing across phase boundaries catches issues that per-phase verification misses
2. Copy-from-source projects need early schema validation against the shared deployment
3. Research accuracy degrades with codebase changes — always verify research against actual file state before execution
