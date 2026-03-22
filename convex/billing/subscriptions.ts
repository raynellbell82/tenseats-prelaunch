"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { StripeSubscriptions } from "@convex-dev/stripe";
import { authComponent } from "../auth";
import type { Id } from "../_generated/dataModel";

/**
 * Create a Stripe Checkout session for Insider subscription.
 * WHB-03: Uses authComponent.getAuthUser(ctx) — no getUserIdentity() calls.
 * WHB-04: Action in convex/billing/subscriptions.ts per requirement.
 */
export const createInsiderCheckout = action({
  args: {
    priceId: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  returns: v.object({ url: v.union(v.string(), v.null()) }),
  handler: async (ctx, args) => {
    // WHB-03: get userId explicitly via Better Auth, no getUserIdentity()
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    const userId = String(authUser._id);

    // Instantiate inside handler — env var safety pattern (never at module level)
    const stripe = new StripeSubscriptions(components.stripe);

    const { customerId } = await stripe.getOrCreateCustomer(ctx, {
      userId,
      email: authUser.email,
    });

    const session = await stripe.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId,
      mode: "subscription",
      successUrl: args.successUrl,
      cancelUrl: args.cancelUrl,
      subscriptionMetadata: { userId },
    });

    return { url: session.url };
  },
});

/**
 * Create a Stripe Billing Portal session for managing subscriptions.
 * WHB-03: Uses authComponent.getAuthUser(ctx) — no getUserIdentity() calls.
 * WHB-04: Action in convex/billing/subscriptions.ts per requirement.
 */
export const createBillingPortalSession = action({
  args: {
    returnUrl: v.string(),
  },
  returns: v.object({ url: v.string() }),
  handler: async (ctx, args) => {
    // WHB-03: get userId explicitly via Better Auth
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    const userId = String(authUser._id);

    // Instantiate inside handler
    const stripe = new StripeSubscriptions(components.stripe);

    const { customerId } = await stripe.getOrCreateCustomer(ctx, {
      userId,
      email: authUser.email,
    });

    const portalSession = await stripe.createCustomerPortalSession(ctx, {
      customerId,
      returnUrl: args.returnUrl,
    });

    return { url: portalSession.url };
  },
});

/**
 * Internal action: register a user with the @convex-dev/stripe component and persist the customer ID.
 * Called by the post-fulfillment sync bridge (BILL-02) and backfill migration (BILL-01).
 * Args use v.string() for userId because callers may have Id<"users"> or string.
 */
export const syncCustomerToComponent = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  returns: v.object({ customerId: v.string() }),
  handler: async (ctx, { userId, email }) => {
    // Instantiate inside handler — env var safety pattern
    const stripe = new StripeSubscriptions(components.stripe);
    const { customerId } = await stripe.getOrCreateCustomer(ctx, { userId, email });
    // Persist to users table — mutation now in billingHelpers.ts (non-Node file)
    await ctx.runMutation(internal.billing.billingHelpers.setStripeBillingCustomerId, {
      userId: userId as Id<"users">,
      customerId,
    });
    return { customerId };
  },
});

/**
 * Lazy sync: authenticated user calls this on membership page load.
 * Resolves (or creates) the billing customer in @convex-dev/stripe and persists the ID.
 * BILL-03: Returns { customerId } so the caller can confirm success.
 * Auth: authComponent.getAuthUser(ctx) — NEVER ctx.auth.getUserIdentity() in actions.
 */
export const syncMyBillingCustomer = action({
  args: {},
  returns: v.object({ customerId: v.string() }),
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    const userId = String(authUser._id);
    const email = authUser.email;

    // Instantiate inside handler — env var safety pattern
    const stripe = new StripeSubscriptions(components.stripe);
    const { customerId } = await stripe.getOrCreateCustomer(ctx, { userId, email });

    // Persist to users table — mutation now in billingHelpers.ts (non-Node file)
    await ctx.runMutation(internal.billing.billingHelpers.setStripeBillingCustomerId, {
      userId: authUser._id as unknown as Id<"users">,
      customerId,
    });

    return { customerId };
  },
});
