# Deferred Items — Phase 04: Join Page

## Pre-existing Build Failures (Out of Scope)

### Missing lib/validations/auth module
- **File:** components/auth/login-form.tsx (line 9)
- **Error:** Cannot find module '@/lib/validations/auth' or its corresponding type declarations
- **Origin:** Copied from source repo in Phase 01-02 (commit 90f4f3e)
- **Impact:** `npx next build` fails on TypeScript check
- **Why deferred:** Pre-existing issue not caused by Phase 04 join page work; auth components are not used on the join page
- **Fix:** Create lib/validations/auth.ts with loginSchema and LoginFormData exports, likely using zod
