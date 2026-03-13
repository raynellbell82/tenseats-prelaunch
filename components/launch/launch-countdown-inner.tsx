"use client";

import { useState, useEffect } from "react";

interface LaunchCountdownInnerProps {
  deadline: number;
}

export function LaunchCountdownInner({ deadline }: LaunchCountdownInnerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, deadline - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Calculate progress as fraction of time elapsed (assuming 30-day window)
  const totalDuration = 30 * 24 * 60 * 60 * 1000;
  const elapsed = totalDuration - timeLeft;
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsed / totalDuration) * 100),
  );

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Conic gradient ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            hsl(var(--foreground)) ${progressPercent}%,
            hsl(var(--muted)) ${progressPercent}%
          )`,
        }}
      />
      {/* Inner circle to create ring effect */}
      <div className="absolute inset-2 rounded-full bg-background" />
      {/* Time text */}
      <div className="relative z-10 text-center">
        {days > 0 ? (
          <>
            <span className="text-2xl font-bold tabular-nums">{days}</span>
            <span className="block text-xs text-muted-foreground">
              {days === 1 ? "day" : "days"}
            </span>
          </>
        ) : (
          <>
            <span className="text-lg font-bold tabular-nums">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            </span>
            <span className="block text-xs text-muted-foreground tabular-nums">
              {String(seconds).padStart(2, "0")}s
            </span>
          </>
        )}
      </div>
    </div>
  );
}
