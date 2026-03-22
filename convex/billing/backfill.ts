"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";

// Use makeFunctionReference to avoid circular type inference:
// backfill.ts -> internal (_generated/api) -> billing.backfill -> backfill.ts
const syncCustomerToComponent = makeFunctionReference<
  "action",
  { userId: string; email: string },
  { customerId: string }
>("billing/subscriptions:syncCustomerToComponent");

const getActiveInsiders = makeFunctionReference<
  "query",
  Record<string, never>,
  Array<{ _id: string; email: string }>
>("billing/billingHelpers:getActiveInsiders");

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
        syncCustomerToComponent,
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
    const insiders = await ctx.runQuery(getActiveInsiders, {});
    console.log(`runBackfill: found ${insiders.length} unbackfilled Insider subscribers`);

    let succeeded = 0;
    let failed = 0;

    // Use makeFunctionReference to avoid circular type inference (backfill.ts -> internal -> backfill.ts)
    const backfillSingleRef = makeFunctionReference<
      "action",
      { userId: string; email: string },
      { success: boolean; customerId?: string; error?: string }
    >("billing/backfill:backfillSingleInsider");

    // Sequential — not Promise.all — to avoid Stripe rate limits
    for (const insider of insiders) {
      const result = await ctx.runAction(
        backfillSingleRef,
        { userId: String(insider._id), email: insider.email }
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
