import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAppUser } from "../authHelpers";

// ---------------------------------------------------------------------------
// Internal Mutation: saveStripeConnectAccount (ONBOARD-01)
// Called from /api/stripe/connect route via ConvexHttpClient with admin auth.
// Looks up user by email and saves the Stripe Express account ID immediately
// when the account is created (before the user completes onboarding).
// ---------------------------------------------------------------------------

export const saveStripeConnectAccount = internalMutation({
  args: {
    email: v.string(),
    stripeConnectAccountId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { email, stripeConnectAccountId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error(`[stripeConnect] No user found for email: ${email}`);
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
// Called from /api/stripe/connect/webhook route when Stripe sends an
// account.updated event with details_submitted === true.
// Looks up user by account ID (low-volume, no index needed) and marks complete.
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
