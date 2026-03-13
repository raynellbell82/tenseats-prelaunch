"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CheckoutCountdownInnerProps {
  expiresAt: number;
  onExpired: () => void;
}

const TOTAL_DURATION = 10 * 60 * 1000; // 10 minutes in ms

function CheckoutCountdownInner({
  expiresAt,
  onExpired,
}: CheckoutCountdownInnerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, expiresAt - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isUrgent = timeLeft < 2 * 60 * 1000; // under 2 minutes
  const progressPercent = Math.min(
    100,
    Math.max(0, (timeLeft / TOTAL_DURATION) * 100),
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            isUrgent && "text-destructive",
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "text-sm",
            isUrgent ? "text-destructive" : "text-muted-foreground",
          )}
        >
          remaining
        </span>
      </div>
      <Progress
        value={progressPercent}
        className={cn("h-2 w-full", isUrgent && "[&>div]:bg-destructive")}
      />
    </div>
  );
}

const CheckoutCountdown = dynamic(
  () => Promise.resolve(CheckoutCountdownInner),
  { ssr: false },
);

export { CheckoutCountdownInner, CheckoutCountdown };
