# Claude Code Prompt: `tenseats-marketplace` — Post-Signup Experience

## Context

You are building the **post-signup experience** for the main Tenseats marketplace application. This covers the complete flow from signup completion to role-specific success pages, including email verification, onboarding persistence, and Stripe connect for vendors.

This is NOT the prelaunch site (`tenseats-prelaunch`). The prelaunch site builds its own pages separately. This prompt is for the main `tenseats-marketplace` repository only.

**Architecture note:** The prelaunch site and main app share the same Convex backend deployment (`api.tenseats.io`). They share `users`, `userRoles`, `userPreferences`, and related tables. When you implement these features, you are working on data structures that both apps touch.

**Critical rule:** Always check the current `convex/schema.ts` before adding new tables or fields. The schema is the single source of truth. Leverage what already exists before building something new.

---

## Source Repository

The main Tenseats platform lives at:
```
/Users/tenseats/Documents/dev/Tenseats-marketplace-platform
```
(or your local equivalent — check if this path exists; adjust if needed)

---

## Section 1: Schema Approach

**Check `convex/schema.ts` before making any data model changes.**

The existing schema already provides everything needed for onboarding persistence. Do not create a new `onboardingProgress` table unless you have verified the existing fields genuinely cannot serve the purpose.

### Existing fields to use as onboarding signals

| Onboarding Step | Table | Field | Completion Signal |
|---|---|---|---|
| Role selection | `userRoles` | `userId` + `role` | Row exists for user (always complete by success page) |
| City selection | `userPreferences` | `currentMetroId` | Non-null value |
| Cuisine preferences | `userPreferences` | `cuisinePreferences` | Non-null, non-empty array |
| Stripe connect (vendors) | `users` | `stripeCustomerId` | Non-null string |
| Overall completion | `users` | `isProfileComplete` | `true` |

### Schema field reference (copy from current schema.ts)

```typescript
// users table — onboarding-relevant fields
users: defineTable({
  // ...
  isProfileComplete: v.optional(v.boolean()),
  stripeCustomerId: v.optional(v.string()),
  stripeSubscriptionId: v.optional(v.string()),
  membershipTier: v.optional(membershipTier),       // "early_bird" | "founding" | "insider"
  membershipCategory: v.optional(membershipCategory), // "chef" | "mixologist" | "creator" | "venueHost" | "guest"
  // ...
})

// userRoles table — canonical role source
userRoles: defineTable({
  userId: v.id("users"),
  role: roleType,  // "chef" | "mixologist" | "creator" | "venueHost" | "guest"
  status: roleStatus, // "pending" | "active" | "suspended"
  verifiedAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
})
  .index("by_user", ["userId"])
  .index("by_user_role", ["userId", "role"])

// userPreferences table — onboarding completion signals
userPreferences: defineTable({
  userId: v.string(), // Stores Better Auth ID as string
  cuisinePreferences: v.optional(v.array(v.string())),
  hashtagPreferences: v.optional(v.array(v.string())),
  currentMetroId: v.optional(v.id("metros")),
  // ...
})
  .index("by_user", ["userId"])
```

### Role type union (5 roles — no "facilitator" in schema)

```typescript
const roleType = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest")
);
```

Note: "Facilitator" may appear as display language on the prelaunch site's city pages — it is not a schema role. Do not add it to the schema.

### Schema deployment workflow

After any schema changes:
1. Run `npx convex deploy` to push changes
2. Verify the new fields are queryable in the Convex dashboard
3. Update TypeScript types if needed

---

## Section 2: Redirect Flow

### Complete redirect chain

```
/signup (role selection wizard)
  └──> /almost-there (email verification prompt)
         └──> /verify-email (OTP code entry — Better Auth)
                └──> [role check via userRoles query]
                       ├── role === "guest" ──────────────────> /welcome/guest
                       └── role is chef/mixologist/creator/venueHost ──> /welcome/vendor
```

### Role routing logic

After successful OTP verification, query the `userRoles` table:

```typescript
// convex/queries/users.ts (or wherever role queries live)
export const getUserPrimaryRole = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    return roleRecord?.role ?? null;
  },
});
```

Route based on result:
- `"guest"` → `/welcome/guest`
- `"chef"` | `"mixologist"` | `"creator"` | `"venueHost"` → `/welcome/vendor`
- `null` (no role) → redirect to role selection or show error (edge case — see Section 8)

### Role must be written during signup

The signup wizard must write a row to `userRoles` before the user reaches `/almost-there`. If the current signup flow does not do this, add the mutation. The success pages assume role is always present.

### Verify-email session guard (existing behavior — tech debt)

The existing `verify-email` page (if it exists in the main app) likely has a session guard that redirects unauthenticated users. When implementing the post-signup flow:

1. **Preserve the session guard** — do not remove it
2. **Ensure signup writes user to session** before redirecting to `/almost-there`
3. **Pass email via URL param** (`/verify-email?email=user@example.com`) or `sessionStorage` as fallback, so the OTP form can pre-populate
4. **After successful OTP verification**, do not redirect to `/` — redirect to role-based success page instead
5. **If session is lost** between signup and verify-email (e.g., user closed tab): redirect to `/signup` with a clear message, not a blank error

**Implementation note for verify-email page:**

```typescript
// After OTP success — replace any existing router.push("/") or router.push("/feed")
// with role-based routing:
const role = await getUserPrimaryRole(userId);
if (role === "guest") {
  router.push("/welcome/guest");
} else if (["chef", "mixologist", "creator", "venueHost"].includes(role)) {
  router.push("/welcome/vendor");
} else {
  router.push("/onboarding/role"); // edge case: no role
}
```

---

## Section 3: Pages to Build

### File structure

```
app/
  almost-there/
    page.tsx               — "Check your email" verification prompt
  welcome/
    guest/
      page.tsx             — Guest success page
    vendor/
      page.tsx             — Vendor success page
components/
  post-signup/
    almost-there-content.tsx
    guest-success-content.tsx
    vendor-success-content.tsx
    social-links.tsx       — Shared Instagram + Pinterest icon components
    address-book-reminder.tsx  — Shared "add to address book" component
```

---

## Section 4: Page Specifications

### Page 4a: "Almost There" — `/almost-there`

**Route:** `app/almost-there/page.tsx`
**Component:** `AlmostTherePage` (server component, no auth guard needed)
**Purpose:** Confirmation that signup submitted; prompts user to check email for OTP code
**Applies to:** All roles (shown before OTP verification)

**Data:** Static — no Convex queries needed. Email can be passed via URL param for display.

**Component structure:**

```tsx
// app/almost-there/page.tsx
import { AlmostThereContent } from "@/components/post-signup/almost-there-content";

export default function AlmostTherePage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return <AlmostThereContent email={searchParams.email} />;
}
```

**Exact copy — implement verbatim:**

```
Headline:        Check your inbox.

Subheadline:     We sent a code to {email}. It's your key in.

Body:            The Tenseats community lives behind a verified door.
                 Enter the code to step through.

CTA button:      Enter my code
CTA link:        /verify-email?email={email}

Secondary text:  Didn't get it? Check your spam or [resend the code].
```

**Design requirements:**
- Full-viewport centered layout — not a form confirmation banner
- Black background or near-black (`bg-black` or `bg-zinc-950`)
- White headline, muted subheadline
- Single prominent CTA button — pill shape, white fill, black text
- The email address renders inline in the subheadline (highlighted or bold)
- No generic success icons (no green checkmarks) — this is anticipation, not completion
- Mobile-first, WCAG AA contrast

---

### Page 4b: Guest Success — `/welcome/guest`

**Route:** `app/welcome/guest/page.tsx`
**Component:** `GuestSuccessPage`
**Auth guard:** Required — authenticated users only. If no session, redirect to `/signup`.
**Purpose:** Post-verification success page for guest-role users

**Data requirements:**

```typescript
// Required Convex queries for this page
const user = useQuery(api.users.getMe); // For display name
const preferences = useQuery(api.userPreferences.getMyPreferences); // For onboarding status

// Onboarding completion checks
const hasCitySelected = !!preferences?.currentMetroId;
const hasCuisinePrefs = (preferences?.cuisinePreferences?.length ?? 0) > 0;
```

**Page sections (in order):**

**Section 1: Welcome hero**

```
Headline:        You're in.

Subheadline:     The whisper network just got wider.
                 You're among the first to know what locals know.

Body:            Tenseats is where the best experiences are whispered — never listed.
                 Watch for invitations, early access, and city drops landing in your inbox.
```

**Section 2: Address book reminder**

```
Component:       <AddressBookReminder />

Heading:         Keep the good stuff out of spam.

Body:            Add supportteams@tenseats.io to your address book. That's where
                 your invitations, city launches, and early access drops will arrive.
                 Missing it means missing the table.

Display email:   supportteams@tenseats.io (copyable, styled as monospace or highlighted)
```

**Section 3: Next steps (onboarding nudges)**

Show as a checklist or card row. Mark steps complete if already done:

```
Step 1 (always complete): [✓] You're in — role confirmed
Step 2: [ ] Set your city → links to /settings/location or /onboarding/city
Step 3: [ ] Add your tastes → links to /settings/preferences or /onboarding/cuisine
```

Incomplete steps should have a short, inviting description:
- City: "Tell us where you eat. We'll show you what's hidden there."
- Cuisine: "Your tastes shape what you see. Pick your flavors."

**Section 4: Social links**

```
Component:       <SocialLinks />

Heading:         Follow what's happening.

Instagram:       https://www.instagram.com/tenseats
Pinterest:       [placeholder URL — professional page not yet live, use "#" with "(coming soon)" label]

Icon style:      Custom monoline SVG icons — no filled social media brand icons
                 Black/white only, matching brand aesthetic
```

**Design requirements:**
- Warm, editorial feel — not a dashboard
- Card-based or generous whitespace layout
- Onboarding checklist: use subtle progress indicator (partial line, not a progress bar percentage)
- The "You're in." headline should be large — display size (text-5xl or larger)
- The address book section should feel like a friendly insider tip, not a warning

---

### Page 4c: Vendor Success — `/welcome/vendor`

**Route:** `app/welcome/vendor/page.tsx`
**Component:** `VendorSuccessPage`
**Auth guard:** Required — authenticated users only. If no session, redirect to `/signup`.
**Purpose:** Post-verification success page for vendor-role users (chef, mixologist, creator, venueHost)

**Data requirements:**

```typescript
// Required Convex queries
const user = useQuery(api.users.getMe);
const role = useQuery(api.userRoles.getMyPrimaryRole); // "chef" | "mixologist" | "creator" | "venueHost"
const preferences = useQuery(api.userPreferences.getMyPreferences);

// Onboarding completion checks
const hasStripeConnected = !!user?.stripeCustomerId;
const hasCitySelected = !!preferences?.currentMetroId;
const hasCuisinePrefs = (preferences?.cuisinePreferences?.length ?? 0) > 0;
```

**Page sections (in order):**

**Section 1: Welcome hero**

Copy adapts slightly per role. Use role from `userRoles` query:

```
Headline:        You're in.

Subheadline (chef/mixologist/creator):
                 Your next table starts here.
                 Tenseats is where hidden experiences find an audience.

Subheadline (venueHost):
                 Your space is about to be discovered.
                 Tenseats connects venues to the curators who fill them.

Body:            You're among the first vendors on the platform. That means first access,
                 first bookings, and first claim to the guests who are already looking.
```

**Section 2: Stripe connect (optional)**

```
Component:       <StripeConnectStep complete={hasStripeConnected} />

Heading:         Connect your Stripe account.

Body (incomplete):
                 Get paid the moment someone books your experience. Stripe Express
                 Connect takes a few minutes — you can do it now or return to it
                 before launch.

CTA button:      Connect Stripe
CTA action:      Initiate Stripe Express Connect OAuth flow (see Stripe docs below)

Body (complete):
                 Stripe connected. You're set to receive payouts.

Note in code:    This step is OPTIONAL — the page must render correctly whether or
                 not Stripe is connected. Do not block access to other sections.
```

**Stripe Express Connect implementation:**

```typescript
// Use Stripe Connect Express OAuth — not Standard
// OAuth initiation URL pattern:
const stripeConnectUrl = `https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + "/api/stripe/connect/callback")}`;

// Required env vars:
// NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID — from Stripe Dashboard > Connect > Settings
// STRIPE_SECRET_KEY — server-side only
// NEXT_PUBLIC_APP_URL — e.g., https://app.tenseats.io

// OAuth callback route: app/api/stripe/connect/callback/route.ts
// On callback: exchange code for access_token, save stripeCustomerId to users table

// After saving:
await ctx.db.patch(userId, {
  stripeCustomerId: stripeAccountId, // The connected account ID (acct_xxx)
});
```

**Section 3: Zoho One recommendation**

```
Component:       <ZohoOneRecommendation />

Heading:         One tool stack for everything you run.

Body:            Tenseats partners with Zoho One — one flat fee for 50+ tools covering
                 CRM, invoicing, scheduling, email, and more. Built for independent vendors.

CTA:             Explore Zoho One →
CTA link:        https://go.zoho.com/Slvq
CTA style:       Text link or subtle secondary button — not prominent CTA
Note:            This is informational only. No technical integration required.
                 Do not track clicks or tie to onboarding completion.
```

**Section 4: Address book reminder**

Same component as guest page:

```
Component:       <AddressBookReminder />
(See guest page Section 2 for full copy)
```

**Section 5: Social links**

Same component as guest page:

```
Component:       <SocialLinks />
(See guest page Section 4 for full copy)
```

**Design requirements:**
- Same design language as guest success page — coherent across both
- Stripe connect section: card with clear optional badge ("Optional — complete before launch")
- Zoho One section: lower visual weight than Stripe — informational, not a task
- The "You're in." headline: same large display treatment as guest page

---

## Section 5: Onboarding Persistence Logic

### Query pattern: check completion via existing fields

Do not create a separate `onboardingProgress` table. Check completion by reading existing field values:

```typescript
// convex/queries/onboarding.ts
export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
    if (!user) return null;

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", user._id.toString()))
      .first();

    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return {
      hasRole: !!roleRecord,
      hasCity: !!preferences?.currentMetroId,
      hasCuisinePrefs: (preferences?.cuisinePreferences?.length ?? 0) > 0,
      hasStripeConnected: !!user.stripeCustomerId, // vendor check
      isProfileComplete: user.isProfileComplete ?? false,
    };
  },
});
```

### When to set `isProfileComplete`

Define "required" steps per role:

| Role | Required steps for isProfileComplete |
|---|---|
| guest | hasRole + hasCity |
| chef / mixologist / creator / venueHost | hasRole + hasCity (Stripe is optional, not required for completion) |

When all required steps are complete, set `isProfileComplete = true`:

```typescript
// convex/mutations/users.ts
export const updateProfileCompleteStatus = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId.toString()))
      .first();

    const hasRole = !!roleRecord;
    const hasCity = !!preferences?.currentMetroId;
    const isComplete = hasRole && hasCity;

    if (isComplete && !user?.isProfileComplete) {
      await ctx.db.patch(args.userId, { isProfileComplete: true });
    }
  },
});
```

### Returning user behavior

When a verified user navigates back to `/welcome/guest` or `/welcome/vendor`:

- Query `getOnboardingStatus` on mount
- Show completed steps with visual confirmation (checkmark, strikethrough, muted style)
- Do NOT re-prompt completed steps as if they're new tasks
- The pages should feel like a home base, not a one-time confirmation screen
- Steps that remain incomplete should remain prominent

---

## Section 6: Shared Components

### `<SocialLinks />`

```tsx
// components/post-signup/social-links.tsx
// Custom monoline SVG icons — do not use filled brand icon libraries

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.55c0-1.45.84-2.54 1.89-2.54.89 0 1.33.67 1.33 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.51 1.88 1.53 1.88 1.84 0 3.08-2.37 3.08-5.17 0-2.14-1.44-3.64-3.5-3.64-2.38 0-3.78 1.79-3.78 3.63 0 .72.28 1.49.62 1.91.07.08.08.16.06.24l-.23.94c-.04.14-.12.17-.28.1-1.04-.49-1.69-2.01-1.69-3.23 0-2.63 1.91-5.04 5.5-5.04 2.89 0 5.13 2.06 5.13 4.81 0 2.87-1.81 5.18-4.32 5.18-.84 0-1.64-.44-1.91-.96l-.52 1.94c-.19.72-.69 1.62-1.02 2.17.77.24 1.58.37 2.42.37 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
);

export function SocialLinks() {
  return (
    <div className="flex flex-col gap-3">
      <a
        href="https://www.instagram.com/tenseats"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
      >
        <InstagramIcon />
        <span>@tenseats on Instagram</span>
      </a>
      <a
        href="#"
        aria-label="Pinterest (coming soon)"
        className="flex items-center gap-3 text-sm opacity-50 cursor-not-allowed"
      >
        <PinterestIcon />
        <span>Pinterest <span className="text-xs">(coming soon)</span></span>
      </a>
    </div>
  );
}
```

### `<AddressBookReminder />`

```tsx
// components/post-signup/address-book-reminder.tsx
export function AddressBookReminder() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <p className="text-sm font-medium">Keep the good stuff out of spam.</p>
      <p className="text-sm text-muted-foreground">
        Add{" "}
        <span className="font-mono text-foreground">supportteams@tenseats.io</span>{" "}
        to your address book. That's where your invitations, city launches, and
        early access drops will arrive. Missing it means missing the table.
      </p>
    </div>
  );
}
```

---

## Section 7: Design Requirements

### Design system

All three pages share a coherent design language:

| Requirement | Specification |
|---|---|
| Color system | Black/white primary — `bg-black` or `bg-zinc-950` base, white text |
| Typography | Large display headline (`text-5xl` or larger), clean subheadlines |
| Components | Tailwind CSS + shadcn/ui |
| Accessibility | WCAG AA minimum — all text must pass contrast checks |
| Responsive | Mobile-first — design for 375px first, scale up |
| Icons | Custom monoline SVG — no Lucide social icons, no brand icon packages |

### Per-page design intent

| Page | Design intent |
|---|---|
| Almost There | Anticipation — dark, minimal, one clear next action |
| Guest Success | Warmth + belonging — editorial, generous whitespace, checklist feels like a concierge recommendation |
| Vendor Success | Professional + earned — same warmth, with a clear "what's next" action stack |

### What to avoid

- Generic green checkmark icons on success pages
- Progress percentage bars (use subtle step indicators instead)
- Corporate card patterns ("Step 1 of 3")
- AI-generated aesthetic defaults (purple gradients, generic glassmorphism)
- Any design that looks like a SaaS onboarding funnel

---

## Section 8: Gotchas and Edge Cases

### Edge case: user has no role

If `userRoles` has no row for the authenticated user when they reach `/verify-email`:

```typescript
// After OTP success, if getUserPrimaryRole returns null:
router.push("/onboarding/role"); // or wherever role selection lives in your app
// Do NOT route to either success page without a confirmed role
```

This should be rare — signup wizard should always write role. But handle it gracefully.

### Edge case: verify-email session guard

The `verify-email` page guards against unauthenticated access. Ensure the signup flow:
1. Creates the user session before redirecting to `/almost-there`
2. Does NOT redirect straight to `/verify-email` without session established
3. If session is lost (closed tab, expired), redirect to `/signup` — not a generic error

### Edge case: Stripe connect is optional

The vendor success page must work whether or not Stripe is connected. Never show an error state or block access to other sections if `stripeCustomerId` is null. The Stripe connect card should show as "complete" or "pending" based on field presence.

### Signup wizard must write role to `userRoles`

If the current signup wizard does not already insert into `userRoles` during signup, add this mutation before the user is redirected to `/almost-there`. The success pages rely on role being present. Check the existing signup flow before adding duplicate writes.

### Copy must be implemented verbatim

The copy in this document has been approved. Implement it exactly as written — do not paraphrase, simplify, or substitute. If you identify a copy error, flag it rather than silently changing it.

### Pinterest URL is a placeholder

The Pinterest icon links to `"#"` with a "coming soon" label. The professional Pinterest page URL is not finalized. Do not add a real URL unless you have been given one.

---

## Section 9: Implementation Order

Follow this order to avoid dependency issues:

1. **Shared components first:** `social-links.tsx`, `address-book-reminder.tsx`
2. **Convex queries:** `getUserPrimaryRole`, `getOnboardingStatus` (read-only, safe to add)
3. **Almost There page:** static page, no auth dependency
4. **Update verify-email routing:** replace hard-coded `/` redirect with role-based routing
5. **Guest success page:** simpler of the two success pages
6. **Vendor success page:** builds on guest page patterns
7. **Stripe connect:** add after pages are functional (can be a follow-up PR)
8. **`updateProfileCompleteStatus` mutation:** add after success pages are live

---

## Section 10: Verification Checklist

After implementation, verify:

- [ ] `/almost-there` renders correctly with email param
- [ ] `/verify-email` routes to correct success page after OTP (not `/` or `/feed`)
- [ ] `/welcome/guest` shows only for guest-role authenticated users
- [ ] `/welcome/vendor` shows only for vendor-role authenticated users
- [ ] Both success pages redirect unauthenticated users to `/signup`
- [ ] Onboarding checklist reflects actual completion state (not always empty)
- [ ] Stripe connect card shows complete state when `stripeCustomerId` is present
- [ ] `isProfileComplete` is set to `true` when required steps are done
- [ ] Social links render with monoline SVG icons (no brand icon packages)
- [ ] Address book reminder renders on both success pages
- [ ] All copy matches this document exactly
- [ ] Mobile layouts work at 375px
- [ ] WCAG AA contrast passes on all text elements
- [ ] `npx convex deploy` succeeds after any schema changes

---

## Appendix: Key URLs and External Services

| Service | URL / Config |
|---|---|
| Instagram | https://www.instagram.com/tenseats |
| Pinterest | Placeholder — URL TBD |
| Support email | supportteams@tenseats.io |
| Zoho One affiliate | https://go.zoho.com/Slvq |
| Stripe Connect docs | https://stripe.com/docs/connect/express-accounts |
| Convex dashboard | https://dashboard.convex.dev |
