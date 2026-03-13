# Deferred Items — Phase 07 City Pages

## Pre-existing TypeScript Build Error (Out of Scope)

**File:** `components/auth/signup-step-username.tsx:33`
**Error:** `Property 'users' does not exist on type '{ metros: ... }'`
**Description:** `api.users.checkUsernameAvailability` reference fails because the shared Convex deployment's generated API types do not include a `users` namespace matching this query. This existed before Plan 07-02 work began (confirmed via git bisect to commit 08da24f).
**Impact:** `npm run build` fails TypeScript type check. Does not affect city page functionality.
**Suggested fix:** Run `npx convex dev --once` to regenerate `convex/_generated/api.ts` against the current shared Convex deployment, or remove/fix the username availability check in the signup wizard.
**Discovered:** Plan 07-02, during build verification
