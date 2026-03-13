"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SlotGridProps {
  selectedMetroId?: string;
  isLifetimeOfferActive: boolean;
  onJoinQueue?: (metroId: string, category: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  chef: "Chef",
  mixologist: "Mixologist",
  creator: "Creator",
  venueHost: "Venue Host",
  guest: "Guest",
};

const TIER_LABELS = {
  earlyBird: "Early Bird",
  founding: "Founding",
};

export function SlotGrid({
  selectedMetroId,
  isLifetimeOfferActive,
  onJoinQueue,
}: SlotGridProps) {
  const slots = useQuery(api.launch.queue.getSlotGrid);

  if (slots === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  type Slot = (typeof slots)[number];

  const filtered: Slot[] = selectedMetroId
    ? slots.filter((s: Slot) => s.metroId === selectedMetroId)
    : [];

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No slots available for this city.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((slot) => {
        const isClosed = slot.isClosed || slot.spotsRemaining === 0;

        // Split cap between tiers: first half is Early Bird, rest is Founding
        const earlyBirdCap = Math.ceil(slot.cap / 2);
        const isEarlyBird = slot.completedCount < earlyBirdCap;
        const currentTier = isEarlyBird ? "earlyBird" : "founding";
        const tierSpotsRemaining = isEarlyBird
          ? earlyBirdCap - slot.completedCount
          : slot.cap - slot.completedCount;
        const tierCap = isEarlyBird ? earlyBirdCap : slot.cap - earlyBirdCap;
        const tierFilled = isEarlyBird
          ? slot.completedCount
          : slot.completedCount - earlyBirdCap;
        const progressValue =
          tierCap > 0 ? (tierFilled / tierCap) * 100 : 0;

        return (
          <Card
            key={`${slot.metroId}-${slot.category}`}
            className={cn(
              "rounded-xl shadow-sm",
              !isClosed && onJoinQueue && "cursor-pointer hover:border-foreground/30 transition-colors"
            )}
            onClick={!isClosed && onJoinQueue ? () => onJoinQueue(slot.metroId, slot.category) : undefined}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {CATEGORY_LABELS[slot.category] ?? slot.category}
                </CardTitle>
                {isClosed && (
                  <Badge variant="secondary" className="text-xs">
                    Closed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progressValue} className="h-2" />
              <div className="flex items-center justify-between text-sm gap-2">
                <span className="text-muted-foreground whitespace-nowrap">
                  {tierFilled}/{tierCap} filled
                </span>
                <span className="font-semibold whitespace-nowrap">
                  {tierSpotsRemaining}{" "}
                  {tierSpotsRemaining === 1 ? "spot" : "spots"} left
                </span>
              </div>
              {isLifetimeOfferActive ? (
                <Badge
                  variant={currentTier === "earlyBird" ? "default" : "secondary"}
                  className="text-xs whitespace-nowrap px-3"
                >
                  {TIER_LABELS[currentTier]}
                </Badge>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Insider membership only
                </p>
              )}
              {!isClosed && !onJoinQueue && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity w-full"
                >
                  Join Queue
                </button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
