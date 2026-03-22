import { internalQuery, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";

/**
 * Query all active Insider subscribers who have not yet been backfilled.
 * Returns users with membershipTier === "insider" and isMembershipActive === true
 * who are missing stripeBillingCustomerId.
 * BILL-01: getActiveInsiders — internalQuery
 */
export const getActiveInsiders = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      email: v.string(),
      stripeSubscriptionId: v.optional(v.string()),
      stripeBillingCustomerId: v.optional(v.string()),
    })
  ),
  handler: async (ctx): Promise<Array<{
    _id: Doc<"users">["_id"];
    email: string;
    stripeSubscriptionId?: string;
    stripeBillingCustomerId?: string;
  }>> => {
    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("membershipTier"), "insider"),
          q.eq(q.field("isMembershipActive"), true)
        )
      )
      .collect();

    // Only return users who need backfilling (no billing customer ID yet)
    return users
      .filter((u): u is typeof u & { email: string } => !u.stripeBillingCustomerId && !!u.email)
      .map((u) => ({
        _id: u._id,
        email: u.email,
        stripeSubscriptionId: u.stripeSubscriptionId,
        stripeBillingCustomerId: u.stripeBillingCustomerId,
      }));
  },
});

/**
 * Persist the billing component customer ID to the users table.
 * BILL-04: internalMutation — only called by internal actions, never from client.
 */
export const setStripeBillingCustomerId = internalMutation({
  args: {
    userId: v.id("users"),
    customerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { userId, customerId }) => {
    await ctx.db.patch(userId, { stripeBillingCustomerId: customerId });
    return null;
  },
});
