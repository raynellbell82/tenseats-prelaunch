---
phase: 05-auth
plan: 01
subsystem: auth
tags: [better-auth, otp, zod, next-auth, react, typescript]

# Dependency graph
requires:
  - phase: 02-layout
    provides: LandingHeader component used in auth layout
  - phase: 01-scaffold
    provides: auth-client.ts, auth-server.ts, auth components (login-form, signup-wizard, verify-email-form)
provides:
  - Auth route group layout with LandingHeader and centered content wrapper
  - /signup route rendering SignupWizard with 4-step wizard
  - /login route rendering LoginForm with password-reset success banner
  - /verify-email route with session-guarded OTP verification
  - lib/validations/auth.ts Zod schemas for all auth forms
  - All post-auth redirects patched to / (pre-launch homepage)
affects: [06-launch, 07-cities, 08-seo]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Auth route group (auth) shares centered layout with LandingHeader via Next.js route group layout
    - Zod schemas in lib/validations/auth.ts imported by both page and component layers
    - verify-email page is Client Component with useSession guard; signup and login pages are Server Components

key-files:
  created:
    - lib/validations/auth.ts
    - app/(auth)/layout.tsx
    - app/(auth)/signup/page.tsx
    - app/(auth)/login/page.tsx
    - app/(auth)/verify-email/page.tsx
  modified:
    - components/auth/login-form.tsx
    - components/auth/verify-email-form.tsx
    - components/auth/signup-wizard.tsx

key-decisions:
  - "Auth layout uses LandingHeader (not Navbar) — pre-launch pattern consistent with homepage and join page"
  - "verify-email/page.tsx is a Client Component (not Server) — requires useSession hook and useSearchParams for session guard and email resolution"
  - "signup-wizard.tsx callbackURL patched from /feed to / — pre-launch has no /feed route; OTP flow fallback must point to valid page"

patterns-established:
  - "Auth pages are Server Components where possible; verify-email is Client Component due to session/URL hooks"
  - "All post-auth redirects in pre-launch point to / (homepage) instead of /feed (main app)"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]

# Metrics
duration: 10min
completed: 2026-03-13
---

# Phase 5 Plan 01: Auth Pages Summary

**OTP email auth pages (/signup, /login, /verify-email) with shared centered layout using LandingHeader, Zod validation schemas, and all redirects patched from /feed to / for pre-launch**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-13T03:00:08Z
- **Completed:** 2026-03-13T03:10:00Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Created auth route group with centered layout (LandingHeader + max-w-md content wrapper + Tenseats logo link)
- Created all 3 auth pages: /signup (SignupWizard), /login (LoginForm with reset banner), /verify-email (Client Component with session guard)
- Copied Zod validation schemas (credentials, profile, username, metro, login, forgot/reset password)
- Patched all /feed redirects to / across login-form, verify-email-form, and signup-wizard components

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy validation schema and create auth route group layout** - `f39aa93` (feat)
2. **Task 2: Create signup, login, and verify-email route pages** - `668f4dd` (feat)
3. **Task 3: Patch auth component redirects from /feed to / for pre-launch** - `998cbd4` (fix)

## Files Created/Modified
- `lib/validations/auth.ts` - Zod schemas for all auth forms (credentials, profile, username, metro, login, forgot/reset password)
- `app/(auth)/layout.tsx` - Server Component auth layout with LandingHeader, centered flex container, Tenseats logo
- `app/(auth)/signup/page.tsx` - Server Component rendering SignupWizard with heading and sign-in link
- `app/(auth)/login/page.tsx` - async Server Component with searchParams reset-success banner and LoginForm
- `app/(auth)/verify-email/page.tsx` - Client Component with useSession guard, redirects to / on already-verified
- `components/auth/login-form.tsx` - Patched router.push('/feed') -> router.push('/')
- `components/auth/verify-email-form.tsx` - Patched router.push('/feed') -> router.push('/')
- `components/auth/signup-wizard.tsx` - Patched callbackURL: '/feed' -> callbackURL: '/'

## Decisions Made
- Auth layout uses LandingHeader (not Navbar) — consistent with pre-launch pattern; Navbar is main-app nav
- verify-email page is Client Component — requires useSession hook and useSearchParams, cannot be Server Component
- signup-wizard callbackURL also patched — pre-launch has no /feed route; fallback must be valid

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Patched signup-wizard.tsx callbackURL from /feed to /**
- **Found during:** Task 3 (Patch auth component redirects)
- **Issue:** Plan specified patching only login-form.tsx and verify-email-form.tsx, but signup-wizard.tsx also had callbackURL: "/feed" which would cause broken redirect in pre-launch (no /feed route exists)
- **Fix:** Changed callbackURL: "/feed" to callbackURL: "/" in signUp.email() call
- **Files modified:** components/auth/signup-wizard.tsx
- **Verification:** grep -r '"/feed"' components/auth/ returns no matches
- **Committed in:** 998cbd4 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Auto-fix necessary for correctness — pre-launch has no /feed route. No scope creep.

## Issues Encountered
None - all tasks executed cleanly. Auth components were already scaffolded in Phase 1; this plan connected them with route pages and patched redirects.

## User Setup Required
None — auth configuration (Better Auth, Convex, OTP) was established in Phase 1 scaffold. Note from STATE.md: OTP auth will not work in local dev (localhost:3001 not in trusted origins). Only verifiable in production via SITE_URL.

## Next Phase Readiness
- Auth flow complete: visitors can sign up, log in, and verify email via OTP
- Sessions persist via Better Auth cookies on shared Convex backend
- All auth redirects point to pre-launch homepage (/)
- Ready for Phase 6 (launch/Stripe checkout) which requires authenticated sessions

---
*Phase: 05-auth*
*Completed: 2026-03-13*

## Self-Check: PASSED

All created files verified on disk. All task commits verified in git log.
