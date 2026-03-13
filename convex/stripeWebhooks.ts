import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Internal Mutation: markEventProcessed
// Marks a Stripe event record as processed in the stripeEvents table.
// Called by webhook handlers after successful fulfillment to prevent
// duplicate processing on Stripe retries.
// ---------------------------------------------------------------------------

export const markEventProcessed = internalMutation({
  args: {
    stripeEventId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeEventId }) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .filter((q) => q.eq(q.field("stripeEventId"), stripeEventId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        processed: true,
        processedAt: Date.now(),
      });
    }

    return null;
  },
});
