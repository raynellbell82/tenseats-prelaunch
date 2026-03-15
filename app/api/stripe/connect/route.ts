import Stripe from "stripe";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    // 1. Create a Stripe Express connected account
    const account = await stripe.accounts.create({ type: "express" });

    // 2. Save account ID to Convex immediately (before returning URL)
    //    fetchAuthMutation injects the user's JWT — the mutation uses ctx.auth to
    //    identify which user to patch. Returns 401 automatically if not authenticated.
    await fetchAuthMutation(api.launch.stripeConnect.saveStripeConnectAccount, {
      stripeConnectAccountId: account.id,
    });

    // 3. Create account link for onboarding
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/launch/success/vendor`,
      return_url: `${baseUrl}/launch/success/vendor?stripe_connect=complete`,
      type: "account_onboarding",
    });

    // 4. Return the onboarding URL
    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("[stripe/connect] Failed to create Express account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 },
    );
  }
}
