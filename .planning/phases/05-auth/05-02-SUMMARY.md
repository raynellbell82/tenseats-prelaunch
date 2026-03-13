---
phase: 05-auth
plan: 02
subsystem: auth
tags: [otp, better-auth, react-hook-form, zod, next.js]

requires:
  - phase: 05-auth plan 01
    provides: Auth layout, LandingHeader, verify-email page, authClient with emailOTPClient plugin

provides:
  - OTP-first login form sending verification code via authClient.emailOtp.sendVerificationOtp
  - Email-only loginSchema (no password field)
  - Simplified login page Server Component with no password-reset banner

affects: [05-auth, verify-email flow, any future auth pages]

tech-stack:
  added: []
  patterns: [OTP-first auth flow — email submitted → OTP sent → redirect to /verify-email]

key-files:
  created: []
  modified:
    - components/auth/login-form.tsx
    - lib/validations/auth.ts
    - app/(auth)/login/page.tsx

key-decisions:
  - "LoginForm now calls authClient.emailOtp.sendVerificationOtp directly — no signIn.email, no password fields"
  - "sessionStorage keys otp-verify-email and otp-sent-ts set before redirect so verify-email page has context"
  - "Login page reduced to a plain (non-async) Server Component — no Suspense, no searchParams needed"

patterns-established:
  - "OTP flow: collect email → sendVerificationOtp → store in sessionStorage → router.push to /verify-email"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]

duration: 1min
completed: 2026-03-12
---

# Phase 5 Plan 02: OTP Login Flow Summary

**Email-only OTP login form replacing password-based signIn.email flow — email input calls authClient.emailOtp.sendVerificationOtp and redirects to /verify-email**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-13T03:17:06Z
- **Completed:** 2026-03-13T03:17:53Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced password + emailOrPhone login form with email-only OTP form
- Updated loginSchema to validate a single `email` field (removed emailOrPhone + password)
- Removed all profile-creation logic and signIn.email calls from login-form.tsx
- Simplified login page to a plain Server Component (removed Suspense, searchParams, password-reset banner)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update loginSchema and rewrite login-form.tsx as OTP-first flow** - `a61e3ce` (feat)
2. **Task 2: Clean up login page to remove password-reset banner** - `206ef0f` (feat)

## Files Created/Modified

- `components/auth/login-form.tsx` - Rewritten as OTP-first email-only form; calls sendVerificationOtp, stores email in sessionStorage, redirects to /verify-email
- `lib/validations/auth.ts` - loginSchema updated to email-only (email: z.string().email()), removed emailOrPhone + password fields
- `app/(auth)/login/page.tsx` - Simplified to plain Server Component rendering LoginForm + heading + signup link; removed Suspense, searchParams, and password-reset banner

## Decisions Made

- Login form calls `authClient.emailOtp.sendVerificationOtp` directly rather than going through signIn.email — aligns with OTP-first spec (AUTH-02)
- sessionStorage keys `otp-verify-email` and `otp-sent-ts` set before redirect — consistent with pattern already used in verify-email-form.tsx
- Removed forgotPassword link entirely — no password means no password reset needed on login page

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- OTP login flow is complete: /login collects email → sends OTP → redirects to /verify-email
- AUTH-02 gap is closed
- Note: OTP delivery cannot be tested locally (localhost:3001 not in trusted origins for shared Convex deployment); production verification required

---
*Phase: 05-auth*
*Completed: 2026-03-12*
