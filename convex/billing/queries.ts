import { query } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { authComponent } from "../auth";

/**
 * Get the authenticated user's active subscription.
 * WHB-03: Uses authComponent.safeGetAuthUser — no getUserIdentity() calls.
 * WHB-05: Query in convex/billing/queries.ts per requirement.
 *
 * Returns the first subscription for the user, or null if none exists.
 * Delegates to components.stripe.public.listSubscriptionsByUserId.
 */
export const getMySubscription = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) return null;
    const userId = String(authUser._id);

    const subscriptions = await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId }
    );
    return subscriptions[0] ?? null;
  },
});

/**
 * Get the authenticated user's payment history.
 * WHB-03: Uses authComponent.safeGetAuthUser — no getUserIdentity() calls.
 * WHB-05: Query in convex/billing/queries.ts per requirement.
 *
 * Returns all payments for the user, or empty array if unauthenticated.
 * Delegates to components.stripe.public.listPaymentsByUserId.
 */
export const getMyPaymentHistory = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) return [];
    const userId = String(authUser._id);

    return await ctx.runQuery(
      components.stripe.public.listPaymentsByUserId,
      { userId }
    );
  },
});
