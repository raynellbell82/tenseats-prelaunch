"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MembershipTierBadge } from "./membership-tier-badge";
import { ManageBillingButton } from "./manage-billing-button";
import { cn } from "@/lib/utils";

// Tier display names
const TIER_LABELS: Record<string, string> = {
  early_bird: "Early Bird",
  founding: "Founding",
  insider: "Insider",
};

// Status display
const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  cancelled: { label: "Cancelled", variant: "secondary" },
  past_due: { label: "Past Due", variant: "destructive" },
};

interface MembershipStatusCardProps {
  membership: {
    tier: string | null;
    isActive: boolean;
    isLifetime: boolean;
    hasBillingCustomer: boolean;
  } | null;
  subscriptionStatus?: string | null;
  isLoading: boolean;
}

export function MembershipStatusCard({ membership, subscriptionStatus, isLoading }: MembershipStatusCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardFooter>
          <Skeleton className="h-10 w-36" />
        </CardFooter>
      </Card>
    );
  }

  if (!membership || !membership.tier) {
    return null;
  }

  const tierLabel = TIER_LABELS[membership.tier] ?? membership.tier;
  const isInsider = membership.tier === "insider";

  // Derive display status
  let statusKey = membership.isActive ? "active" : "cancelled";
  if (subscriptionStatus === "past_due") statusKey = "past_due";
  if (subscriptionStatus === "canceled") statusKey = "cancelled";
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.active;

  return (
    <Card className={cn(membership.isLifetime && "ring-2 ring-foreground")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{tierLabel}</h2>
            <div className="flex items-center gap-2">
              <MembershipTierBadge isLifetime={membership.isLifetime} />
              <span className="text-sm text-muted-foreground">{status.label}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      {isInsider && (
        <CardFooter>
          <ManageBillingButton />
        </CardFooter>
      )}
    </Card>
  );
}
