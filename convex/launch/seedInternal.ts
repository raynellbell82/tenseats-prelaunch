import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Scheduled internal mutation that closes the lifetime offer.
 * Fired by the scheduler at the configured deadline.
 * Placed in a separate file from seed.ts to break the circular type reference
 * that occurred when seed.ts referenced internal.launch.seed.closeLifetimeOffer
 * (i.e., itself).
 */
export const closeLifetimeOffer = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const config = await ctx.db.query("launchConfig").first();
    if (!config) return null;

    await ctx.db.patch(config._id, {
      isLifetimeOfferActive: false,
      updatedAt: Date.now(),
    });
    return null;
  },
});
