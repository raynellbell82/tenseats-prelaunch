"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { TierSelector } from "@/components/launch/tier-selector";
import { CheckoutCountdown } from "@/components/launch/checkout-countdown";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  chef: "Chef",
  mixologist: "Mixologist",
  creator: "Creator",
  venueHost: "Venue Host",
  guest: "Guest",
};

export function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preRegId, setPreRegId] = useState<Id<"preRegistrations"> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("early_bird");
  const [isLoading, setIsLoading] = useState(false);

  // Read preRegistrationId from sessionStorage or URL searchParams on mount (SSR-safe)
  useEffect(() => {
    const fromStorage = sessionStorage.getItem("preRegistrationId");
    const fromUrl = searchParams.get("preRegistrationId");
    const id = fromStorage ?? fromUrl;

    if (!id) {
      router.replace("/launch");
      return;
    }

    setPreRegId(id as Id<"preRegistrations">);
    setMounted(true);
  }, [router, searchParams]);

  const checkoutData = useQuery(
    api.launch.queue.getCheckoutData,
    preRegId ? { preRegistrationId: preRegId } : "skip",
  );

  const launchConfig = useQuery(api.launch.queue.getLaunchConfig);

  const createCheckout = useAction(
    api.launch.membershipCheckout.createMembershipCheckout,
  );

  // Initialize selectedTier from checkout data once available
  useEffect(() => {
    if (checkoutData) {
      setSelectedTier(checkoutData.tier);
    }
  }, [checkoutData]);

  // Redirect to /launch if checkout data is null (not invited)
  useEffect(() => {
    if (mounted && checkoutData === null) {
      router.replace("/launch");
    }
  }, [mounted, checkoutData, router]);

  const handleProceedToPayment = async () => {
    if (!preRegId) return;
    setIsLoading(true);
    try {
      const result = await createCheckout({
        preRegistrationId: preRegId,
        tier: selectedTier as "early_bird" | "founding" | "insider",
      });
      window.location.href = result.url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start checkout. Please try again.",
      );
      setIsLoading(false);
    }
  };

  // Loading state: not yet mounted or queries still loading
  if (!mounted || checkoutData === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Complete Your Membership</h1>
        <p className="text-sm text-muted-foreground">
          {checkoutData.email} &middot;{" "}
          {CATEGORY_LABELS[checkoutData.category] ?? checkoutData.category}
        </p>
      </div>

      <div className="flex justify-center">
        <CheckoutCountdown
          expiresAt={checkoutData.inviteExpiresAt}
          onExpired={() => router.push("/launch/expired")}
        />
      </div>

      <TierSelector
        selectedTier={selectedTier}
        onSelect={setSelectedTier}
        isLifetimeOfferActive={launchConfig?.isLifetimeOfferActive ?? false}
      />

      <button
        onClick={handleProceedToPayment}
        disabled={isLoading}
        className="w-full rounded-full bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Redirecting to payment..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
