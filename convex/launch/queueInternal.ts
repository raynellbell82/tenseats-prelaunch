import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { createNotification } from "../notificationHelpers";

const membershipCategory = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest"),
);

// ---------------------------------------------------------------------------
// Internal Query: getLaunchConfig
// Returns the singleton launchConfig document for lifetime offer checks.
// ---------------------------------------------------------------------------

export const getLaunchConfig = internalQuery({
  args: {},
  returns: v.union(
    v.object({
      isLifetimeOfferActive: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const config = await ctx.db.query("launchConfig").first();
    if (!config) return null;
    return { isLifetimeOfferActive: config.isLifetimeOfferActive };
  },
});

// ---------------------------------------------------------------------------
// Internal Query: getPreRegistrationById
// Used by sendVerificationEmail (action) to read pre-registration data.
// ---------------------------------------------------------------------------

export const getPreRegistrationById = internalQuery({
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
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.preRegistrationId);
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: confirmVerification
// Called by verifyEmail action after HMAC token validation.
// Transitions status from "registered" -> "verified" and triggers processQueue.
// ---------------------------------------------------------------------------

export const confirmVerification = internalMutation({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.preRegistrationId);
    if (!reg || reg.status !== "registered") return null;

    await ctx.db.patch(reg._id, { status: "verified" });

    // Trigger queue processing for this metro+category
    await ctx.scheduler.runAfter(
      0,
      internal.launch.queueInternal.processQueue,
      { metroId: reg.metroId, category: reg.category },
    );

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: processQueue (QUEU-03, QUEU-04, QUEU-08, QUEU-10)
// FIFO auto-invite: reads slot capacity, invites next verified user,
// increments invitedCount, schedules 10-min expiry.
// OCC serializes concurrent mutations on the same slot document (QUEU-08).
// ---------------------------------------------------------------------------

export const processQueue = internalMutation({
  args: {
    metroId: v.id("metros"),
    category: membershipCategory,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // 1. Read launch slot
    const slot = await ctx.db
      .query("launchSlots")
      .withIndex("by_metro_category", (q) =>
        q.eq("metroId", args.metroId).eq("category", args.category),
      )
      .unique();

    if (!slot || slot.isClosed) return null;

    // 2. Check capacity (invitedCount is the serialization point for OCC)
    if (slot.invitedCount >= slot.cap) return null;

    // 3. Get next verified user in FIFO order (by _creationTime default)
    const nextUser = await ctx.db
      .query("preRegistrations")
      .withIndex("by_metro_category_status", (q) =>
        q
          .eq("metroId", args.metroId)
          .eq("category", args.category)
          .eq("status", "verified"),
      )
      .first();

    if (!nextUser) return null;

    // 4. Read config for invite window (default 10 minutes)
    const config = await ctx.db.query("launchConfig").first();
    const windowMs = config?.inviteWindowMs ?? 600_000;
    const now = Date.now();
    const expiresAt = now + windowMs;

    // 5. Schedule expiry
    const scheduleId = await ctx.scheduler.runAt(
      expiresAt,
      internal.launch.queueInternal.expireInvite,
      { preRegistrationId: nextUser._id },
    );

    // 6. Update preRegistration to "invited"
    await ctx.db.patch(nextUser._id, {
      status: "invited",
      invitedAt: now,
      inviteExpiresAt: expiresAt,
      inviteScheduleId: scheduleId,
    });

    // 7. Increment slot invited counter (NOT completedCount -- Gotcha #5)
    await ctx.db.patch(slot._id, {
      invitedCount: slot.invitedCount + 1,
      updatedAt: now,
    });

    // 8. QUEU-10: Best-effort in-app notification if user has an account
    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", nextUser.email))
      .first();

    if (appUser) {
      await createNotification(ctx, {
        userId: appUser._id,
        type: "system",
        targetType: "preRegistration",
        targetId: String(nextUser._id),
        message:
          "You've been invited! Complete your membership signup within 10 minutes.",
      });
    }

    // 9. HOME-03: Schedule invite email (internalAction -- cannot fetch in mutation)
    await ctx.scheduler.runAfter(
      0,
      internal.launch.queueEmail.sendInviteEmail,
      { preRegistrationId: nextUser._id },
    );

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: expireInvite (QUEU-05)
// Scheduled by processQueue via ctx.scheduler.runAt().
// Guards against already-completed/cancelled status before acting.
// Decrements invitedCount and re-triggers processQueue for next user.
// ---------------------------------------------------------------------------

export const expireInvite = internalMutation({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.preRegistrationId);
    // Guard: only expire if still in "invited" status
    if (!reg || reg.status !== "invited") return null;

    // Mark as expired
    await ctx.db.patch(reg._id, { status: "invite_expired" });

    // Decrement slot counter
    const slot = await ctx.db
      .query("launchSlots")
      .withIndex("by_metro_category", (q) =>
        q.eq("metroId", reg.metroId).eq("category", reg.category),
      )
      .unique();

    if (slot) {
      await ctx.db.patch(slot._id, {
        invitedCount: Math.max(0, slot.invitedCount - 1),
        updatedAt: Date.now(),
      });
    }

    // Trigger processQueue for next user in the same metro+category
    await ctx.scheduler.runAfter(
      0,
      internal.launch.queueInternal.processQueue,
      { metroId: reg.metroId, category: reg.category },
    );

    return null;
  },
});
