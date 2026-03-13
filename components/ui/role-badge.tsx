"use client";

import { Shield, Mic, Building2, Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const roleBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium",
  {
    variants: {
      role: {
        creator: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        venue_host: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        admin: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        curator: "bg-green-500/10 text-green-600 dark:text-green-400",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const roleConfig = {
  creator: { label: "Creator", icon: Mic },
  venue_host: { label: "Venue Host", icon: Building2 },
  admin: { label: "Admin", icon: Shield },
  curator: { label: "Curator", icon: Sparkles },
} as const;

type RoleType = keyof typeof roleConfig;

interface RoleBadgeProps extends VariantProps<typeof roleBadgeVariants> {
  role: RoleType;
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  size,
  showIcon = true,
  className,
}: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span className={cn(roleBadgeVariants({ role, size }), className)}>
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {config.label}
    </span>
  );
}

interface RoleBadgeListProps {
  roles: RoleType[];
  size?: "sm" | "md";
  className?: string;
}

export function RoleBadgeList({ roles, size = "md", className }: RoleBadgeListProps) {
  if (roles.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {roles.map((role) => (
        <RoleBadge key={role} role={role} size={size} />
      ))}
    </div>
  );
}
