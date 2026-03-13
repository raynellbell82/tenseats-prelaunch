import { mutation, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

const CATEGORIES = [
  "chef",
  "mixologist",
  "creator",
  "venueHost",
  "guest",
] as const;

/**
 * Scheduled internal mutation that closes the lifetime offer.
 * Fired by the scheduler at the configured deadline.
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

/**
 * Enable all launch feature flags.
 * Called via CLI with admin key for self-hosted deployments.
 */
export const enableFeatureFlags = internalMutation({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const config = await ctx.db.query("launchConfig").first();
    if (!config) return null;
    await ctx.db.patch(config._id, {
      featureBannerEnabled: true,
      featureQueueEnabled: true,
      featureCheckoutEnabled: true,
      featureCountdownEnabled: true,
      updatedAt: Date.now(),
    });
    return "enabled";
  },
});

/**
 * Seed the launchConfig singleton.
 * Idempotent: skips if a config already exists.
 * Schedules closeLifetimeOffer to run at the deadline.
 */
export const seedLaunchConfig: typeof mutation = mutation({
  args: { deadline: v.optional(v.number()) },
  returns: v.object({ skipped: v.boolean(), id: v.id("launchConfig") }),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("launchConfig").first();
    if (existing) {
      return { skipped: true, id: existing._id };
    }

    const deadline = args.deadline ?? Date.now() + 30 * 24 * 60 * 60 * 1000;

    const scheduleId = await ctx.scheduler.runAt(
      deadline,
      internal.launch.seed.closeLifetimeOffer,
      {},
    );

    const now = Date.now();
    const id = await ctx.db.insert("launchConfig", {
      deadline,
      deadlineScheduleId: scheduleId,
      isLifetimeOfferActive: true,
      featureBannerEnabled: false,
      featureQueueEnabled: false,
      featureCheckoutEnabled: false,
      featureCountdownEnabled: false,
      inviteWindowMs: 600_000,
      createdAt: now,
      updatedAt: now,
    });

    return { skipped: false, id };
  },
});

/**
 * Seed launchSlots -- one row per active metro per category.
 * Idempotent: skips existing metro/category pairs.
 */
export const seedAllSlots = mutation({
  args: { capPerSlot: v.optional(v.number()) },
  returns: v.object({
    created: v.number(),
    skipped: v.number(),
    total: v.number(),
  }),
  handler: async (ctx, args) => {
    const cap = args.capPerSlot ?? 5;

    const metros = await ctx.db
      .query("metros")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    let created = 0;
    let skipped = 0;
    const now = Date.now();

    for (const metro of metros) {
      for (const category of CATEGORIES) {
        const existing = await ctx.db
          .query("launchSlots")
          .withIndex("by_metro_category", (q) =>
            q.eq("metroId", metro._id).eq("category", category),
          )
          .unique();

        if (existing) {
          skipped++;
          continue;
        }

        await ctx.db.insert("launchSlots", {
          metroId: metro._id,
          category,
          cap,
          invitedCount: 0,
          completedCount: 0,
          createdAt: now,
          updatedAt: now,
        });
        created++;
      }
    }

    return { created, skipped, total: metros.length * CATEGORIES.length };
  },
});
