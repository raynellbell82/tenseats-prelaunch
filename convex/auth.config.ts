import type { AuthConfig } from "convex/server";

// Custom auth config provider for custom domain setup
// - CONVEX_SITE_URL = https://api.tenseats.io (Convex backend)
// - SITE_URL = https://tenseats.io (Next.js frontend)
// IMPORTANT: The issuer must match CONVEX_SITE_URL because that's what the
// Better Auth convex plugin uses when signing JWT tokens (see line 177 in
// @convex-dev/better-auth/src/plugins/convex/index.ts)
export default {
  providers: [{
    type: "customJwt",
    // Token issuer = CONVEX_SITE_URL (the convex plugin signs JWTs with this issuer)
    issuer: process.env.CONVEX_SITE_URL || "http://localhost:3000",
    applicationID: "convex",
    algorithm: "RS256",
    // JWKS endpoint includes /http prefix for self-hosted Convex HTTP actions
    jwks: `${process.env.CONVEX_SITE_URL}/http/api/auth/convex/jwks`,
  }],
} satisfies AuthConfig;
