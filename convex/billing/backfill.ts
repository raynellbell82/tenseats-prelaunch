"use node";

import { internalQuery, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
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
      .filter((u) => !u.stripeBillingCustomerId)
      .map((u) => ({
        _id: u._id,
        email: u.email,
        stripeSubscriptionId: u.stripeSubscriptionId,
        stripeBillingCustomerId: u.stripeBillingCustomerId,
      }));
  },
});

/**
 * Backfill a single Insider subscriber by syncing them to the @convex-dev/stripe component.
 * BILL-01: backfillSingleInsider — internalAction
 */
export const backfillSingleInsider = internalAction({
  args: {
    userId: v.id("users"),
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    customerId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, { userId, email }) => {
    try {
      const result = await ctx.runAction(
        internal.billing.subscriptions.syncCustomerToComponent,
        { userId: String(userId), email }
      );
      console.log(`backfillSingleInsider: synced user ${userId} -> customer ${result.customerId}`);
      return { success: true, customerId: result.customerId };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`backfillSingleInsider: failed for user ${userId}: ${message}`);
      return { success: false, error: message };
    }
  },
});

/**
 * Run the full backfill migration sequentially (not in parallel — avoids Stripe rate limits).
 * BILL-01: runBackfill — internalAction
 * Log a summary at the end: total, success count, failure count.
 */
export const runBackfill = internalAction({
  args: {},
  returns: v.object({
    total: v.number(),
    succeeded: v.number(),
    failed: v.number(),
  }),
  handler: async (ctx) => {
    const insiders = await ctx.runQuery(internal.billing.backfill.getActiveInsiders, {});
    console.log(`runBackfill: found ${insiders.length} unbackfilled Insider subscribers`);

    let succeeded = 0;
    let failed = 0;

    // Sequential — not Promise.all — to avoid Stripe rate limits
    for (const insider of insiders) {
      const result = await ctx.runAction(
        internal.billing.backfill.backfillSingleInsider,
        { userId: insider._id, email: insider.email }
      );
      if (result.success) {
        succeeded++;
      } else {
        failed++;
      }
    }

    console.log(`runBackfill complete: ${succeeded} succeeded, ${failed} failed of ${insiders.length} total`);
    return { total: insiders.length, succeeded, failed };
  },
});
