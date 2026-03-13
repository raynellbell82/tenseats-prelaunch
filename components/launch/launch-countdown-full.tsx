"use client";

import { useState, useEffect } from "react";

interface LaunchCountdownFullProps {
  deadline: number;
}

export function LaunchCountdownFull({ deadline }: LaunchCountdownFullProps) {
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

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  if (timeLeft <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-bold tabular-nums tracking-tight text-foreground">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-4xl font-light text-muted-foreground/40 -mt-4">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
