import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAppUser } from "../authHelpers";

/**
 * Get the authenticated user's membership status.
 * MEM-01: Uses getAppUser (~1ms via ctx.auth.getUserIdentity + by_email index)
 * instead of authComponent.getAuthUser (~900ms).
 *
 * Returns membership tier, active status, lifetime flag, and billing customer flag.
 * Returns null for unauthenticated users or users with no membership tier.
 */
export const getMyMembership = query({
  args: {},
  returns: v.union(
    v.object({
      tier: v.union(v.string(), v.null()),
      isActive: v.boolean(),
      isLifetime: v.boolean(),
      hasBillingCustomer: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await getAppUser(ctx);
    if (!user) return null;

    const tier = user.membershipTier ?? null;
    const isLifetime = tier === "early_bird" || tier === "founding";

    return {
      tier,
      isActive: user.isMembershipActive ?? false,
      isLifetime,
      hasBillingCustomer: !!user.stripeBillingCustomerId,
    };
  },
});
