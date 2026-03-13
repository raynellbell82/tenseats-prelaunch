import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

const membershipTier = v.union(
  v.literal("early_bird"),
  v.literal("founding"),
  v.literal("insider"),
);

const membershipCategory = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest"),
);

// ---------------------------------------------------------------------------
// Internal Mutation: fulfillMembership (PAY-03, PAY-04, PAY-05)
// Called by membershipWebhooks after Stripe checkout.session.completed.
// Patches user with membership fields, updates preRegistration status,
// and increments launchSlots completedCount.
//
// Idempotent: re-processing a completed preRegistration is a no-op (Gotcha #24).
// ---------------------------------------------------------------------------

export const fulfillMembership = internalMutation({
  args: {
    preRegistrationId: v.id("preRegistrations"),
    tier: membershipTier,
    category: membershipCategory,
    email: v.string(),
    stripeSessionId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    metroId: v.id("metros"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // 1. Idempotency check (Gotcha #24): if already completed, no-op
    const reg = await ctx.db.get(args.preRegistrationId);
    if (!reg) {
      console.error(
        `fulfillMembership: preRegistration not found: ${args.preRegistrationId}`,
      );
      return null;
    }
    if (reg.status === "completed") {
      console.log(
        `fulfillMembership: already completed, skipping: ${args.preRegistrationId}`,
      );
      return null;
    }

    // 2. Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const now = Date.now();

    if (user) {
      // 3. User exists -- patch with membership fields
      const patchData: Record<string, unknown> = {
        membershipTier: args.tier,
        membershipCategory: args.category,
        isMembershipActive: true,
        membershipStartedAt: now,
        isProfileComplete: false, // PAY-05: gate platform access
        preRegistrationId: args.preRegistrationId,
        updatedAt: now,
      };

      if (args.stripeCustomerId) {
        patchData.stripeCustomerId = args.stripeCustomerId;
      }
      if (args.stripeSubscriptionId) {
        patchData.stripeSubscriptionId = args.stripeSubscriptionId;
      }

      // 4. For insider tier, subscription-managed expiry (not time-based)
      //    membershipExpiresAt stays undefined/unset

      await ctx.db.patch(user._id, patchData);
    } else {
      // 5. User does NOT exist yet (pre-registration user who hasn't created account).
      //    Store fulfillment data on preRegistration so completeProfile can merge later.
      //    preRegistration already has tier and category from the queue entry.
      //    We store stripeSessionId, stripeCustomerId, stripeSubscriptionId here.
      console.log(
        `fulfillMembership: no user found for ${args.email}, storing on preRegistration`,
      );
    }

    // 6. Patch preRegistration: completed status + stripe session ID (Pitfall 7)
    await ctx.db.patch(reg._id, {
      status: "completed",
      completedAt: now,
      stripeSessionId: args.stripeSessionId,
      ...(args.stripeCustomerId
        ? { stripeCustomerId: args.stripeCustomerId }
        : {}),
      ...(args.stripeSubscriptionId
        ? { stripeSubscriptionId: args.stripeSubscriptionId }
        : {}),
    });

    // 7. Increment launchSlots completedCount
    const slot = await ctx.db
      .query("launchSlots")
      .withIndex("by_metro_category", (q) =>
        q.eq("metroId", args.metroId).eq("category", args.category),
      )
      .unique();

    if (slot) {
      await ctx.db.patch(slot._id, {
        completedCount: slot.completedCount + 1,
        updatedAt: now,
      });
    } else {
      console.error(
        `fulfillMembership: no launchSlot found for metro=${args.metroId} category=${args.category}`,
      );
    }

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Query: getUserByEmail
// Used by upgradeInsiderCategory action to read user data.
// ---------------------------------------------------------------------------

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.any(),
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// ---------------------------------------------------------------------------
// Internal Query: getUserById
// Used by upgradeInsiderCategory action to read user data by ID.
// ---------------------------------------------------------------------------

export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  returns: v.any(),
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: handleSubscriptionCancelled (PAY-06)
// Called by stripeWebhooks.processEvent on customer.subscription.deleted.
// Looks up user by email from subscription metadata, flips isMembershipActive
// to false. Idempotent: patching false to false is a no-op.
// ---------------------------------------------------------------------------

export const handleSubscriptionCancelled = internalMutation({
  args: {
    stripeEventId: v.string(),
    subscription: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeEventId, subscription }) => {
    // 1. Extract email from subscription metadata
    const email = subscription.metadata?.email as string | undefined;

    let user = null;

    if (email) {
      // Primary lookup: by email index
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
    }

    // 2. Fallback: scan for matching stripeSubscriptionId (no index, less efficient)
    if (!user && subscription.id) {
      console.warn(
        `handleSubscriptionCancelled: no user found for email "${email}", falling back to subscription ID scan`,
      );
      const allUsers = await ctx.db.query("users").collect();
      user = allUsers.find(
        (u: { stripeSubscriptionId?: string }) =>
          u.stripeSubscriptionId === subscription.id,
      ) ?? null;
    }

    if (!user) {
      console.error(
        `handleSubscriptionCancelled: no user found for subscription ${subscription.id}`,
      );
      // Mark as processed to avoid infinite retries on a user we can't find
      const event = await ctx.db
        .query("stripeEvents")
        .withIndex("by_stripe_event", (q) =>
          q.eq("stripeEventId", stripeEventId),
        )
        .unique();
      if (event) {
        await ctx.db.patch(event._id, {
          processed: true,
          processedAt: Date.now(),
        });
      }
      return null;
    }

    // 3. Defensive check: verify subscription ID matches
    if (
      user.stripeSubscriptionId &&
      user.stripeSubscriptionId !== subscription.id
    ) {
      console.warn(
        `handleSubscriptionCancelled: subscription ID mismatch for user ${user.email}: expected ${user.stripeSubscriptionId}, got ${subscription.id}`,
      );
    }

    // 4. Deactivate membership (idempotent -- patching false to false is a no-op)
    await ctx.db.patch(user._id, {
      isMembershipActive: false,
      updatedAt: Date.now(),
    });

    // 5. Mark event as processed
    const event = await ctx.db
      .query("stripeEvents")
      .withIndex("by_stripe_event", (q) =>
        q.eq("stripeEventId", stripeEventId),
      )
      .unique();
    if (event) {
      await ctx.db.patch(event._id, {
        processed: true,
        processedAt: Date.now(),
      });
    }

    console.log(
      `handleSubscriptionCancelled: deactivated membership for user ${user.email}`,
    );
    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: handlePaymentFailed (PAY-07)
// Called by stripeWebhooks.processEvent on invoice.payment_failed.
// Looks up user by invoice customer_email, flips isMembershipActive to false.
// Idempotent: patching false to false is a no-op.
// ---------------------------------------------------------------------------

export const handlePaymentFailed = internalMutation({
  args: {
    stripeEventId: v.string(),
    invoice: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeEventId, invoice }) => {
    // 1. Only handle subscription invoices
    const subscriptionId = invoice.subscription as string | undefined;
    if (!subscriptionId) {
      // Not a subscription invoice -- mark processed and skip
      const event = await ctx.db
        .query("stripeEvents")
        .withIndex("by_stripe_event", (q) =>
          q.eq("stripeEventId", stripeEventId),
        )
        .unique();
      if (event) {
        await ctx.db.patch(event._id, {
          processed: true,
          processedAt: Date.now(),
        });
      }
      return null;
    }

    // 2. Extract customer email from invoice
    const email = invoice.customer_email as string | undefined;

    let user = null;

    if (email) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
    }

    if (!user) {
      console.error(
        `handlePaymentFailed: no user found for invoice ${invoice.id} (email: ${email})`,
      );
      const event = await ctx.db
        .query("stripeEvents")
        .withIndex("by_stripe_event", (q) =>
          q.eq("stripeEventId", stripeEventId),
        )
        .unique();
      if (event) {
        await ctx.db.patch(event._id, {
          processed: true,
          processedAt: Date.now(),
        });
      }
      return null;
    }

    // 3. Verify subscription ID matches
    if (
      user.stripeSubscriptionId &&
      user.stripeSubscriptionId !== subscriptionId
    ) {
      console.warn(
        `handlePaymentFailed: subscription ID mismatch for user ${user.email}: expected ${user.stripeSubscriptionId}, got ${subscriptionId}`,
      );
    }

    // 4. Deactivate membership (idempotent)
    await ctx.db.patch(user._id, {
      isMembershipActive: false,
      updatedAt: Date.now(),
    });

    // 5. Mark event as processed
    const event = await ctx.db
      .query("stripeEvents")
      .withIndex("by_stripe_event", (q) =>
        q.eq("stripeEventId", stripeEventId),
      )
      .unique();
    if (event) {
      await ctx.db.patch(event._id, {
        processed: true,
        processedAt: Date.now(),
      });
    }

    console.log(
      `handlePaymentFailed: deactivated membership for user ${user.email}`,
    );
    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Mutation: updateUserCategory
// Called by upgradeInsiderCategory action after Stripe subscription update.
// Patches the user's membershipCategory.
// ---------------------------------------------------------------------------

export const updateUserCategory = internalMutation({
  args: {
    userId: v.id("users"),
    newCategory: membershipCategory,
  },
  returns: v.null(),
  handler: async (ctx, { userId, newCategory }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      console.error(`updateUserCategory: user not found: ${userId}`);
      return null;
    }

    await ctx.db.patch(userId, {
      membershipCategory: newCategory,
      updatedAt: Date.now(),
    });

    return null;
  },
});
