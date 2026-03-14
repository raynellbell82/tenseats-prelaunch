"use client";

import { InstagramIcon } from "@/components/icons/social-icons";
import { PinterestIcon } from "@/components/icons/social-icons";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/tenseats",
    Icon: InstagramIcon,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/tenseats",
    Icon: PinterestIcon,
  },
];

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
        Connect with us
      </p>
      <div className="flex items-center gap-6">
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
