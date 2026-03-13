"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LaunchBanner() {
  const config = useQuery(api.launch.queue.getLaunchConfig);

  // HOME-02: Feature flag gate -- hide banner when disabled or missing
  if (!config?.featureBannerEnabled) return null;

  return (
    <Link
      href="/join"
      className="group flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:p-4 mb-6 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10"
    >
      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Founding memberships now open
        </p>
        <p className="text-xs text-muted-foreground">
          Free to join — reserve your seat early
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
