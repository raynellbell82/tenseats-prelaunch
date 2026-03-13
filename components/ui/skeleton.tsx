import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton loading placeholder component.
 *
 * Displays an animated placeholder shape for loading states.
 * Uses pulse animation from tw-animate-css and muted background color.
 *
 * @example
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Text line skeleton
 * <Skeleton className="h-4 w-[250px]" />
 *
 * // Card skeleton
 * <Skeleton className="aspect-video w-full" />
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
