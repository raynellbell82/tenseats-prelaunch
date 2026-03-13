"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function ExpiredPageContent() {
  const router = useRouter();
  const [preRegId, setPreRegId] = useState<Id<"preRegistrations"> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rejoinQueue = useMutation(api.launch.queue.rejoinQueue);

  // Read preRegistrationId from sessionStorage on mount (SSR-safe)
  useEffect(() => {
    const stored = sessionStorage.getItem("preRegistrationId");
    if (stored) {
      setPreRegId(stored as Id<"preRegistrations">);
    }
    setMounted(true);
  }, []);

  const handleRejoin = async () => {
    if (!preRegId) return;
    setIsLoading(true);
    try {
      const newId = await rejoinQueue({ preRegistrationId: preRegId });
      sessionStorage.setItem("preRegistrationId", newId);
      router.push("/launch/queue");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to rejoin queue. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Clock className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Your invite has expired</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your 10-minute checkout window has closed. You can rejoin the queue to
          get another chance.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {mounted && preRegId && (
          <button
            onClick={handleRejoin}
            disabled={isLoading}
            className="rounded-full bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Rejoining..." : "Rejoin Queue"}
          </button>
        )}
        <Link
          href="/launch"
          className="rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Back to Launch
        </Link>
      </div>
    </div>
  );
}
