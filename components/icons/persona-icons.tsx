/**
 * Custom monoline SVG icon components for persona roles.
 * Each icon uses stroke="currentColor" so it inherits text color from parent.
 * strokeWidth="1.5", fill="none", viewBox="0 0 24 24"
 */

interface IconProps {
  className?: string;
}

export function GuestIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Person silhouette with plate suggestion */}
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" />
      {/* Fork suggestion */}
      <line x1="16.5" y1="9" x2="16.5" y2="13" />
      <line x1="15.5" y1="9" x2="15.5" y2="11" />
      <line x1="17.5" y1="9" x2="17.5" y2="11" />
    </svg>
  );
}

export function ChefIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Chef's toque */}
      <path d="M8 10c0-2.21 1.79-4 4-4s4 1.79 4 4" />
      <path d="M6 10a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4" />
      <rect x="8" y="14" width="8" height="4" rx="0.5" />
      <line x1="8" y1="16" x2="16" y2="16" />
      {/* Knife suggestion */}
      <line x1="11" y1="18" x2="11" y2="21" />
      <line x1="13" y1="18" x2="13" y2="21" />
    </svg>
  );
}

export function MixologistIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cocktail coupe glass */}
      <path d="M5 4h14l-7 9z" />
      <line x1="12" y1="13" x2="12" y2="19" />
      <line x1="8" y1="19" x2="16" y2="19" />
      {/* Garnish */}
      <circle cx="17" cy="7" r="1" />
      <line x1="17" y1="6" x2="17" y2="4" />
    </svg>
  );
}

export function CuratorIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Magnifying glass */}
      <circle cx="10.5" cy="10.5" r="5.5" />
      <line x1="15" y1="15" x2="20" y2="20" />
      {/* Food element — small fork inside */}
      <line x1="9.5" y1="8" x2="9.5" y2="13" />
      <line x1="8.5" y1="8" x2="8.5" y2="10" />
      <line x1="10.5" y1="8" x2="10.5" y2="10" />
    </svg>
  );
}

export function VenueHostIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Building facade / archway */}
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M3 8c0-3 2-5 5-5h8c3 0 5 2 5 5" />
      {/* Door archway */}
      <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
      {/* Windows */}
      <rect x="5" y="11" width="3" height="3" rx="0.5" />
      <rect x="16" y="11" width="3" height="3" rx="0.5" />
    </svg>
  );
}

export function FacilitatorIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Connected nodes — person at center connecting others */}
      <circle cx="12" cy="12" r="2" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="20" cy="6" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
      <circle cx="20" cy="18" r="1.5" />
      <line x1="10.3" y1="10.7" x2="5.4" y2="7.1" />
      <line x1="13.7" y1="10.7" x2="18.6" y2="7.1" />
      <line x1="10.3" y1="13.3" x2="5.4" y2="16.9" />
      <line x1="13.7" y1="13.3" x2="18.6" y2="16.9" />
    </svg>
  );
}

export const personaIconMap = {
  guest: GuestIcon,
  chef: ChefIcon,
  mixologist: MixologistIcon,
  curator: CuratorIcon,
  venueHost: VenueHostIcon,
  facilitator: FacilitatorIcon,
} as const;
