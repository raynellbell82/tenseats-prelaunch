"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LaunchCitySearch } from "@/components/launch/launch-city-search";
import { SlotGrid } from "@/components/launch/slot-grid";
import { LaunchQueueSignupForm } from "@/components/launch/launch-queue-signup-form";
import { LaunchQueueDialog } from "@/components/launch/launch-queue-dialog";

interface LaunchPageContentProps {
  initialCitySlug?: string;
}

export function LaunchPageContent({ initialCitySlug }: LaunchPageContentProps) {
  const [selectedMetroId, setSelectedMetroId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const config = useQuery(api.launch.queue.getLaunchConfig);
  const metros = useQuery(api.metros.listActiveMetros);

  const hasInitializedCity = useRef(false);

  useEffect(() => {
    if (initialCitySlug && metros && !hasInitializedCity.current) {
      const match = metros.find((m) => m.name === initialCitySlug);
      if (match) {
        setSelectedMetroId(match._id);
        hasInitializedCity.current = true;
      }
    }
  }, [initialCitySlug, metros]);

  function handleCitySelect(metroId: string) {
    setSelectedMetroId(metroId);
    setSelectedCategory(null);
  }

  function handleCityClear() {
    setSelectedMetroId(null);
    setSelectedCategory(null);
  }

  function handleJoinQueue(metroId: string, category: string) {
    setSelectedMetroId(metroId);
    setSelectedCategory(category);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Reserve Your Founding Seat
        </h1>
        <p className="text-muted-foreground">
          Select your city and category to join the founding member queue.
          Early Bird and Founding members enjoy waived platform fees — forever.
        </p>
      </div>

      {/* How does this work? */}
      <div className="flex items-center">
        <LaunchQueueDialog />
      </div>

      {/* City search */}
      <div className="max-w-md">
        <LaunchCitySearch
          onSelect={handleCitySelect}
          onClear={handleCityClear}
          initialValue={
            initialCitySlug && metros
              ? metros.find((m) => m.name === initialCitySlug)?.displayName
              : undefined
          }
        />
      </div>

      {/* Slot grid — shown when a city is selected */}
      {selectedMetroId && (
        <SlotGrid
          selectedMetroId={selectedMetroId}
          isLifetimeOfferActive={config?.isLifetimeOfferActive ?? false}
          onJoinQueue={handleJoinQueue}
        />
      )}

      {/* Queue signup form — shown when both city and category are selected */}
      {selectedMetroId && selectedCategory && (
        <LaunchQueueSignupForm
          preselectedMetroId={selectedMetroId}
          preselectedCategory={selectedCategory}
        />
      )}
    </main>
  );
}
