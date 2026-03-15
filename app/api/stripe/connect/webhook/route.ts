import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Call a Convex internal mutation via the HTTP API using the deploy key.
 * This is the correct way to call internal mutations from outside Convex —
 * using the Authorization: Convex <deploy-key> header.
 */
async function callInternalMutation(
  path: string,
  args: Record<string, unknown>,
): Promise<void> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
  const deployKey = process.env.CONVEX_DEPLOY_KEY!;

  const response = await fetch(`${convexUrl}/api/mutation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Convex ${deployKey}`,
    },
    body: JSON.stringify({ path, args, format: "convex_encoded_json" }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Convex mutation failed (${response.status}): ${text}`);
  }
}

/**
 * Stripe Connect webhook endpoint — handles account.updated events.
 * When a connected account completes onboarding (details_submitted === true),
 * we confirm completion in Convex so the vendor success page reactively updates.
 *
 * Register this endpoint in Stripe Dashboard:
 *   Connect > Webhooks > Add endpoint
 *   URL: https://yourdomain.com/api/stripe/connect/webhook
 *   Events: account.updated
 *   Set STRIPE_CONNECT_WEBHOOK_SECRET in .env.local from the signing secret.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe/connect/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    if (account.details_submitted) {
      await callInternalMutation("launch/stripeConnect:confirmStripeConnect", {
        stripeConnectAccountId: account.id,
      });
    }
  }

  // Always return 200 — Stripe expects acknowledgment for all events.
  return NextResponse.json({ received: true });
}
