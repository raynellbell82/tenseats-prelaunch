import { internalMutation, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAppUser } from "../authHelpers";

// ---------------------------------------------------------------------------
// Public Mutation: saveStripeConnectAccount (ONBOARD-01)
// Called from /api/stripe/connect route via fetchAuthMutation (user JWT auth).
// Identifies the user from the auth context and saves the Stripe Express
// account ID immediately when the account is created (before onboarding).
// ---------------------------------------------------------------------------

export const saveStripeConnectAccount = mutation({
  args: {
    stripeConnectAccountId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeConnectAccountId }) => {
    const user = await getAppUser(ctx);

    if (!user) {
      throw new Error("[stripeConnect] Not authenticated");
    }

    await ctx.db.patch(user._id, {
      stripeConnectAccountId,
      stripeConnectComplete: false,
    });

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: confirmStripeConnect (ONBOARD-01)
// Called from /api/stripe/connect/webhook route via Convex HTTP API with
// admin auth (CONVEX_DEPLOY_KEY). Looks up user by account ID (low-volume,
// no index needed) and marks onboarding as complete.
// ---------------------------------------------------------------------------

export const confirmStripeConnect = internalMutation({
  args: {
    stripeConnectAccountId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeConnectAccountId }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.eq(q.field("stripeConnectAccountId"), stripeConnectAccountId),
      )
      .first();

    if (!user) {
      console.warn(
        `[stripeConnect] No user found for account ID: ${stripeConnectAccountId}`,
      );
      return null;
    }

    await ctx.db.patch(user._id, { stripeConnectComplete: true });

    return null;
  },
});

// ---------------------------------------------------------------------------
// Public Query: getStripeConnectStatus (ONBOARD-01)
// Called from vendor success page via useQuery — auto-updates when webhook
// writes completion, allowing the page to reactively show "Stripe Connected".
// No args — uses auth context to identify the user.
// ---------------------------------------------------------------------------

export const getStripeConnectStatus = query({
  args: {},
  returns: v.object({
    accountId: v.union(v.string(), v.null()),
    complete: v.boolean(),
  }),
  handler: async (ctx) => {
    const user = await getAppUser(ctx);

    if (!user) {
      return { accountId: null, complete: false };
    }

    return {
      accountId: user.stripeConnectAccountId ?? null,
      complete: user.stripeConnectComplete ?? false,
    };
  },
});
