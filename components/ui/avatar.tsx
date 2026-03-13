"use client";

import * as React from "react";
import { cn, fixConvexUrl } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    // Fix Convex storage URLs that may have wrong hostname
    const fixedSrc = src ? fixConvexUrl(src) : undefined;
    const showFallback = !fixedSrc || imageError;
    const fallbackText = fallback || (alt ? alt[0]?.toUpperCase() : "?");

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {showFallback ? (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {fallbackText}
          </div>
        ) : (
          <img
            src={fixedSrc}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
