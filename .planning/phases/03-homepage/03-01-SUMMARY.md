---
phase: 03-homepage
plan: "01"
subsystem: homepage
tags: [homepage, hero, countdown, founding-membership, CTAs]
dependency_graph:
  requires:
    - "02-02-SUMMARY.md (LandingHeader)"
    - "01-02-SUMMARY.md (LaunchCountdownFull, launch components)"
    - "convex/launch/queue.ts (getLaunchConfig)"
  provides:
    - "HeroSection component with countdown, founding pill, headline, CTAs"
    - "Homepage at / with LandingHeader + HeroSection"
  affects:
    - "app/page.tsx (replaced placeholder)"
tech_stack:
  added: []
  patterns:
    - "Server Component (page.tsx) rendering Client Components (LandingHeader, HeroSection)"
    - "useQuery for Convex getLaunchConfig with conditional countdown render"
    - "framer-motion motion.div for entrance animations"
key_files:
  created:
    - components/landing/hero-section.tsx
  modified:
    - app/page.tsx
decisions:
  - "Copied hero-section.tsx from main repo unchanged except /community -> /why-tenseats link replacement"
  - "page.tsx is a Server Component with no use client directive — renders two Client Components"
  - "Build TypeScript error in login-form.tsx (@/lib/validations/auth missing) is pre-existing, out of scope — deferred"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-13"
  tasks_completed: 2
  files_created: 1
  files_modified: 1
---

# Phase 3 Plan 01: Homepage Hero Section Summary

**One-liner:** HeroSection copied from main repo (with /why-tenseats link fix) and wired into homepage at / alongside LandingHeader, satisfying all HOME-01 through HOME-06 requirements.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Copy HeroSection from source and fix community link | 9546ae8 | components/landing/hero-section.tsx |
| 2 | Wire homepage page.tsx with LandingHeader and HeroSection | c61f1a5 | app/page.tsx |

## What Was Built

### components/landing/hero-section.tsx

Copied directly from the main Tenseats marketplace repo with a single link change:
- Atmospheric gradient orbs with framer-motion fade-in
- Founding membership amber pill linking to `/launch` (HOME-03)
- Live countdown via `useQuery(api.launch.queue.getLaunchConfig)` + `LaunchCountdownFull` (HOME-02)
- Headline: "Discover events worth attending" (HOME-04)
- "Get Started" CTA linking to `/signup` (HOME-05)
- "Learn about our community" link pointing to `/why-tenseats` (HOME-06, changed from `/community`)
- Social proof row: 30+ Cities, 1,000+ Events, 100% Curated

### app/page.tsx

Replaced placeholder with homepage composition:
- Imports and renders `LandingHeader` + `HeroSection`
- Server Component (no `use client`) delegating to two Client Components
- Root layout already provides Providers, Footer, Toaster

## Requirements Satisfied

- HOME-01: Homepage renders at / with LandingHeader and HeroSection
- HOME-02: HeroSection uses getLaunchConfig for live countdown display
- HOME-03: Founding membership pill visible with amber styling, links to /launch
- HOME-04: "Discover events worth attending" headline rendered
- HOME-05: "Get Started" CTA links to /signup
- HOME-06: "Learn about our community" link points to /why-tenseats

## Deviations from Plan

None - plan executed exactly as written. The one-line link change (community -> why-tenseats) was performed as specified.

## Deferred Issues (Out of Scope)

**Pre-existing build error:** `components/auth/login-form.tsx` imports `@/lib/validations/auth` which does not exist yet. This caused a TypeScript build failure but is unrelated to homepage tasks. The `lib/validations/auth` module will be created in the auth phase. Confirmed: no TypeScript errors in hero-section.tsx or page.tsx.

## Self-Check: PASSED

- [x] components/landing/hero-section.tsx exists
- [x] app/page.tsx updated with LandingHeader + HeroSection imports
- [x] Commit 9546ae8 exists (hero-section copy)
- [x] Commit c61f1a5 exists (page.tsx wire-up)
- [x] /community link not present in hero-section.tsx (0 matches)
- [x] /why-tenseats link present in hero-section.tsx
