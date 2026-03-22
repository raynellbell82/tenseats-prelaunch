import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { components } from "./_generated/api";
import { registerRoutes } from "@convex-dev/stripe";

const http = httpRouter();

// Mount Better Auth routes at /api/auth/*
authComponent.registerRoutes(http, createAuth);

// Billing webhook — @convex-dev/stripe component handles event routing and db sync
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/billing-webhook",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_BILLING_WEBHOOK_SECRET,
});

export default http;
