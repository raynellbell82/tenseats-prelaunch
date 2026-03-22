"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "@/lib/auth-client";
import { LandingHeader } from "@/components/landing/landing-header";
import { MembershipStatusCard } from "@/components/account/membership-status-card";
import { PaymentHistoryList } from "@/components/account/payment-history-list";

export default function MembershipPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const syncedRef = useRef(false);

  // Auth guard — redirect unauthenticated users
  useEffect(() => {
    if (sessionPending) return;
    if (!session || !session.user.emailVerified) {
      router.push("/launch");
    }
  }, [session, sessionPending, router]);

  const isAuthed = !!session?.user?.emailVerified;

  // Data queries — skip if not authenticated
  const membership = useQuery(
    api.billing.membership.getMyMembership,
    isAuthed ? {} : "skip",
  );
  const subscription = useQuery(
    api.billing.queries.getMySubscription,
    isAuthed && membership?.tier === "insider" ? {} : "skip",
  );
  const payments = useQuery(
    api.billing.queries.getMyPaymentHistory,
    isAuthed && membership?.tier === "insider" ? {} : "skip",
  );

  // Lazy sync — fire once for Insider members on first load (MEM-05)
  const syncMyBillingCustomer = useAction(
    api.billing.subscriptions.syncMyBillingCustomer,
  );

  useEffect(() => {
    if (
      membership?.tier === "insider" &&
      !syncedRef.current
    ) {
      syncedRef.current = true;
      // Silent fire-and-forget — no UI feedback per UI-SPEC
      syncMyBillingCustomer({}).catch(() => {
        // Logged silently, does not affect page display
      });
    }
  }, [membership?.tier, syncMyBillingCustomer]);

  // Show nothing while session loads or if redirecting
  if (sessionPending) return null;
  if (!session || !session.user.emailVerified) return null;

  const isLoading = membership === undefined;
  const isInsider = membership?.tier === "insider";

  // Derive subscription status string from Stripe subscription object
  const subscriptionStatus = (subscription as { status?: string } | null | undefined)?.status ?? null;

  return (
    <>
      <LandingHeader />
      <main className="flex flex-col items-center px-4 py-12 md:py-20">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <h1 className="text-[28px] font-semibold leading-[1.1]">
            Your Membership
          </h1>

          <MembershipStatusCard
            membership={membership ?? null}
            subscriptionStatus={subscriptionStatus}
            isLoading={isLoading}
          />

          {isInsider && (
            <PaymentHistoryList
              payments={(payments as Array<{ _id: string; created?: number; description?: string; amount?: number; currency?: string; status?: string }>) ?? []}
              isLoading={payments === undefined}
              error={false}
            />
          )}
        </div>
      </main>
    </>
  );
}
