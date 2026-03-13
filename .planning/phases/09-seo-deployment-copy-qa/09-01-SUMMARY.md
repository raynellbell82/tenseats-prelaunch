---
phase: 09-seo-deployment-copy-qa
plan: 01
subsystem: infra
tags: [nextjs, sitemap, seo, robots, docker, coolify, health-check]

# Dependency graph
requires:
  - phase: 07-city-pages
    provides: METROS_DATA with 32 city slugs used for sitemap generation
provides:
  - Next.js Metadata API sitemap with 36 URLs (homepage + join + why-tenseats + launch + 32 city pages)
  - Next.js robots.txt generation allowing all crawlers
  - /api/health endpoint returning { ok: true }
  - Multi-stage Dockerfile for Coolify standalone deployment
  - .dockerignore excluding dev artifacts
affects: [deployment, coolify, seo, search-indexing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next.js Metadata API sitemap (app/sitemap.ts as default export function)
    - Next.js Metadata API robots (app/robots.ts as default export function)
    - Multi-stage Docker build with standalone Next.js output
    - Non-root Docker runner user (nextjs:nodejs) for security

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
    - app/api/health/route.ts
    - Dockerfile
    - .dockerignore
  modified: []

key-decisions:
  - "sitemap.ts uses METROS_DATA (not CITY_DATA) for slug enumeration — METROS_DATA is the authoritative list of 32 metro slugs"
  - "Dockerfile uses npm ci --legacy-peer-deps matching .npmrc setting for workpool peer conflict"
  - ".npmrc not in .dockerignore — needed for legacy-peer-deps during npm ci in deps stage"
  - "Standalone output already configured in next.config.ts — Dockerfile assumes it"

patterns-established:
  - "Next.js Metadata API files (sitemap.ts, robots.ts) live directly in app/ directory as default exports"
  - "Health endpoint is minimal — no DB checks, just { ok: true }"

requirements-completed: [DEPL-01, DEPL-02, DEPL-03, DEPL-04]

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 9 Plan 01: SEO Infrastructure and Deployment Summary

**Next.js Metadata API sitemap (36 URLs), robots.txt, /api/health, and 3-stage Coolify Dockerfile using standalone output with non-root runner**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-13T10:47:47Z
- **Completed:** 2026-03-13T10:55:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Sitemap generating 36 URLs: homepage (priority 1.0), join/why-tenseats/launch (0.8), 32 city pages (0.6)
- Robots.txt allowing all crawlers and referencing sitemap at https://prelaunch.tenseats.io/sitemap.xml
- Health endpoint at /api/health returning { ok: true } with 200 status
- 3-stage Dockerfile (deps/builder/runner) using standalone Next.js output pattern with non-root user

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sitemap.ts, robots.ts, and health check endpoint** - `171f261` (feat)
2. **Task 2: Create Dockerfile and .dockerignore for Coolify deployment** - `c0a0a38` (chore)

**Plan metadata:** _(docs commit below)_

## Files Created/Modified
- `app/sitemap.ts` - Next.js Metadata API sitemap returning 36 URLs from METROS_DATA
- `app/robots.ts` - Next.js Metadata API robots config allowing all crawlers
- `app/api/health/route.ts` - Minimal GET handler returning { ok: true }
- `Dockerfile` - Multi-stage build: deps (npm ci) → builder (next build) → runner (standalone)
- `.dockerignore` - Excludes node_modules, .next, .git, .env.local, .planning, npm-debug.log, README.md

## Decisions Made
- Used METROS_DATA (not CITY_DATA record) for sitemap slug enumeration — METROS_DATA is the flat array with all 32 metro entries
- Dockerfile uses `npm ci --legacy-peer-deps` matching the .npmrc setting required for workpool peer conflict
- .npmrc intentionally NOT in .dockerignore — needed by the deps stage during npm ci
- standalone output was already set in next.config.ts — Dockerfile simply relies on it

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Plan verify command used `grep -q "node server.js"` but Dockerfile CMD uses JSON array syntax `["node", "server.js"]` — literal string mismatch in the verify grep. Content is correct; grep pattern was the approximation.

## User Setup Required
None - no external service configuration required. Environment variables are injected as Docker build args at Coolify deploy time.

## Next Phase Readiness
- All SEO infrastructure files are in place
- Dockerfile is ready for Coolify deployment with build args
- Phase 09 Plan 02 can proceed (copy QA / content review)

---
*Phase: 09-seo-deployment-copy-qa*
*Completed: 2026-03-13*

## Self-Check: PASSED

All files verified present on disk. All commits verified in git log.
