import { mutation, query } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { getAppUserId } from "../authHelpers";

const membershipCategory = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest"),
);

// ---------------------------------------------------------------------------
// Public Mutation: joinQueue (QUEU-01)
// Pre-registration entry point. No auth required -- users join before signup.
// Validates metro/slot, checks for duplicates, inserts pre-registration,
// and schedules verification email.
// ---------------------------------------------------------------------------

export const joinQueue = mutation({
  args: {
    email: v.string(),
    metroId: v.id("metros"),
    category: membershipCategory,
  },
  returns: v.id("preRegistrations"),
  handler: async (ctx, args) => {
    // Validate metro exists
    const metro = await ctx.db.get(args.metroId);
    if (!metro) throw new ConvexError("Metro not found");

    // Check slot exists and is open
    const slot = await ctx.db
      .query("launchSlots")
      .withIndex("by_metro_category", (q) =>
        q.eq("metroId", args.metroId).eq("category", args.category),
      )
      .unique();
    if (!slot) throw new ConvexError("Slot not found for this metro and category");
    if (slot.isClosed) throw new ConvexError("This slot is closed");

    // Check for duplicate: same email + metro + category with active status
    const existing = await ctx.db
      .query("preRegistrations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) =>
        q.and(
          q.eq(q.field("metroId"), args.metroId),
          q.eq(q.field("category"), args.category),
          q.neq(q.field("status"), "invite_expired"),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .first();
    if (existing) throw new ConvexError("Already registered for this slot");

    // Insert pre-registration with status "registered"
    const id = await ctx.db.insert("preRegistrations", {
      email: args.email,
      metroId: args.metroId,
      category: args.category,
      status: "registered",
      createdAt: Date.now(),
    });

    // Schedule verification email (fire-and-forget)
    await ctx.scheduler.runAfter(
      0,
      internal.launch.queueEmail.sendVerificationEmail,
      { preRegistrationId: id },
    );

    return id;
  },
});

// ---------------------------------------------------------------------------
// Public Query: getQueuePosition (QUEU-06)
// Returns the user's 1-indexed position among verified users in the same
// metro+category slot, plus total verified count. Returns null if the
// pre-registration is not in "verified" status.
// CRITICAL: No Date.now() -- pure document count only (Gotcha #13).
// ---------------------------------------------------------------------------

export const getQueuePosition = query({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.union(
    v.object({ position: v.number(), total: v.number() }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.preRegistrationId);
    if (!reg || reg.status !== "verified") return null;

    // Count verified users ahead (created before this user) in same slot
    const ahead = await ctx.db
      .query("preRegistrations")
      .withIndex("by_metro_category_status", (q) =>
        q
          .eq("metroId", reg.metroId)
          .eq("category", reg.category)
          .eq("status", "verified"),
      )
      .filter((q) => q.lt(q.field("createdAt"), reg.createdAt))
      .collect();

    // Count total verified in same slot
    const totalVerified = await ctx.db
      .query("preRegistrations")
      .withIndex("by_metro_category_status", (q) =>
        q
          .eq("metroId", reg.metroId)
          .eq("category", reg.category)
          .eq("status", "verified"),
      )
      .collect();

    return { position: ahead.length + 1, total: totalVerified.length };
  },
});

// ---------------------------------------------------------------------------
// Public Query: getPreRegistration (QUEU-07)
// Returns the full pre-registration document for UI consumption (status,
// invitedAt, inviteExpiresAt, etc). Returns null if not found.
// ---------------------------------------------------------------------------

export const getPreRegistration = query({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.union(
    v.object({
      _id: v.id("preRegistrations"),
      _creationTime: v.number(),
      email: v.string(),
      userId: v.optional(v.string()),
      metroId: v.id("metros"),
      category: membershipCategory,
      status: v.union(
        v.literal("registered"),
        v.literal("verified"),
        v.literal("invited"),
        v.literal("completed"),
        v.literal("invite_expired"),
        v.literal("cancelled"),
      ),
      invitedAt: v.optional(v.number()),
      inviteExpiresAt: v.optional(v.number()),
      inviteScheduleId: v.optional(v.id("_scheduled_functions")),
      completedAt: v.optional(v.number()),
      stripeSessionId: v.optional(v.string()),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.preRegistrationId);
  },
});

// ---------------------------------------------------------------------------
// Public Query: getCheckoutData (PAY-09)
// Returns checkout page data for invited users, including inviteExpiresAt
// for client-side countdown. No Date.now() -- raw timestamp only (Gotcha #13).
// ---------------------------------------------------------------------------

export const getCheckoutData = query({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.union(
    v.object({
      tier: v.union(
        v.literal("early_bird"),
        v.literal("founding"),
        v.literal("insider"),
      ),
      category: membershipCategory,
      email: v.string(),
      inviteExpiresAt: v.number(),
      metroId: v.id("metros"),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.preRegistrationId);
    if (!reg || reg.status !== "invited") return null;
    if (!reg.inviteExpiresAt) return null;

    // Default to early_bird tier -- client will let user choose on checkout page
    // The tier is selected at checkout time, not at invite time
    return {
      tier: "early_bird" as const,
      category: reg.category,
      email: reg.email,
      inviteExpiresAt: reg.inviteExpiresAt,
      metroId: reg.metroId,
    };
  },
});

// ---------------------------------------------------------------------------
// Public Mutation: rejoinQueue (QUEU-07)
// Allows a user whose invite expired to rejoin at the back of the queue.
// Cancels the old record, inserts a new one, and triggers fresh verification.
// No auth required (same as joinQueue -- pre-registration is pre-signup).
// ---------------------------------------------------------------------------

export const rejoinQueue = mutation({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.id("preRegistrations"),
  handler: async (ctx, args) => {
    const old = await ctx.db.get(args.preRegistrationId);
    if (!old) throw new ConvexError("Pre-registration not found");
    if (old.status !== "invite_expired") {
      throw new ConvexError("Can only rejoin from an expired invite");
    }

    // Cancel the old record
    await ctx.db.patch(old._id, { status: "cancelled" });

    // Insert new pre-registration at back of queue
    const newId = await ctx.db.insert("preRegistrations", {
      email: old.email,
      metroId: old.metroId,
      category: old.category,
      status: "registered",
      createdAt: Date.now(),
    });

    // Schedule verification email for the new record
    await ctx.scheduler.runAfter(
      0,
      internal.launch.queueEmail.sendVerificationEmail,
      { preRegistrationId: newId },
    );

    return newId;
  },
});

// ---------------------------------------------------------------------------
// Public Query: getSlotGrid (UI-01)
// Returns all launch slots with metro display names for the /launch page
// slot grid. No auth required -- public page.
// ---------------------------------------------------------------------------

export const getSlotGrid = query({
  args: {},
  returns: v.array(
    v.object({
      metroId: v.id("metros"),
      metroDisplayName: v.string(),
      category: membershipCategory,
      cap: v.number(),
      completedCount: v.number(),
      isClosed: v.optional(v.boolean()),
      spotsRemaining: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const slots = await ctx.db.query("launchSlots").collect();
    const results = [];
    for (const slot of slots) {
      const metro = await ctx.db.get(slot.metroId);
      if (!metro) continue;
      results.push({
        metroId: slot.metroId,
        metroDisplayName: metro.displayName,
        category: slot.category,
        cap: slot.cap,
        completedCount: slot.completedCount,
        isClosed: slot.isClosed,
        spotsRemaining: Math.max(0, slot.cap - slot.completedCount),
      });
    }
    return results;
  },
});

// ---------------------------------------------------------------------------
// Public Query: getLaunchConfig (UI-10)
// Returns the singleton launch config for deadline and feature flags.
// No auth required -- public page.
// ---------------------------------------------------------------------------

export const getLaunchConfig = query({
  args: {},
  returns: v.union(
    v.object({
      deadline: v.number(),
      isLifetimeOfferActive: v.boolean(),
      featureQueueEnabled: v.optional(v.boolean()),
      featureBannerEnabled: v.optional(v.boolean()),
      featureCountdownEnabled: v.optional(v.boolean()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const config = await ctx.db.query("launchConfig").first();
    if (!config) return null;
    return {
      deadline: config.deadline,
      isLifetimeOfferActive: config.isLifetimeOfferActive,
      featureQueueEnabled: config.featureQueueEnabled,
      featureBannerEnabled: config.featureBannerEnabled,
      featureCountdownEnabled: config.featureCountdownEnabled,
    };
  },
});

// ---------------------------------------------------------------------------
// Public Query: getAggregateStats (HOME-01)
// Returns aggregate slot stats and queue depth for the homepage banner.
// No auth required -- public data.
// ---------------------------------------------------------------------------

export const getAggregateStats = query({
  args: {},
  returns: v.object({
    totalFilled: v.number(),
    totalAvailable: v.number(),
    queueDepth: v.number(),
  }),
  handler: async (ctx) => {
    const slots = await ctx.db.query("launchSlots").collect();
    let totalFilled = 0;
    let totalAvailable = 0;
    for (const slot of slots) {
      totalFilled += slot.completedCount;
      totalAvailable += slot.cap;
    }
    const verified = await ctx.db
      .query("preRegistrations")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "verified"))
      .collect();
    return { totalFilled, totalAvailable, queueDepth: verified.length };
  },
});

// ---------------------------------------------------------------------------
// Public Query: getUserRole (VERIFY-01)
// Returns the first active role for the authenticated user from the userRoles
// table, or null if not authenticated or no role found.
// Used by verify-email-form after OTP verification for role-based routing.
// ---------------------------------------------------------------------------

const VENDOR_ROLES = new Set(["chef", "mixologist", "venueHost", "creator"]);

export const getUserRole = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const userId = await getAppUserId(ctx);
    if (!userId) return null;

    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!roleDoc) return null;
    return roleDoc.role;
  },
});
