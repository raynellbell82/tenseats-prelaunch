"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MembershipTierBadgeProps {
  isLifetime: boolean;
  className?: string;
}

export function MembershipTierBadge({ isLifetime, className }: MembershipTierBadgeProps) {
  if (isLifetime) {
    return (
      <Badge
        className={cn(
          "border-transparent bg-accent-burnt-sienna text-white hover:bg-accent-burnt-sienna/80",
          className,
        )}
      >
        Lifetime Member
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={className}>
      Insider
    </Badge>
  );
}
