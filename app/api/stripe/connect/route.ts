import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    // 1. Create a Stripe Express connected account
    const account = await stripe.accounts.create({ type: "express" });

    // 2. Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/launch/success/vendor`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/launch/success/vendor`,
      type: "account_onboarding",
    });

    // 3. Return the onboarding URL
    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("[stripe/connect] Failed to create Express account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}
