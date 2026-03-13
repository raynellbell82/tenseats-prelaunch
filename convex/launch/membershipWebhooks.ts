"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import Stripe from "stripe";

const membershipCategory = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest"),
);

/**
 * Create Stripe client instance inside handlers, not at module level.
 * Convex analyzes modules before environment variables are available.
 */
function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// ---------------------------------------------------------------------------
// Internal Action: handleMembershipCheckoutCompleted (PAY-03)
// Called by stripeWebhooks.processEvent when checkout.session.completed
// has metadata.type === "membership".
//
// Extracts metadata from the Stripe session, calls fulfillMembership
// mutation for DB writes, then marks the event as processed.
//
// Error handling: if fulfillMembership throws, we do NOT mark as processed
// so Stripe will retry the webhook. Same pattern as handleCheckoutCompleted.
// ---------------------------------------------------------------------------

export const handleMembershipCheckoutCompleted = internalAction({
  args: {
    stripeEventId: v.string(),
    session: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, { stripeEventId, session }) => {
    // 1. Extract metadata
    const metadata = session.metadata || {};
    const {
      type,
      preRegistrationId,
      tier,
      category,
      metroId,
      email,
    } = metadata;

    // 2. Defensive validation
    if (type !== "membership") {
      console.error(
        `handleMembershipCheckoutCompleted: unexpected type "${type}" for session ${session.id}`,
      );
      await ctx.runMutation(internal.stripeWebhooks.markEventProcessed, {
        stripeEventId,
      });
      return null;
    }

    if (!preRegistrationId || !tier || !category || !metroId || !email) {
      console.error(
        `handleMembershipCheckoutCompleted: missing required metadata in session ${session.id}`,
        { preRegistrationId, tier, category, metroId, email },
      );
      await ctx.runMutation(internal.stripeWebhooks.markEventProcessed, {
        stripeEventId,
      });
      return null;
    }

    // 3. Extract Stripe customer ID (auto-created for subscription mode via customer_email)
    const stripeCustomerId = session.customer as string | undefined;

    // 4. Extract Stripe subscription ID (present for mode: "subscription", null for mode: "payment")
    const stripeSubscriptionId = session.subscription as string | undefined;

    try {
      // 5. Call fulfillment mutation
      await ctx.runMutation(
        internal.launch.membershipFulfillment.fulfillMembership,
        {
          preRegistrationId: preRegistrationId as Id<"preRegistrations">,
          tier,
          category,
          email,
          stripeSessionId: session.id as string,
          stripeCustomerId: stripeCustomerId || undefined,
          stripeSubscriptionId: stripeSubscriptionId || undefined,
          metroId: metroId as Id<"metros">,
        },
      );

      // 6. Mark event as processed (only after successful fulfillment)
      await ctx.runMutation(internal.stripeWebhooks.markEventProcessed, {
        stripeEventId,
      });

      console.log(
        `Successfully fulfilled membership checkout session ${session.id}`,
      );
    } catch (error) {
      console.error(
        `Failed to fulfill membership checkout session ${session.id}:`,
        error,
      );
      // Don't mark as processed -- allow Stripe to retry
      throw error;
    }

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Action: upgradeInsiderCategory (PAY-08)
// Changes the membership CATEGORY (chef/mixologist/etc) for an active Insider
// subscriber. Calls Stripe subscriptions.update with proration_behavior to
// future-proof for if different categories have different prices.
//
// NOTE: The Price/subscription stays the same -- only metadata changes.
// proration_behavior: "create_prorations" is included per PAY-08 spec but
// since the Price doesn't change, no actual proration occurs.
// ---------------------------------------------------------------------------

export const upgradeInsiderCategory = internalAction({
  args: {
    userId: v.id("users"),
    newCategory: membershipCategory,
  },
  returns: v.null(),
  handler: async (ctx, { userId, newCategory }) => {
    // 1. Read user data
    const user = await ctx.runQuery(
      internal.launch.membershipFulfillment.getUserById,
      { userId },
    );

    if (!user) {
      throw new Error(`upgradeInsiderCategory: user not found: ${userId}`);
    }

    // 2. Validate user has active Insider subscription
    if (user.membershipTier !== "insider") {
      throw new Error(
        `upgradeInsiderCategory: user ${userId} is not on insider tier (tier: ${user.membershipTier})`,
      );
    }
    if (!user.isMembershipActive) {
      throw new Error(
        `upgradeInsiderCategory: user ${userId} does not have an active membership`,
      );
    }
    if (!user.stripeSubscriptionId) {
      throw new Error(
        `upgradeInsiderCategory: user ${userId} has no stripeSubscriptionId`,
      );
    }

    // 3. Update Stripe subscription metadata with new category
    const stripe = getStripeClient();
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      proration_behavior: "create_prorations",
      metadata: { category: newCategory },
    });

    // 4. Update user's membershipCategory in DB
    await ctx.runMutation(
      internal.launch.membershipFulfillment.updateUserCategory,
      { userId, newCategory },
    );

    console.log(
      `upgradeInsiderCategory: updated user ${userId} category to ${newCategory}`,
    );
    return null;
  },
});
