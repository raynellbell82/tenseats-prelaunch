/**
 * City data for all 32 Tenseats metro markets.
 * This file is the single source of truth for city page content.
 * Components import from here — never from Convex server code directly.
 */

export type CityData = {
  slug: string; // matches METROS_DATA[n].name
  displayName: string; // e.g. "Chicago, IL"
  state: string;
  heroHeadline: string; // 5-8 words
  heroSubhead: string; // 15-25 words
  metaTagline: string; // for page title
  metaDescription: string; // ~150 chars for SEO
  sceneIntro: string; // 30-50 words, describes the food scene
  sceneBlocks: [
    { heading: string; description: string; unsplashQuery: string },
    { heading: string; description: string; unsplashQuery: string },
    { heading: string; description: string; unsplashQuery: string },
  ];
  topPersonas: Array<{
    role: "chef" | "mixologist" | "venueHost" | "curator" | "guest";
    cityHeadline: string;
    cityDescription: string;
  }>;
  tier: 1 | 2 | 3;
};

// Re-exported from convex/metros.ts so city pages can import from one place
// without depending on Convex server code.
export const METROS_DATA = [
  {
    name: "atlanta-ga",
    displayName: "Atlanta, GA",
    cities: ["Atlanta"],
    state: "Georgia",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 33.749, lng: -84.388 },
  },
  {
    name: "ann-arbor-mi",
    displayName: "Ann Arbor, MI",
    cities: ["Ann Arbor"],
    state: "Michigan",
    country: "US",
    timezone: "America/Detroit",
    coordinates: { lat: 42.28, lng: -83.732 },
  },
  {
    name: "asheville-nc",
    displayName: "Asheville, NC",
    cities: ["Asheville"],
    state: "North Carolina",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 35.601, lng: -82.554 },
  },
  {
    name: "austin-tx",
    displayName: "Austin, TX",
    cities: ["Austin"],
    state: "Texas",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 30.267, lng: -97.743 },
  },
  {
    name: "birmingham-al",
    displayName: "Birmingham, AL",
    cities: ["Birmingham"],
    state: "Alabama",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 33.544, lng: -86.78 },
  },
  {
    name: "buffalo-ny",
    displayName: "Buffalo, NY",
    cities: ["Buffalo"],
    state: "New York",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 42.88, lng: -78.879 },
  },
  {
    name: "charleston-sc",
    displayName: "Charleston, SC",
    cities: ["Charleston"],
    state: "South Carolina",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 32.777, lng: -79.931 },
  },
  {
    name: "charlotte-nc",
    displayName: "Charlotte, NC",
    cities: ["Charlotte"],
    state: "North Carolina",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 35.227, lng: -80.843 },
  },
  {
    name: "chicago-il",
    displayName: "Chicago, IL",
    cities: ["Chicago"],
    state: "Illinois",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 41.85, lng: -87.65 },
  },
  {
    name: "cincinnati-oh",
    displayName: "Cincinnati, OH",
    cities: ["Cincinnati"],
    state: "Ohio",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 39.103, lng: -84.512 },
  },
  {
    name: "cleveland-oh",
    displayName: "Cleveland, OH",
    cities: ["Cleveland"],
    state: "Ohio",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 41.505, lng: -81.681 },
  },
  {
    name: "columbus-oh",
    displayName: "Columbus, OH",
    cities: ["Columbus"],
    state: "Ohio",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 39.961, lng: -82.999 },
  },
  {
    name: "dallas-tx",
    displayName: "Dallas, TX",
    cities: ["Dallas"],
    state: "Texas",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 32.783, lng: -96.807 },
  },
  {
    name: "denver-co",
    displayName: "Denver, CO",
    cities: ["Denver"],
    state: "Colorado",
    country: "US",
    timezone: "America/Denver",
    coordinates: { lat: 39.739, lng: -104.985 },
  },
  {
    name: "detroit-mi",
    displayName: "Detroit, MI",
    cities: ["Detroit"],
    state: "Michigan",
    country: "US",
    timezone: "America/Detroit",
    coordinates: { lat: 42.331, lng: -83.046 },
  },
  {
    name: "grand-rapids-mi",
    displayName: "Grand Rapids, MI",
    cities: ["Grand Rapids"],
    state: "Michigan",
    country: "US",
    timezone: "America/Detroit",
    coordinates: { lat: 42.963, lng: -85.668 },
  },
  {
    name: "greenville-sc",
    displayName: "Greenville, SC",
    cities: ["Greenville"],
    state: "South Carolina",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 34.853, lng: -82.394 },
  },
  {
    name: "houston-tx",
    displayName: "Houston, TX",
    cities: ["Houston"],
    state: "Texas",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 29.763, lng: -95.363 },
  },
  {
    name: "indianapolis-in",
    displayName: "Indianapolis, IN",
    cities: ["Indianapolis"],
    state: "Indiana",
    country: "US",
    timezone: "America/Indiana/Indianapolis",
    coordinates: { lat: 39.791, lng: -86.148 },
  },
  {
    name: "memphis-tn",
    displayName: "Memphis, TN",
    cities: ["Memphis"],
    state: "Tennessee",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 35.117, lng: -89.971 },
  },
  {
    name: "meridian-ms",
    displayName: "Meridian, MS",
    cities: ["Meridian"],
    state: "Mississippi",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 32.364, lng: -88.704 },
  },
  {
    name: "milwaukee-wi",
    displayName: "Milwaukee, WI",
    cities: ["Milwaukee"],
    state: "Wisconsin",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 43.039, lng: -87.906 },
  },
  {
    name: "new-york-ny",
    displayName: "New York, NY",
    cities: ["New York"],
    state: "New York",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 40.714, lng: -74.006 },
  },
  {
    name: "oklahoma-city-ok",
    displayName: "Oklahoma City, OK",
    cities: ["Oklahoma City"],
    state: "Oklahoma",
    country: "US",
    timezone: "America/Chicago",
    coordinates: { lat: 35.482, lng: -97.508 },
  },
  {
    name: "orlando-fl",
    displayName: "Orlando, FL",
    cities: ["Orlando"],
    state: "Florida",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 28.538, lng: -81.379 },
  },
  {
    name: "philadelphia-pa",
    displayName: "Philadelphia, PA",
    cities: ["Philadelphia"],
    state: "Pennsylvania",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 39.952, lng: -75.164 },
  },
  {
    name: "phoenix-az",
    displayName: "Phoenix, AZ",
    cities: ["Phoenix"],
    state: "Arizona",
    country: "US",
    timezone: "America/Phoenix",
    coordinates: { lat: 33.448, lng: -112.074 },
  },
  {
    name: "pittsburgh-pa",
    displayName: "Pittsburgh, PA",
    cities: ["Pittsburgh"],
    state: "Pennsylvania",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 40.441, lng: -79.996 },
  },
  {
    name: "scottsdale-az",
    displayName: "Scottsdale, AZ",
    cities: ["Scottsdale"],
    state: "Arizona",
    country: "US",
    timezone: "America/Phoenix",
    coordinates: { lat: 33.501, lng: -111.925 },
  },
  {
    name: "st-petersburg-fl",
    displayName: "St. Petersburg, FL",
    cities: ["St. Petersburg"],
    state: "Florida",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 27.773, lng: -82.64 },
  },
  {
    name: "tampa-fl",
    displayName: "Tampa, FL",
    cities: ["Tampa"],
    state: "Florida",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 27.948, lng: -82.458 },
  },
  {
    name: "washington-dc",
    displayName: "Washington, DC",
    cities: ["Washington"],
    state: "District of Columbia",
    country: "US",
    timezone: "America/New_York",
    coordinates: { lat: 38.895, lng: -77.036 },
  },
] as const;

// Populated in Task 2 — placeholder until fully populated
export const CITY_DATA: Record<string, CityData> = {};
