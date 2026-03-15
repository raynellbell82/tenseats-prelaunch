# Requirements: Tenseats Pre-Launch Site

**Defined:** 2026-03-14
**Core Value:** Convert visitors into Early Bird or Founding members via Stripe checkout while telling the Tenseats story across 32 city-specific landing pages — all on a shared backend so accounts carry over seamlessly when the full marketplace launches.

## v1.2 Requirements

Requirements for Post-Signup Experience milestone. New pages for verification and success flows.

### Schema Coordination

- [x] **SCHEMA-01**: Generate a comprehensive prompt document for the main Tenseats marketplace repo that covers: onboarding progress schema additions, the "almost there" verification page, guest success page, vendor success page with Stripe connect step, Zoho One messaging, social links, and onboarding persistence logic — so the main app has this flow built in when it launches
- [x] **SCHEMA-02**: Before building onboarding persistence (ONBOARD-01/02), verify the schema change has been deployed to the shared Convex backend

### Verification UX

- [x] **VERIFY-01**: After queue signup, user is redirected to a shared "almost there" page showing "check your email" messaging with warm, branded design
- [x] **VERIFY-02**: The "almost there" page works for both guest and vendor signups (shared page, not role-specific)

### Guest Success

- [x] **GSUCCESS-01**: After OTP verification, guest users see a dedicated success page with inspirational welcome-to-the-community messaging
- [x] **GSUCCESS-02**: Guest success page reminds user to add `supportteams@tenseats.io` to their address book
- [x] **GSUCCESS-03**: Guest success page displays social media links with custom icons for Instagram (`https://www.instagram.com/tenseats`) and Pinterest (placeholder URL)

### Vendor Success

- [x] **VSUCCESS-01**: After OTP verification, vendor users (Chef, Mixologist, Venue Host, Creator) see a dedicated success page with welcome messaging
- [x] **VSUCCESS-02**: Vendor success page offers optional "Connect your Stripe account" as first onboarding step (can do now or wait until launch)
- [x] **VSUCCESS-03**: Vendor success page explains back-of-house setup with Zoho One recommendation ("one fee for 50+ best-in-class tools") and links to `https://go.zoho.com/Slvq`
- [x] **VSUCCESS-04**: Vendor success page displays same social media links as guest page

### Onboarding Persistence

- [x] **ONBOARD-01**: Completed onboarding steps are stored per user (requires Convex schema addition)
- [ ] **ONBOARD-02**: When a user logs back in, they see their progress and can resume from where they left off without repeating completed steps

### Social Icons

- [x] **SOCIAL-01**: Custom Instagram icon generated via Web Asset Generator
- [x] **SOCIAL-02**: Custom Pinterest icon generated via Web Asset Generator

### Design Quality

- [x] **DESIGN-01**: All three pages (almost-there, guest success, vendor success) use distinctive, high-quality frontend design — not generic AI aesthetics

## Future Requirements

### Post-v1.2

- **SOCIAL-03**: Pinterest professional page URL (replace placeholder when created)
- **ONBOARD-03**: Additional onboarding steps beyond Stripe connect (menu setup, venue details, etc.)
- **ONBOARD-04**: Onboarding progress dashboard/checklist visible from user profile

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full vendor onboarding wizard | v1.2 is light-touch — connect Stripe + info only, full wizard is post-launch |
| Zoho One integration/SSO | Just a recommendation link, no technical integration |
| Email sending from prelaunch site | Emails sent via existing Convex/Better Auth infrastructure |
| Modifying existing launch flow pages | Only adding new pages, not changing /launch or /join |
| Main app repo code changes | Prompt document generated for separate implementation |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHEMA-01 | Phase 20 | Complete |
| SCHEMA-02 | Phase 20 | Complete |
| SOCIAL-01 | Phase 21 | Complete |
| SOCIAL-02 | Phase 21 | Complete |
| VERIFY-01 | Phase 22 | Complete |
| VERIFY-02 | Phase 22 | Complete |
| DESIGN-01 | Phase 22 | Complete |
| GSUCCESS-01 | Phase 23 | Complete |
| GSUCCESS-02 | Phase 23 | Complete |
| GSUCCESS-03 | Phase 23 | Complete |
| VSUCCESS-01 | Phase 24 | Complete |
| VSUCCESS-02 | Phase 24 | Complete |
| VSUCCESS-03 | Phase 24 | Complete |
| VSUCCESS-04 | Phase 24 | Complete |
| ONBOARD-01 | Phase 25 | Complete |
| ONBOARD-02 | Phase 25 | Pending |

**Coverage:**
- v1.2 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-14 after roadmap creation*
