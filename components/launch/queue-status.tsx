"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Mail, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_LABELS: Record<string, string> = {
  chef: "Chef",
  mixologist: "Mixologist",
  creator: "Creator",
  venueHost: "Venue Host",
  guest: "Guest",
};

export function QueueStatus() {
  const router = useRouter();
  const [preRegId, setPreRegId] = useState<Id<"preRegistrations"> | null>(null);
  const [mounted, setMounted] = useState(false);

  // Read preRegistrationId from sessionStorage on mount (SSR-safe)
  useEffect(() => {
    const stored = sessionStorage.getItem("preRegistrationId");
    if (!stored) {
      router.replace("/launch");
      return;
    }
    setPreRegId(stored as Id<"preRegistrations">);
    setMounted(true);
  }, [router]);

  // Reactive queries with "skip" pattern when ID is not yet available
  const preReg = useQuery(
    api.launch.queue.getPreRegistration,
    preRegId ? { preRegistrationId: preRegId } : "skip",
  );

  const position = useQuery(
    api.launch.queue.getQueuePosition,
    preRegId ? { preRegistrationId: preRegId } : "skip",
  );

  // Auto-redirect based on status changes
  useEffect(() => {
    if (!preReg) return;

    switch (preReg.status) {
      case "invited":
        router.push("/launch/checkout");
        break;
      case "invite_expired":
        router.push("/launch/expired");
        break;
      case "completed":
        router.push("/launch/success");
        break;
      case "cancelled":
        router.push("/launch");
        break;
    }
  }, [preReg?.status, router, preReg]);

  // Loading state: not yet mounted or query still loading
  if (!mounted || preReg === undefined) {
    return (
      <div className="flex flex-col items-center space-y-6 py-12">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  // If preReg is null, the ID was invalid
  if (preReg === null) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-12">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Registration not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your queue registration could not be found. Please try signing up
          again.
        </p>
        <button
          onClick={() => router.push("/launch")}
          className="rounded-full bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Launch
        </button>
      </div>
    );
  }

  // Status: registered -- waiting for email verification
  if (preReg.status === "registered") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-12">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Mail className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{preReg.email}</span>.
            Verify your email to join the queue.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full px-4 py-1.5">
          {CATEGORY_LABELS[preReg.category] ?? preReg.category}
        </Badge>
      </div>
    );
  }

  // Status: verified -- show live position
  if (preReg.status === "verified") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-12">
        {/* Pulsing indicator */}
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
            {position ? (
              <span className="text-4xl font-bold">#{position.position}</span>
            ) : (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
          </div>
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-foreground" />
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">You are in the queue</h2>
          {position && (
            <p className="text-muted-foreground text-sm">
              You are <span className="font-semibold text-foreground">#{position.position}</span> of{" "}
              <span className="font-semibold text-foreground">{position.total}</span> in line
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Live tracking -- this page updates automatically
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5">
            {CATEGORY_LABELS[preReg.category] ?? preReg.category}
          </Badge>
        </div>
      </div>
    );
  }

  // Fallback for transitional states (invited/expired/completed redirect via effect)
  return (
    <div className="flex flex-col items-center space-y-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
}
