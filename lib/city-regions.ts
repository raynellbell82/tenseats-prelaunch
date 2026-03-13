/**
 * Region mapping for all 32 Tenseats city markets.
 * Regions follow US Census Bureau conventions.
 */

import { METROS_DATA } from "@/lib/city-data";

export type Region = "South" | "Midwest" | "Northeast" | "West";

export const REGIONS: Region[] = ["South", "Midwest", "Northeast", "West"];

/**
 * Maps each city slug (METROS_DATA name) to its US Census Bureau region.
 *
 * South (16): atlanta-ga, asheville-nc, austin-tx, birmingham-al, charleston-sc,
 *   charlotte-nc, dallas-tx, greenville-sc, houston-tx, memphis-tn, meridian-ms,
 *   oklahoma-city-ok, orlando-fl, st-petersburg-fl, tampa-fl, washington-dc
 *
 * Midwest (9): ann-arbor-mi, chicago-il, cincinnati-oh, cleveland-oh, columbus-oh,
 *   detroit-mi, grand-rapids-mi, indianapolis-in, milwaukee-wi
 *
 * Northeast (4): buffalo-ny, new-york-ny, philadelphia-pa, pittsburgh-pa
 *
 * West (3): denver-co, phoenix-az, scottsdale-az
 */
export const CITY_REGIONS: Record<string, Region> = {
  // South (US Census Bureau South region)
  "atlanta-ga": "South",
  "asheville-nc": "South",
  "austin-tx": "South",
  "birmingham-al": "South",
  "charleston-sc": "South",
  "charlotte-nc": "South",
  "dallas-tx": "South",
  "greenville-sc": "South",
  "houston-tx": "South",
  "memphis-tn": "South",
  "meridian-ms": "South",
  "oklahoma-city-ok": "South",
  "orlando-fl": "South",
  "st-petersburg-fl": "South",
  "tampa-fl": "South",
  "washington-dc": "South",

  // Midwest (US Census Bureau Midwest region)
  "ann-arbor-mi": "Midwest",
  "chicago-il": "Midwest",
  "cincinnati-oh": "Midwest",
  "cleveland-oh": "Midwest",
  "columbus-oh": "Midwest",
  "detroit-mi": "Midwest",
  "grand-rapids-mi": "Midwest",
  "indianapolis-in": "Midwest",
  "milwaukee-wi": "Midwest",

  // Northeast (US Census Bureau Northeast region)
  // Note: Buffalo, NY is geographically western NY but Census Bureau Northeast
  "buffalo-ny": "Northeast",
  "new-york-ny": "Northeast",
  "philadelphia-pa": "Northeast",
  "pittsburgh-pa": "Northeast",

  // West (US Census Bureau West region)
  "denver-co": "West",
  "phoenix-az": "West",
  "scottsdale-az": "West",
} as const;

/**
 * Returns all cities in the given region, sorted alphabetically by displayName.
 */
export function getCitiesByRegion(region: Region) {
  return METROS_DATA.filter((metro) => CITY_REGIONS[metro.name] === region).sort(
    (a, b) => a.displayName.localeCompare(b.displayName)
  );
}
