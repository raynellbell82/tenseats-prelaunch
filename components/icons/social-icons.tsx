/**
 * Custom monoline SVG icon components for social media links.
 * Each icon uses stroke="currentColor" so it inherits text color from parent.
 * strokeWidth="1.5", fill="none", viewBox="0 0 24 24"
 */

interface IconProps {
  className?: string;
}

export function InstagramIcon({ className = "h-5 w-5" }: IconProps) {
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
      {/* Camera body — rounded rectangle */}
      <rect x="2" y="2" width="20" height="20" rx="5" />
      {/* Lens — circle in center */}
      <circle cx="12" cy="12" r="5" />
      {/* Flash dot — top right */}
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  );
}

export function PinterestIcon({ className = "h-5 w-5" }: IconProps) {
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
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Stylized P shape: vertical stem with curved bump at top-right */}
      <path d="M10 17v-6a3 3 0 0 1 6 0 3 3 0 0 1-6 0" />
      {/* Pin tail curving down-left from base of P */}
      <path d="M10 11l-2 6" />
    </svg>
  );
}
