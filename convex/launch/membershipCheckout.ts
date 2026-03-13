"use node";

import { action } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import Stripe from "stripe";

const membershipTier = v.union(
  v.literal("early_bird"),
  v.literal("founding"),
  v.literal("insider"),
);

/**
 * Create Stripe client inside handler, not at module level.
 * Convex analyzes modules before environment variables are available.
 */
function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// ---------------------------------------------------------------------------
// Price ID lookup by tier
// ---------------------------------------------------------------------------

function getPriceId(tier: "early_bird" | "founding" | "insider"): string {
  const priceIds: Record<string, string | undefined> = {
    early_bird: process.env.STRIPE_EARLY_BIRD_PRICE_ID,
    founding: process.env.STRIPE_FOUNDING_PRICE_ID,
    insider: process.env.STRIPE_INSIDER_PRICE_ID,
  };
  const id = priceIds[tier];
  if (!id) {
    throw new ConvexError(`Missing Stripe Price ID for tier: ${tier}`);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Action: createMembershipCheckout (PAY-01, PAY-02)
// Creates a Stripe Checkout session for membership purchase.
// Early Bird ($49) / Founding ($79) -> mode: "payment"
// Insider ($99/yr) -> mode: "subscription"
// No application_fee_amount or transfer_data -- payment goes to platform.
// ---------------------------------------------------------------------------

export const createMembershipCheckout = action({
  args: {
    preRegistrationId: v.id("preRegistrations"),
    tier: membershipTier,
  },
  returns: v.object({ url: v.string() }),
  handler: async (ctx, args) => {
    // 1. Read pre-registration
    const reg = await ctx.runQuery(
      internal.launch.queueInternal.getPreRegistrationById,
      { preRegistrationId: args.preRegistrationId },
    );

    if (!reg) {
      throw new ConvexError("Pre-registration not found");
    }

    // 2. Validate status === "invited"
    if (reg.status !== "invited") {
      throw new ConvexError("Only invited users can create checkout sessions");
    }

    // 3. Read launch config to check lifetime offer
    const config = await ctx.runQuery(
      internal.launch.queueInternal.getLaunchConfig,
      {},
    );

    // 4. Validate tier selection against lifetime offer
    if (
      config &&
      !config.isLifetimeOfferActive &&
      (args.tier === "early_bird" || args.tier === "founding")
    ) {
      throw new ConvexError("Lifetime offer has ended");
    }

    // 5. Create Stripe client (inside handler, not module-level)
    const stripe = getStripeClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const priceId = getPriceId(args.tier);

    // Shared metadata for webhook routing
    const metadata = {
      type: "membership",
      preRegistrationId: String(reg._id),
      tier: args.tier,
      category: reg.category,
      metroId: String(reg.metroId),
      email: reg.email,
    };

    const commonParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: reg.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/launch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/launch/checkout?preRegistrationId=${reg._id}`,
      metadata,
    };

    let session: Stripe.Checkout.Session;

    if (args.tier === "insider") {
      // PAY-02: Subscription mode for Insider ($99/yr)
      session = await stripe.checkout.sessions.create({
        ...commonParams,
        mode: "subscription",
        subscription_data: {
          metadata: {
            type: "membership",
            preRegistrationId: String(reg._id),
            tier: args.tier,
            email: reg.email,
          },
        },
      });
    } else {
      // PAY-01: One-time payment for Early Bird ($49) / Founding ($79)
      session = await stripe.checkout.sessions.create({
        ...commonParams,
        mode: "payment",
      });
    }

    if (!session.url) {
      throw new ConvexError("Stripe session created but no URL returned");
    }

    return { url: session.url };
  },
});
