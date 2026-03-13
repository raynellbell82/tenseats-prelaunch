"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TierSelectorProps {
  selectedTier: string;
  onSelect: (tier: string) => void;
  isLifetimeOfferActive: boolean;
}

interface TierOption {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  lifetimeOnly: boolean;
}

const TIERS: TierOption[] = [
  {
    id: "early_bird",
    name: "Early Bird",
    price: "$49",
    period: "one-time",
    description: "Lock in zero platform fees forever",
    lifetimeOnly: true,
  },
  {
    id: "founding",
    name: "Founding Member",
    price: "$79",
    period: "one-time",
    description: "Premium lifetime membership with zero fees",
    lifetimeOnly: true,
  },
  {
    id: "insider",
    name: "Insider",
    price: "$99",
    period: "/year",
    description: "Annual membership with zero platform fees",
    lifetimeOnly: false,
  },
];

export function TierSelector({
  selectedTier,
  onSelect,
  isLifetimeOfferActive,
}: TierSelectorProps) {
  const visibleTiers = isLifetimeOfferActive
    ? TIERS
    : TIERS.filter((t) => !t.lifetimeOnly);

  return (
    <div className="space-y-3">
      {!isLifetimeOfferActive && (
        <p className="text-sm text-muted-foreground text-center">
          Lifetime slots are full -- join as an Insider
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visibleTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card
                className={cn(
                  "rounded-xl cursor-pointer transition-all hover:shadow-md",
                  isSelected
                    ? "ring-2 ring-foreground shadow-md"
                    : "hover:ring-1 hover:ring-border",
                )}
              >
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
