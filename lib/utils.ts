import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fix Convex storage upload URL origin mismatch.
 *
 * On self-hosted Convex, ctx.storage.generateUploadUrl() returns a URL based
 * on CONVEX_CLOUD_ORIGIN configured on the backend. If that origin differs
 * from the NEXT_PUBLIC_CONVEX_URL the client uses (e.g., backend returns
 * "dashboard.tenseats.io" but client expects "api.tenseats.io"), the browser
 * fetch will fail with "Failed to fetch" because the wrong domain either
 * 404s or lacks CORS headers for the app origin.
 *
 * This helper rewrites the upload URL origin to match NEXT_PUBLIC_CONVEX_URL.
 */
export function fixConvexUrl(url: string): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return url;

  try {
    const urlOrigin = new URL(url).origin;
    const expectedOrigin = new URL(convexUrl).origin;

    if (urlOrigin !== expectedOrigin) {
      return url.replace(urlOrigin, expectedOrigin);
    }
  } catch {
    // If URL parsing fails, return as-is
  }

  return url;
}

/** @deprecated Use fixConvexUrl instead */
export const fixUploadUrl = fixConvexUrl;

/**
 * Format cents to USD currency string.
 * @param cents - Amount in cents (integer)
 * @returns Formatted currency string (e.g., "$10.99")
 */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
