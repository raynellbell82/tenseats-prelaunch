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
    role: "chef" | "mixologist" | "venueHost" | "curator" | "guest" | "facilitator";
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

export const CITY_DATA: Record<string, CityData> = {
  // ─── TIER 1 ──────────────────────────────────────────────────────────────

  "chicago-il": {
    slug: "chicago-il",
    displayName: "Chicago, IL",
    state: "Illinois",
    heroHeadline: "Chicago's secret table is waiting.",
    heroSubhead:
      "13-seat counter dinners. Supper clubs that don't have a website. The city's best tables aren't listed anywhere. Yet.",
    metaTagline: "Chicago's Curated Food Events",
    metaDescription:
      "Pop-ups, supper clubs, and chef's tables in Chicago — Logan Square, Pilsen, Wicker Park, and beyond. Community-curated, never algorithmic.",
    sceneIntro:
      "Chicago's supper club scene is having a full revival. From intimate 13-seat counter dinners to immersive multi-room experiences with jazz transitions, the city's underground food culture runs deeper than any Yelp list.",
    sceneBlocks: [
      {
        heading: "The neighborhoods lead",
        description:
          "Logan Square, Pilsen, Wicker Park — every block has a chef incubating in someone's closed kitchen on a Monday night. These aren't restaurants. They're what comes before.",
        unsplashQuery: "chicago logan square food pop-up",
      },
      {
        heading: "The Chicano table",
        description:
          "Monthly tasting-menu dinners in a tamaleria. 13 seats. Nostalgic flavors from Danny Espinoza and Jhoana Ruiz. Spicy Thai supper clubs from ex-Lula chefs. This is what the city actually eats.",
        unsplashQuery: "chicago pilsen tasting dinner",
      },
      {
        heading: "Dining becomes an evening",
        description:
          "Chicago's supper club revival isn't about the food alone — it's the whiskey program that arrives after the plates are cleared, and the cabaret that begins when you weren't expecting it.",
        unsplashQuery: "chicago supper club cocktails",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Get past the algorithm",
        cityDescription:
          "The city's best tables fill by word of mouth, not Yelp reviews. Tenseats surfaces the supper clubs, pop-ups, and chef's tables that locals whisper about before anyone writes them up.",
      },
      {
        role: "chef",
        cityHeadline: "Host Chicago's next cult table",
        cityDescription:
          "Chicago's supper club culture rewards chefs who take risks in intimate spaces. Your 13-seat counter dinner could become the city's most whispered-about table in a single season.",
      },
      {
        role: "mixologist",
        cityHeadline: "Cocktail culture runs deep here",
        cityDescription:
          "Chicago's whiskey and craft cocktail scene is legendary. Partner your programs with supper clubs, pop-ups, and chef collaborations to reach guests who drink as seriously as they eat.",
      },
      {
        role: "curator",
        cityHeadline: "Chicago's underground moves fast",
        cityDescription:
          "Logan Square pop-ups, Pilsen supper clubs, Wicker Park borrowed kitchens — the scene rotates weekly and the press arrives months late. Curators who track which Monday nights matter are the city's essential insiders.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your space is the West Loop's next table",
        cityDescription:
          "Chicago's restaurant-dense West Loop proves that the right space draws the right chef. A converted loft, a closed kitchen on a dark night, a courtyard — connect it with the pop-up chefs who need exactly what you have.",
      },
      {
        role: "facilitator",
        cityHeadline: "Chicago's supper club scene needs connectors",
        cityDescription:
          "The chef incubating in a Pilsen kitchen needs an audience. The Wicker Park venue host needs the right concept. You know both sides of that equation — and in Chicago's whisper-network food culture, that introduction is everything.",
      },
    ],
    tier: 1,
  },

  "austin-tx": {
    slug: "austin-tx",
    displayName: "Austin, TX",
    state: "Texas",
    heroHeadline: "374 trucks. One seat matters.",
    heroSubhead:
      "Austin invented the modern food truck culture. Tenseats finds you the ones that sell out before they tweet.",
    metaTagline: "Austin's Curated Food Events",
    metaDescription:
      "Food trucks, pop-ups, chef's tables, and SXSW-adjacent tastings in Austin, TX. East Austin, Rainey Street, South Congress — curated by locals.",
    sceneIntro:
      "Austin is America's food truck capital — 374+ trucks and counting. But the real discoveries are the 40-person dinner series in East Austin backyards, the trailer park pop-up that doesn't have a website, and the mixologist doing mezcal pairing dinners in someone's loft on Rainey Street.",
    sceneBlocks: [
      {
        heading: "East Austin feeds the city",
        description:
          "East 6th, Mueller, Manor Road — the neighborhoods where chefs test concepts before anyone's watching. Pop-ups here become the brick-and-mortar landmarks of 2027.",
        unsplashQuery: "austin east sixth street food pop-up",
      },
      {
        heading: "The trailer park table",
        description:
          "South Congress trailer parks are a culinary institution. The best ones have no Instagram, no website, and a 2-hour wait on Saturdays. We help you find them before Saturday.",
        unsplashQuery: "austin south congress food trailer",
      },
      {
        heading: "Mezcal meets the table",
        description:
          "Austin's mixologist scene is quietly one of the country's best. Mezcal flights paired with smoked short rib, cocktail workshops in plant-filled lofts — the city drinks as thoughtfully as it eats.",
        unsplashQuery: "austin mezcal cocktail dinner pairing",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Find it before the crowd",
        cityDescription:
          "The food truck that sells out before it tweets, the pop-up without a website — Tenseats maps Austin's hidden food scene so you get access before the line forms.",
      },
      {
        role: "chef",
        cityHeadline: "Austin's pop-up culture is your launchpad",
        cityDescription:
          "East Austin backyards and trailer parks have launched careers. Test your concept in front of the city's most food-forward audience before anyone else has heard your name.",
      },
      {
        role: "mixologist",
        cityHeadline: "Mezcal and mesquite deserve a stage",
        cityDescription:
          "Austin's cocktail scene runs on mezcal flights, smoked agave programs, and Rainey Street loft collaborations with chefs. Bring your pairing dinners to a city that drinks as thoughtfully as it eats.",
      },
      {
        role: "curator",
        cityHeadline: "East Austin moves before anyone notices",
        cityDescription:
          "East 6th and Manor Road chefs test their best concepts in borrowed spaces before anyone is watching. Curators who know which trailer park pop-up matters this weekend are the city's most valuable insiders.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your backyard is a venue",
        cityDescription:
          "Austin's outdoor culture makes private spaces ideal for intimate dinners. List your backyard, rooftop, or loft with Tenseats and connect with chefs who need exactly what you have.",
      },
      {
        role: "facilitator",
        cityHeadline: "Austin's food and music scene need connectors",
        cityDescription:
          "East Austin has chefs who need spaces and venue hosts who need the right events. You know the trailer park operators, the backyard dinner regulars, and the Tex-Mex tasting-menu chefs building something serious — make the introduction.",
      },
    ],
    tier: 1,
  },

  "atlanta-ga": {
    slug: "atlanta-ga",
    displayName: "Atlanta, GA",
    state: "Georgia",
    heroHeadline: "Atlanta's food scene runs on Instagram.",
    heroSubhead:
      "Supper clubs in Cabbagetown. Pop-ups in Summerhill. Tomorrow's James Beard winners cooking in borrowed kitchens today.",
    metaTagline: "Atlanta's Curated Food Events",
    metaDescription:
      "Pop-ups, supper clubs, and underground dinners in Atlanta — Cabbagetown, Summerhill, OTP. The city's best chefs cook outside restaurants. Find them here.",
    sceneIntro:
      "Atlanta's underground dining scene is one of America's most exciting — and most Instagram-first. Monday nights belong to supper clubs. Borrowed kitchens incubate the city's next great restaurants. The Beltline connects it all.",
    sceneBlocks: [
      {
        heading: "Monday belongs to the underground",
        description:
          "When restaurants close for the week, Atlanta's best chefs open their borrowed kitchens to intimate supper clubs. Bovino After Dark. Seventh House. Dirt Church. Light Metal. The scene rotates weekly.",
        unsplashQuery: "atlanta supper club dinner underground",
      },
      {
        heading: "Pop-up to permanent",
        description:
          "More Atlanta restaurants trace their origin to a pop-up than any other city in the South. The Beltline's food corridor, Summerhill's independent blocks, and Cabbagetown's intimate corners are where tomorrow's names are cooking tonight.",
        unsplashQuery: "atlanta beltline pop-up food event",
      },
      {
        heading: "The wine wave",
        description:
          "Natural wine pop-ups, wine-centric supper clubs, and chef-sommelier collaborations have exploded across Atlanta's neighborhoods. The city's palate is evolving faster than its restaurant openings.",
        unsplashQuery: "atlanta natural wine pop-up dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Find what's whispered about",
        cityDescription:
          "The supper clubs without websites. The pop-ups that fill by text chain. Tenseats surfaces Atlanta's most coveted tables before the Instagram post goes up and the seats are gone.",
      },
      {
        role: "chef",
        cityHeadline: "Atlanta's pop-up pipeline is your path",
        cityDescription:
          "The city's borrowed kitchens on Monday nights have incubated some of the South's most-talked-about concepts. Atlanta's food community shows up for chefs who take risks in intimate spaces.",
      },
      {
        role: "mixologist",
        cityHeadline: "Atlanta's natural wine wave has room for you",
        cityDescription:
          "Natural wine pop-ups and chef-sommelier collaborations have spread across Summerhill and the Beltline corridor. Beverage professionals who can match Atlanta's evolving food ambition find an audience already primed.",
      },
      {
        role: "curator",
        cityHeadline: "Document what's real",
        cityDescription:
          "Atlanta's underground scene runs ahead of the press. Curators who know which borrowed kitchens open on which nights are the connective tissue of a scene the city hasn't fully acknowledged yet.",
      },
      {
        role: "venueHost",
        cityHeadline: "The Beltline runs through your space",
        cityDescription:
          "Atlanta's food culture flows along the Beltline corridor and into Cabbagetown's intimate side streets. Open your loft, studio, or outdoor space to the pop-up chefs who need exactly what the neighborhood provides.",
      },
      {
        role: "facilitator",
        cityHeadline: "Monday nights belong to the connectors",
        cityDescription:
          "Atlanta's borrowed-kitchen supper clubs thrive on the right introductions. You know which Summerhill venue host has a dark Monday and which pop-up chef is ready to fill it — and the city's food scene moves on that knowledge.",
      },
    ],
    tier: 1,
  },

  // ─── TIER 2 ──────────────────────────────────────────────────────────────

  "houston-tx": {
    slug: "houston-tx",
    displayName: "Houston, TX",
    state: "Texas",
    heroHeadline: "90 countries at the table.",
    heroSubhead:
      "Houston is America's most culinarily diverse city. Tenseats connects the food cultures that never made the list.",
    metaTagline: "Houston's Curated Food Events",
    metaDescription:
      "Pop-ups, food trucks, and multicultural dining experiences in Houston, TX. Viet-Cajun crawfish, Nigerian pop-ups, elevated Tex-Mex — community-curated.",
    sceneIntro:
      "Houston speaks 77 languages and represents 90+ countries in its food culture. The most authentic Viet-Cajun fusion, Nigerian pepper soup pop-ups, and Tex-Mex elevated to tasting menu territory — all happening in neighborhoods most visitors never reach.",
    sceneBlocks: [
      {
        heading: "Where diversity is the menu",
        description:
          "Mahatma Gandhi District, Bellaire, Alief — Houston's food story is written in neighborhoods. Every community brought its cuisine intact, and the city's pop-up scene is where those traditions meet modern presentation.",
        unsplashQuery: "houston multicultural food market",
      },
      {
        heading: "545 trucks, one standout",
        description:
          "Houston's food truck culture rivals Austin's in scale. The trucks that matter don't have Food Network deals — they have loyal regulars and rotating menus on group chats.",
        unsplashQuery: "houston food truck pop-up",
      },
      {
        heading: "The crawfish innovation scene",
        description:
          "Viet-Cajun crawfish boils are a Houston original. Pop-ups pushing this further — with Korean BBQ crossovers, elevated seasonings, and intimate crawfish-pairing dinners — are the city's most exciting culinary experiment.",
        unsplashQuery: "houston viet-cajun crawfish boil",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Discover Houston's full range",
        cityDescription:
          "Houston's most interesting meals happen in neighborhoods visitors never reach. Tenseats maps the pop-ups, communal dinners, and off-menu experiences across all 77 language communities.",
      },
      {
        role: "chef",
        cityHeadline: "Bring your tradition to the table",
        cityDescription:
          "Houston's multiculturalism is its greatest culinary asset. Chefs drawing on authentic food traditions from any of the city's 90 represented cultures find an audience hungry for exactly what they grew up cooking.",
      },
      {
        role: "mixologist",
        cityHeadline: "Viet-Cajun crawfish calls for the right drink",
        cityDescription:
          "Houston's crawfish boil innovation — Korean BBQ crossovers, elevated seasonings — has created pairing opportunities no other American city has. Bring your program to the pop-ups pushing that tradition further.",
      },
      {
        role: "curator",
        cityHeadline: "Document the city's real food story",
        cityDescription:
          "Houston's culinary diversity is one of America's best-kept secrets. Curators who surface and connect these food traditions across communities are doing some of the most meaningful work in the city.",
      },
      {
        role: "venueHost",
        cityHeadline: "Bellaire Chinatown has space for the right event",
        cityDescription:
          "Houston's Bellaire corridor, Mahatma Gandhi District, and Alief carry food cultures that deserve an intimate dining format. Your space in these neighborhoods connects the city's most authentic culinary communities to the right audience.",
      },
      {
        role: "facilitator",
        cityHeadline: "77 languages, one right introduction",
        cityDescription:
          "Houston's 90-country food culture creates connection opportunities no other city can match. You know which Nigerian pop-up chef needs a Bellaire kitchen and which Persian feast night needs the right guest list — make it happen.",
      },
    ],
    tier: 2,
  },

  "denver-co": {
    slug: "denver-co",
    displayName: "Denver, CO",
    state: "Colorado",
    heroHeadline: "NYT's #1 food city has a secret.",
    heroSubhead:
      "300+ nights of dining, and the ones worth attending aren't on OpenTable.",
    metaTagline: "Denver's Curated Food Events",
    metaDescription:
      "Farm-to-table pop-ups, altitude cocktail dinners, and chef's tables in Denver, CO. The New York Times' #1 food city, curated beyond the reservation platforms.",
    sceneIntro:
      "The New York Times named Denver the #1 restaurant city in 2025. But the best experiences aren't in the restaurants — they're in the farm-to-table tasting dinners that follow the growing season, the altitude-inspired cocktail workshops, and the chef's tables that open for one night only.",
    sceneBlocks: [
      {
        heading: "Farm to altitude",
        description:
          "Colorado's growing season is short and intense. Denver's best pop-up chefs build menus around the farmers market week — high-altitude heirloom tomatoes in August, elk and bison in October, preserved and fermented through winter.",
        unsplashQuery: "denver colorado farm to table seasonal dinner",
      },
      {
        heading: "The LoDo underground",
        description:
          "Lower Downtown Denver's historic warehouse district hides converted loft spaces and closed restaurant kitchens that become venues for intimate chef's tables every weekend. Half the fun is the location reveal.",
        unsplashQuery: "denver lodo warehouse supper club",
      },
      {
        heading: "Spirits of the mountains",
        description:
          "Colorado's craft spirits scene has produced some of the country's most innovative distilleries. The mixologists pairing high-altitude whiskey with hyper-seasonal small bites are doing something the bar world hasn't caught up to.",
        unsplashQuery: "colorado craft whiskey cocktail pairing dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Find Denver's off-platform tables",
        cityDescription:
          "The NYT called it the best food city. The best meals aren't in the guides. Tenseats surfaces the chef's tables, farm dinners, and LoDo underground experiences worth attending.",
      },
      {
        role: "chef",
        cityHeadline: "Build a menu from what's in season",
        cityDescription:
          "Denver's farm-forward dining culture rewards chefs who follow the growing season. Pop-up dinners built around weekly market hauls draw the city's most engaged food audience.",
      },
      {
        role: "mixologist",
        cityHeadline: "High-altitude cocktails deserve a stage",
        cityDescription:
          "Colorado's craft spirits and seasonal ingredients create cocktail opportunities no other city has. Pair your programs with Denver's pop-up dinner circuit and find guests who take drinking as seriously as eating.",
      },
      {
        role: "curator",
        cityHeadline: "Farm-to-altitude moves faster than the press",
        cityDescription:
          "Denver's seasonal pop-up circuit follows the Colorado growing calendar — August heirloom tomatoes, October elk and bison, winter ferments. Curators who track which chefs are cooking what, and when, hold the city's most valuable food knowledge.",
      },
      {
        role: "venueHost",
        cityHeadline: "LoDo's warehouse walls have good acoustics",
        cityDescription:
          "Lower Downtown's converted loft spaces and off-night kitchen spaces are exactly what Denver's pop-up scene needs. List your LoDo space with Tenseats and connect with the chefs making the city's most interesting meals.",
      },
      {
        role: "facilitator",
        cityHeadline: "Colorado's chef and farmer network needs you",
        cityDescription:
          "Denver's farm-to-table pop-up culture runs on relationships — which farm has surplus heirloom tomatoes this week, which LoDo kitchen is dark on Thursday. You know both sides and the right event follows.",
      },
    ],
    tier: 2,
  },

  "philadelphia-pa": {
    slug: "philadelphia-pa",
    displayName: "Philadelphia, PA",
    state: "Pennsylvania",
    heroHeadline: "BYOB and a secret location.",
    heroSubhead:
      "Philly invented the BYOB dinner culture. Tenseats finds you the pop-up that texted you the address this morning.",
    metaTagline: "Philadelphia's Curated Food Events",
    metaDescription:
      "BYOB dinners, pop-ups, and chef's tables in Philadelphia — Fishtown, East Passyunk, South Philly. Community-curated, address revealed the morning of.",
    sceneIntro:
      "Philadelphia's BYOB culture — a product of the city's distinctive licensing laws — created one of America's most intimate pop-up dining ecosystems. Fishtown warehouses, South Philly rowhomes, and East Passyunk side streets host the city's most creative food experiences.",
    sceneBlocks: [
      {
        heading: "BYOB is a culture, not a policy",
        description:
          "Bring your own wine to a 12-seat Italian supper club in a Fishtown row house. Text the address the morning of. This is how Philadelphia has always eaten best.",
        unsplashQuery: "philadelphia fishtown byob supper club dinner",
      },
      {
        heading: "Reading Terminal's shadow",
        description:
          "America's oldest farmers market inspires a generation of pop-up chefs who build menus around its vendors. Find the tasting dinner where the chef shops in the morning and cooks that evening.",
        unsplashQuery: "philadelphia reading terminal market chef dinner",
      },
      {
        heading: "East Passyunk after dark",
        description:
          "The corridor that built Philadelphia's modern restaurant reputation goes underground on off-nights. Borrowed kitchens, chef collaborations, and rotating pop-ups keep the neighborhood's creative energy alive year-round.",
        unsplashQuery: "philadelphia east passyunk pop-up dinner night",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "The address arrives the morning of",
        cityDescription:
          "Philadelphia's pop-up dinner circuit runs on trust and word of mouth. Tenseats gets you on the lists for the 12-seat supper clubs that fill by text chain before they ever go public.",
      },
      {
        role: "chef",
        cityHeadline: "Philly's BYOB culture was built for you",
        cityDescription:
          "Philadelphia's particular licensing laws mean intimate dinners in rowhomes and borrowed kitchens are the city's most beloved dining format. Your pop-up concept fits here better than anywhere else.",
      },
      {
        role: "mixologist",
        cityHeadline: "Bring the bottle to the borrowed kitchen",
        cityDescription:
          "Philadelphia's BYOB culture runs on the right pairing. Beverage professionals who collaborate with Fishtown pop-up chefs and East Passyunk borrowed kitchens find an audience that takes the full table seriously.",
      },
      {
        role: "curator",
        cityHeadline: "Fishtown's BYOB circuit needs a guide",
        cityDescription:
          "Philadelphia's pop-up dinner scene rotates through rowhomes and borrowed kitchens that rarely publish schedules. Curators who track the East Passyunk after-dark circuit and the Reading Terminal-inspired chef dinners are the city's most essential connectors.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your rowhome is the venue",
        cityDescription:
          "Fishtown rowhomes, South Philly dining rooms, and East Passyunk courtyards are perfect intimate dinner spaces. Connect with pop-up chefs who need your space for one perfect night.",
      },
      {
        role: "facilitator",
        cityHeadline: "Philly's BYOB circuit runs on introductions",
        cityDescription:
          "The pop-up chef who needs a Fishtown rowhome. The venue host who needs the right concept. The guest list that makes a 12-seat supper club feel curated rather than random. You know how to make all three work together.",
      },
    ],
    tier: 2,
  },

  "new-york-ny": {
    slug: "new-york-ny",
    displayName: "New York, NY",
    state: "New York",
    heroHeadline: "8 million people. Find the 12.",
    heroSubhead:
      "New York's deepest food experiences seat fewer people than your subway car. Tenseats finds them first.",
    metaTagline: "New York's Curated Food Events",
    metaDescription:
      "Underground dinners, pop-ups, and chef's tables in New York — Brooklyn warehouses, Queens street food, Manhattan apartment omakase. Not on Resy.",
    sceneIntro:
      "New York has more restaurants per capita than anywhere on earth. But the experiences worth traveling for — the 8-seat Greenpoint pop-up, the Brooklyn warehouse supper club, the Queens chef cooking her grandmother's province in a borrowed kitchen — don't have Resy pages.",
    sceneBlocks: [
      {
        heading: "Brooklyn warehouse culture",
        description:
          "Bushwick, Greenpoint, Crown Heights — the warehouses and lofts that host New York's most adventurous food events have no signage and frequently change location. They run on Instagram DMs and word of mouth.",
        unsplashQuery: "brooklyn warehouse supper club dinner underground",
      },
      {
        heading: "Queens is the table",
        description:
          "Jackson Heights, Flushing, Woodside — the world's most diverse cuisine corridor. The chefs cooking here represent traditions that Michelin hasn't discovered. Pop-ups bringing these kitchens to intimate table settings are the most honest food experiences in the city.",
        unsplashQuery: "queens new york diverse food pop-up",
      },
      {
        heading: "The chef's table without the reservation",
        description:
          "Manhattan's omakase explosion has a shadow economy of chef's table experiences in apartments, art studios, and borrowed restaurant spaces — at a fraction of the price, with far more personality.",
        unsplashQuery: "manhattan intimate chef table omakase apartment",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Find the 12 seats worth finding",
        cityDescription:
          "In a city with 26,000 options, the meals worth remembering don't have Resy pages. Tenseats surfaces the 8-seat Greenpoint pop-ups and Brooklyn warehouse dinners before they fill.",
      },
      {
        role: "chef",
        cityHeadline: "New York's underground is your stage",
        cityDescription:
          "The city's most talked-about culinary moments happen in borrowed kitchens and warehouse pop-ups before anyone has a permanent address. New York rewards the chef who shows up first.",
      },
      {
        role: "mixologist",
        cityHeadline: "Bushwick warehouses need your program",
        cityDescription:
          "New York's underground dinner circuit runs through Bushwick and Greenpoint spaces that open for one night and move the next. Beverage professionals who can match the pace of the outer-borough pop-up scene find an audience already primed.",
      },
      {
        role: "curator",
        cityHeadline: "New York needs better maps",
        cityDescription:
          "The city's underground food scene is vast and fast-moving. Curators who track the Queens pop-up circuit, the Bushwick warehouse dinners, and the apartment omakase circuit are doing work the city's food media can't keep up with.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your apartment is the next omakase",
        cityDescription:
          "Manhattan's shadow omakase economy runs through art studios, lofts, and borrowed spaces at a fraction of the Midtown price. List your space and connect with the chefs who make those evenings worth attending.",
      },
      {
        role: "facilitator",
        cityHeadline: "The outer-borough circuit needs connectors",
        cityDescription:
          "Jackson Heights chefs, Bushwick warehouse hosts, Crown Heights guest lists — New York's underground moves on Instagram DMs and the right introduction. You know which chef needs which space and which night to make it work.",
      },
    ],
    tier: 2,
  },

  "washington-dc": {
    slug: "washington-dc",
    displayName: "Washington, DC",
    state: "District of Columbia",
    heroHeadline: "100,000 attend the BBQ Battle.",
    heroSubhead:
      "DC's food scene is as international as its diplomats — and most of it never makes the press. Tenseats maps what locals already know.",
    metaTagline: "DC's Curated Food Events",
    metaDescription:
      "Pop-ups, supper clubs, and international dining experiences in Washington DC — Shaw, 14th Street, Georgetown. Community-curated, not press-covered.",
    sceneIntro:
      "Washington DC's diplomatic community means 170+ countries are represented in its food culture — and the pop-up dinners, international supper clubs, and chef's tables drawing on this diversity are the city's greatest culinary secret.",
    sceneBlocks: [
      {
        heading: "14th Street NW after hours",
        description:
          "Shaw, Logan Circle, and the 14th Street corridor have spawned a pop-up culture that rivals any coastal city. Borrowed spaces, rotating chefs, and intimate seatings that rarely get press coverage.",
        unsplashQuery: "washington dc shaw 14th street pop-up dinner",
      },
      {
        heading: "Embassy Row to your table",
        description:
          "The diplomat community's home cooks and professional chefs create a rotating pop-up circuit of culinary diplomacy — Nigerian street food, Persian feast nights, Filipino kamayan dinners — all happening in private spaces.",
        unsplashQuery: "dc international supper club diplomat dinner",
      },
      {
        heading: "Georgetown's hidden tables",
        description:
          "Behind the tourist-facing restaurants, Georgetown's historic homes and garden spaces host some of DC's most civilized dining experiences — seasonal, intimate, and completely off-platform until now.",
        unsplashQuery: "georgetown dc historic home garden supper",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "The city's international tables await",
        cityDescription:
          "DC's pop-up circuit draws on 170 countries worth of culinary tradition. Tenseats surfaces the Filipino kamayan dinners, Persian feast nights, and international supper clubs happening in private DC spaces.",
      },
      {
        role: "chef",
        cityHeadline: "Cook for the city's most connected table",
        cityDescription:
          "DC's diplomatic community and policy world create a dining audience unlike any other city. Pop-ups here reach a globally literate crowd that can take a chef's reputation international.",
      },
      {
        role: "mixologist",
        cityHeadline: "The 14th Street corridor wants your program",
        cityDescription:
          "Shaw and Logan Circle's pop-up circuit has generated cocktail collaboration opportunities that rarely surface in DC food coverage. Partner with the borrowed-kitchen chef scene and reach a crowd that drinks with intention.",
      },
      {
        role: "curator",
        cityHeadline: "DC's best food goes unreported",
        cityDescription:
          "The city's most interesting meals happen in private spaces that the Washingtonian food section never covers. Curators who map DC's international pop-up circuit are the city's essential food guides.",
      },
      {
        role: "venueHost",
        cityHeadline: "Georgetown's garden spaces have the right guests",
        cityDescription:
          "DC's historic homes, embassy-adjacent gardens, and Shaw warehouse lofts host some of the city's most civilized dinners. Connect your space with pop-up chefs drawing on the city's diplomatic culinary diversity.",
      },
      {
        role: "facilitator",
        cityHeadline: "Embassy Row runs on the right introductions",
        cityDescription:
          "DC's international pop-up circuit — Nigerian feast nights, Persian kamayan dinners, Ethiopian-adjacent collaborations — depends on connectors who know which chefs are ready and which private spaces are available. That's your role here.",
      },
    ],
    tier: 2,
  },

  "charleston-sc": {
    slug: "charleston-sc",
    displayName: "Charleston, SC",
    state: "South Carolina",
    heroHeadline: "Gullah Geechee has a seat for you.",
    heroSubhead:
      "James Beard winners cook here. The traditions they draw from are older than the buildings. Tenseats finds both.",
    metaTagline: "Charleston's Curated Food Events",
    metaDescription:
      "Supper clubs, chef's tables, and Lowcountry dinners in Charleston, SC. Gullah Geechee traditions, local seafood, James Beard-recognized chefs — curated.",
    sceneIntro:
      "Charleston's food heritage runs centuries deep — Gullah Geechee traditions, rice culture, local seafood — and its modern chefs are exploring that history in intimate settings that the Wine + Food Festival only scratches the surface of.",
    sceneBlocks: [
      {
        heading: "The Lowcountry table",
        description:
          "She-crab soup, okra soups, hoppin' John — Charleston's food heritage is among America's most culturally rich. Pop-ups reconnecting this tradition to modern technique are the city's most meaningful dining experiences.",
        unsplashQuery: "charleston lowcountry gullah geechee dinner",
      },
      {
        heading: "James Beard country",
        description:
          "Charleston produces more James Beard-recognized chefs per capita than almost any American city. Many of them run intimate chef's table experiences between restaurant shifts. Find them before the next nomination.",
        unsplashQuery: "charleston chef table intimate dinner",
      },
      {
        heading: "Dock Street to backyard table",
        description:
          "Charleston's historic architecture — porches, gardens, piazzas — creates natural venues for intimate outdoor supper clubs. The city's best meals often happen in someone's backyard.",
        unsplashQuery: "charleston historic porch garden supper club",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Beyond the Wine + Food Festival",
        cityDescription:
          "The real Charleston dining experience doesn't happen during festival weekend. Tenseats surfaces the year-round pop-ups, borrowed kitchen dinners, and backyard supper clubs where the city's best chefs cook freely.",
      },
      {
        role: "chef",
        cityHeadline: "Charleston's heritage is your canvas",
        cityDescription:
          "The Lowcountry's food traditions — Gullah Geechee, rice culture, tidal seafood — offer chefs a culinary heritage unlike anywhere else in America. Intimate pop-ups here carry real cultural weight.",
      },
      {
        role: "mixologist",
        cityHeadline: "Lowcountry terroir calls for the right pairing",
        cityDescription:
          "She-crab soup, sea island okra, and tidal shellfish create pairing opportunities specific to Charleston's ingredient terroir. Beverage professionals who collaborate with upper King Street chefs find an audience that takes the full experience seriously.",
      },
      {
        role: "curator",
        cityHeadline: "The Lowcountry table needs documentation",
        cityDescription:
          "Charleston's food heritage — Gullah Geechee cooking, rice traditions, tidal seafood — is deep and often overlooked by the festival-season press. Curators who track and surface the year-round borrowed kitchen scene carry the city's real food story.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your piazza is a dining room",
        cityDescription:
          "Charleston's historic architecture creates intimate dinner venues the world doesn't have. Connect your porch, garden, or courtyard with the pop-up chefs who want to cook in the most atmospheric setting in the South.",
      },
      {
        role: "facilitator",
        cityHeadline: "Upper King's table runs on the right match",
        cityDescription:
          "Charleston's pop-up scene pairs James Beard-caliber chefs with piazzas, historic garden spaces, and borrowed kitchens across the peninsula. You know which chef is ready and which space is open — the right evening follows.",
      },
    ],
    tier: 2,
  },

  "asheville-nc": {
    slug: "asheville-nc",
    displayName: "Asheville, NC",
    state: "North Carolina",
    heroHeadline: "Foodtopia is what locals call it.",
    heroSubhead:
      "James Beard recognition. Mountain-to-table cuisine. A River Arts District that feeds as well as it paints.",
    metaTagline: "Asheville's Curated Food Events",
    metaDescription:
      "Farm pop-ups, craft pairing dinners, and Appalachian food events in Asheville, NC. The River Arts District, mountain-to-table chefs — curated by locals.",
    sceneIntro:
      "Asheville branded itself 'Foodtopia' for a reason. The confluence of Appalachian food traditions, a thriving craft brewery culture, farm-forward cooking, and one of America's most creative arts scenes has produced a food culture punching far above its population.",
    sceneBlocks: [
      {
        heading: "Mountain to table",
        description:
          "Appalachian food traditions — ramps, pawpaws, sorghum, heirloom beans — meet modern technique in Asheville's most interesting pop-ups. The chefs sourcing within 50 miles are making the city's most honest food.",
        unsplashQuery: "asheville appalachian mountain farm dinner",
      },
      {
        heading: "River Arts District eats",
        description:
          "The studios that line the French Broad River regularly open for food events, chef collaborations, and farm-table suppers. Art and food share the same communal spirit here.",
        unsplashQuery: "asheville river arts district food event",
      },
      {
        heading: "The fermentation frontier",
        description:
          "Asheville's craft beverage culture — beer, cider, mead, and now wine — has spawned a pairing dinner circuit unlike any other mid-sized city. Every weekend, someone is doing something interesting with local ferments and Appalachian plates.",
        unsplashQuery: "asheville craft beer fermentation pairing dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Foodtopia's best-kept tables",
        cityDescription:
          "The James Beard recognition is real, but the city's most interesting meals happen in River Arts District studios and farmhouse dinner spaces. Tenseats maps the pop-ups that Foodtopia's best locals attend.",
      },
      {
        role: "chef",
        cityHeadline: "Appalachian tradition is your pantry",
        cityDescription:
          "Asheville's food culture rewards chefs who root their work in the mountains. Ramps, pawpaws, heirloom grains — pop-ups built on authentic local sourcing find the city's most passionate audience.",
      },
      {
        role: "mixologist",
        cityHeadline: "The fermentation capital needs your programs",
        cityDescription:
          "Asheville's craft beverage scene is one of America's richest. Cider, mead, beer, and emerging wine culture create pairing opportunities that no other mid-sized city offers for cocktail and beverage professionals.",
      },
      {
        role: "curator",
        cityHeadline: "River Arts District studios tell the full story",
        cityDescription:
          "Asheville's food culture runs through French Broad River studios, farmhouse supper tables, and craft fermentation events that rarely make regional press. Curators who track the full Foodtopia calendar hold the city's most honest food knowledge.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your studio is the next farm supper",
        cityDescription:
          "River Arts District studios, mountain farmhouse spaces, and converted Appalachian barns are exactly the setting that Asheville's farm-forward pop-up chefs seek. Connect your space with the chefs rooting their work in the mountains.",
      },
      {
        role: "facilitator",
        cityHeadline: "Foodtopia runs on the right connections",
        cityDescription:
          "Asheville's craft beverage producers, Appalachian-sourcing chefs, and River Arts District venue hosts form a tight ecosystem. You know who needs whom — and the right pairing dinner or farm supper follows from that knowledge.",
      },
    ],
    tier: 2,
  },

  "dallas-tx": {
    slug: "dallas-tx",
    displayName: "Dallas, TX",
    state: "Texas",
    heroHeadline: "Deep Ellum has always been underground.",
    heroSubhead:
      "Dallas's arts and music district is becoming its pop-up capital. Tenseats finds the tables first.",
    metaTagline: "Dallas's Curated Food Events",
    metaDescription:
      "Pop-ups, supper clubs, and underground dinners in Dallas — Deep Ellum, Bishop Arts, Design District. Community-curated, not in the Dallas Morning News.",
    sceneIntro:
      "Dallas is larger than its food reputation suggests. Bishop Arts, Deep Ellum, and the Design District are incubating a pop-up scene drawing on the city's Mexican-American traditions, Vietnamese community, and growing chef roster.",
    sceneBlocks: [
      {
        heading: "Deep Ellum after the gig",
        description:
          "The neighborhood that built Dallas's music culture is now doing the same for its food scene. Off-night restaurant pop-ups, warehouse supper clubs, and chef collectives are finding an audience that was already there for the shows.",
        unsplashQuery: "dallas deep ellum pop-up dinner music venue",
      },
      {
        heading: "Bishop Arts' hidden tables",
        description:
          "The walkable micro-neighborhood that inspired Dallas's urban revival hosts intimate dinner experiences in its converted homes and studios. These seatings don't make the Dallas Morning News food section.",
        unsplashQuery: "dallas bishop arts intimate supper dinner",
      },
      {
        heading: "Tex-Mex elevated",
        description:
          "Dallas's Mexican-American community has always known what the food media is slowly discovering — that this cuisine, done properly and with care, belongs in the tasting menu conversation. Pop-ups making that case are happening every week.",
        unsplashQuery: "dallas tex-mex elevated tasting menu pop-up",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Dallas eats better than its reputation",
        cityDescription:
          "Beyond the steakhouses, Dallas has a thriving pop-up culture in Deep Ellum, Bishop Arts, and the Design District. Tenseats surfaces the seatings that don't make the food section.",
      },
      {
        role: "chef",
        cityHeadline: "Deep Ellum's audience is ready for you",
        cityDescription:
          "Dallas's music and arts community is exactly the audience adventurous pop-up chefs need. The neighborhood that built the city's creative culture is now building its underground food scene too.",
      },
      {
        role: "mixologist",
        cityHeadline: "Deep Ellum after the show needs a drink",
        cityDescription:
          "Dallas's music venue culture and its emerging pop-up dinner scene share the same Deep Ellum streets. Beverage professionals who partner with Bishop Arts chefs find an audience already gathered and ready to extend the evening.",
      },
      {
        role: "curator",
        cityHeadline: "Dallas's hidden food scene needs a map",
        cityDescription:
          "The city's Mexican-American culinary traditions, Vietnamese community food culture, and growing chef roster are building something significant. Curators who can surface and connect these scenes are doing essential work.",
      },
      {
        role: "venueHost",
        cityHeadline: "Bishop Arts converted spaces need the right events",
        cityDescription:
          "Bishop Arts District's converted homes and studio spaces and Deep Ellum's warehouse floors are exactly the venue format Dallas's pop-up chefs need. Connect your space with chefs who want to cook for the city's most engaged audience.",
      },
      {
        role: "facilitator",
        cityHeadline: "Dallas's Tex-Mex tasting scene needs connectors",
        cityDescription:
          "Dallas chefs pushing interior Mexican and Tex-Mex tasting menus need the right venues, guest lists, and timing. You know the Bishop Arts hosts, the Deep Ellum kitchen operators, and the guests who will show up for something serious.",
      },
    ],
    tier: 2,
  },

  "detroit-mi": {
    slug: "detroit-mi",
    displayName: "Detroit, MI",
    state: "Michigan",
    heroHeadline: "Detroit. Pop-up to permanent.",
    heroSubhead:
      "Eastern Market. Corktown. The pop-up-to-permanent pipeline is stronger here than anywhere. Get in at the beginning.",
    metaTagline: "Detroit's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and Eastern Market events in Detroit, MI — Corktown, Midtown, Eastern Market. The city's comeback story eats well.",
    sceneIntro:
      "Detroit has one of America's strongest pop-up-to-brick-and-mortar pipelines. Eastern Market's weekend food culture, Corktown's creative reinvention, and Midtown's arts-adjacent dining scene make the city a template for how underground food culture becomes legacy.",
    sceneBlocks: [
      {
        heading: "Eastern Market on Saturday",
        description:
          "The largest historic public market in the US is also Detroit's food incubator. The pop-ups running alongside the stalls every weekend are testing the menus that will anchor the city's next great restaurants.",
        unsplashQuery: "detroit eastern market saturday food pop-up",
      },
      {
        heading: "Corktown's kitchen experiments",
        description:
          "Detroit's oldest neighborhood has become a canvas for chefs who want to take risks. Borrowed kitchens, experimental menus, and intimate seatings are the new Corktown energy.",
        unsplashQuery: "detroit corktown chef kitchen pop-up dinner",
      },
      {
        heading: "The comeback story eats well",
        description:
          "Detroit's resilience narrative is real. The chefs who stayed through the hard years — and the young ones returning now — are creating a food culture with genuine roots and ambition.",
        unsplashQuery: "detroit midtown food supper club dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Get in at the beginning",
        cityDescription:
          "The chefs building Detroit's next generation of tables are testing menus in borrowed Corktown kitchens right now. Tenseats puts you at those seats before the James Beard nomination and the 6-month wait list.",
      },
      {
        role: "chef",
        cityHeadline: "Detroit's pop-up pipeline is your launchpad",
        cityDescription:
          "More than any other American city, Detroit turns pop-ups into permanent institutions. Eastern Market Saturdays have launched careers. The city's food community shows up and stays loyal.",
      },
      {
        role: "mixologist",
        cityHeadline: "Corktown is ready for your cocktail program",
        cityDescription:
          "Detroit's craft spirits scene is growing alongside its food revival. Pop-up bars and cocktail collaborations in Corktown and Midtown spaces find an audience that takes beverages as seriously as the food they're paired with.",
      },
      {
        role: "curator",
        cityHeadline: "Document Detroit's comeback story, dish by dish",
        cityDescription:
          "The chefs who stayed through the hard years and the young ones returning now are making food with genuine roots. Curators who surface the Eastern Market pop-up circuit and Corktown experiments are writing the city's most honest food history.",
      },
      {
        role: "venueHost",
        cityHeadline: "Detroit's spaces need the right events",
        cityDescription:
          "Corktown lofts, Midtown warehouse spaces, and Eastern Market stalls create intimate venues that match Detroit's creative energy. Connect your space with the pop-up chefs building the city's food future.",
      },
      {
        role: "facilitator",
        cityHeadline: "Connect Eastern Market chefs to Midtown stages",
        cityDescription:
          "Detroit's pop-up-to-permanent pipeline runs on the right introductions. You know which Corktown kitchen has a free Tuesday, which Eastern Market chef needs a proper venue, and which Midtown space is looking for a dining series. Make the match.",
      },
    ],
    tier: 2,
  },

  "charlotte-nc": {
    slug: "charlotte-nc",
    displayName: "Charlotte, NC",
    state: "North Carolina",
    heroHeadline: "South End's kept the best secret.",
    heroSubhead:
      "Plaza Midwood's pop-up scene is building what Charlotte becomes. Get in before the city catches on.",
    metaTagline: "Charlotte's Curated Food Events",
    metaDescription:
      "Pop-ups, supper clubs, and chef dinners in Charlotte, NC — Plaza Midwood, NoDa, South End. The city's food scene is growing up fast.",
    sceneIntro:
      "Charlotte is in a culinary adolescence — growing rapidly, with chefs and concepts arriving from coast to coast and a local food culture deepening in Plaza Midwood, NoDa, and the South End. The pop-ups happening now are the foundation of what the city's food scene becomes.",
    sceneBlocks: [
      {
        heading: "Plaza Midwood leads",
        description:
          "The neighborhood's eclectic mix of long-term residents and creative newcomers has created a pop-up culture that feels authentic — not transplanted. The chefs here are committed to place.",
        unsplashQuery: "charlotte plaza midwood pop-up dinner",
      },
      {
        heading: "Southern food redrawn",
        description:
          "Charlotte chefs are engaged in a serious conversation about what Southern food means in a rapidly diversifying city. The pop-ups exploring this tension are the most intellectually interesting meals you'll find.",
        unsplashQuery: "charlotte southern food chef tasting dinner",
      },
      {
        heading: "NoDa's creative table",
        description:
          "Charlotte's arts district translates directly to food culture — studio spaces, gallery pop-ups, and collaborative dinners between chefs and artists happen with enough regularity to build community.",
        unsplashQuery: "charlotte noda arts district food event",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Charlotte eats better than you think",
        cityDescription:
          "The city's underground pop-up circuit in Plaza Midwood, NoDa, and South End is building something real. Tenseats surfaces the dinners happening before the city's food reputation catches up to the actual food.",
      },
      {
        role: "chef",
        cityHeadline: "Build something before Charlotte catches up",
        cityDescription:
          "Charlotte's food scene is growing faster than its reputation. Chefs who establish pop-up presence now in Plaza Midwood and NoDa will become the foundational names when the city's food culture reaches its next level.",
      },
      {
        role: "mixologist",
        cityHeadline: "NoDa's arts scene is thirsty for you",
        cityDescription:
          "South End's breweries built the foundation; the next chapter belongs to cocktail professionals who understand Charlotte's New South identity. Pop-up bar programs in NoDa gallery spaces and Plaza Midwood venues find a crowd ready for something with more intention.",
      },
      {
        role: "curator",
        cityHeadline: "Document Charlotte's food coming-of-age",
        cityDescription:
          "The city is in a culinary adolescence — growing fast and finding its identity. Curators who track the Plaza Midwood pop-ups and NoDa collaborative dinners are capturing something that won't look the same in three years.",
      },
      {
        role: "venueHost",
        cityHeadline: "Plaza Midwood spaces match the moment",
        cityDescription:
          "The neighborhood's converted homes, studio galleries, and independent retail back rooms are the right scale for Charlotte's emerging pop-up culture. Connect your space with the chefs who are building what the city becomes.",
      },
      {
        role: "facilitator",
        cityHeadline: "Charlotte's chefs need the right connections",
        cityDescription:
          "The Plaza Midwood pop-up circuit is growing faster than its infrastructure. You know which NoDa gallery opens its kitchen on off nights, which South End venue needs a chef series, and which new arrival needs an introduction to the city's food community.",
      },
    ],
    tier: 2,
  },

  "columbus-oh": {
    slug: "columbus-oh",
    displayName: "Columbus, OH",
    state: "Ohio",
    heroHeadline: "Condé Nast called it. Locals knew first.",
    heroSubhead:
      "Columbus was recognized as one of America's next great food cities. The Short North's pop-up scene proves they were right.",
    metaTagline: "Columbus's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Columbus, OH — Short North, German Village, Franklinton. One of America's emerging food cities, curated by locals.",
    sceneIntro:
      "Columbus punches far above its weight in food culture. A combination of Ohio State's international student community, a strong independent restaurant ethos, and Short North's walkable arts corridor has built one of the Midwest's most vibrant emerging food scenes.",
    sceneBlocks: [
      {
        heading: "Short North's independent spirit",
        description:
          "The corridor that built Columbus's arts identity has done the same for its food scene. Rotating pop-ups, chef-driven tasting events, and food hall culture draw on the neighborhood's creative energy.",
        unsplashQuery: "columbus ohio short north pop-up dinner arts",
      },
      {
        heading: "The international kitchen",
        description:
          "OSU's global student community has generated authentic culinary communities across every cuisine. The pop-ups drawing on these traditions — Korean fermentation dinners, West African feast nights, Taiwanese street food experiences — are the most genuine meals in the city.",
        unsplashQuery: "columbus international food pop-up dinner",
      },
      {
        heading: "Hyde Park to Short North",
        description:
          "Columbus's geography of neighborhoods creates distinct food cultures. The pop-ups that travel between them — setting up in different venues across the city — are building audiences that no single neighborhood could provide.",
        unsplashQuery: "columbus ohio neighborhood food community dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Columbus food is better than advertised",
        cityDescription:
          "The Condé Nast recognition was deserved. The Short North pop-up circuit and OSU's international food community create genuinely interesting dining you won't find anywhere else in the Midwest.",
      },
      {
        role: "chef",
        cityHeadline: "Columbus's growth is your opportunity",
        cityDescription:
          "The Short North is becoming one of the Midwest's most interesting food corridors. Pop-up chefs who establish here now build audiences before the national press arrives to confirm what locals already know.",
      },
      {
        role: "mixologist",
        cityHeadline: "Short North crowds are ready for craft",
        cityDescription:
          "Columbus's German Village beer heritage has given way to a serious cocktail culture in the Short North. Pop-up bar programs in gallery-adjacent spaces and artist studios find an audience that treats beverages as seriously as the food.",
      },
      {
        role: "curator",
        cityHeadline: "Map Columbus's emerging scene",
        cityDescription:
          "Columbus's food scene is developing faster than its documentation. Curators who surface the Short North pop-ups, Franklinton art-dinner hybrids, and OSU-adjacent international food events are creating the guides the city needs.",
      },
      {
        role: "venueHost",
        cityHeadline: "Short North spaces make the evening",
        cityDescription:
          "The corridor's renovated storefronts, arts studios, and historic buildings create intimate settings for pop-up dinners that match Columbus's creative energy. Connect your space with the chefs building the city's next chapter.",
      },
      {
        role: "facilitator",
        cityHeadline: "Short North pop-ups run on introductions",
        cityDescription:
          "Columbus's food scene is moving faster than its rolodex. You know which Franklinton art space is open on Mondays, which OSU-trained chef is looking for a German Village venue, and which Short North crowd is worth inviting to a new concept.",
      },
    ],
    tier: 2,
  },

  "orlando-fl": {
    slug: "orlando-fl",
    displayName: "Orlando, FL",
    state: "Florida",
    heroHeadline: "#1 food trucks per capita. Zero reasons to stay in the parks.",
    heroSubhead:
      "The real Orlando doesn't serve churros by a carousel. It's in Mills 50, Audubon Park, and the chef's tables happening after the tourists leave.",
    metaTagline: "Orlando's Curated Food Events",
    metaDescription:
      "Food trucks, pop-ups, and chef dinners in Orlando, FL — Mills 50, Audubon Park, Thornton Park. The real Orlando food scene, beyond the theme parks.",
    sceneIntro:
      "Orlando's food identity beyond theme parks is one of America's best-kept secrets. Mills 50's authentic Asian food corridor, Audubon Park's garden district dining, and the craft food truck culture (the highest per-capita in America) tell the real story.",
    sceneBlocks: [
      {
        heading: "Mills 50 is the real magic kingdom",
        description:
          "The Asian restaurant and market corridor along Mills Avenue and Colonial Drive has no branding, no theme music, and no wait if you know when to go. Pop-ups here represent authentic cooking traditions rarely found outside major coastal cities.",
        unsplashQuery: "orlando mills 50 asian food market pop-up",
      },
      {
        heading: "Audubon Park's garden table",
        description:
          "The walkable neighborhood around Audubon Park has spawned a dining culture that prioritizes provenance, community, and the personal relationship between chef and diner that theme park food never offers.",
        unsplashQuery: "orlando audubon park garden dinner community",
      },
      {
        heading: "The truck culture goes upmarket",
        description:
          "Orlando's food truck scene — the highest concentration in America — has matured into curated truck rally events, chef-driven mobile concepts, and pairing dinners served out of custom-built trailers. FoodieLand events here draw national attention.",
        unsplashQuery: "orlando food truck rally chef dinner upscale",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Skip the parks. Find the tables.",
        cityDescription:
          "Tenseats maps the real Orlando — the Mills 50 pop-ups, the Audubon Park garden dinners, and the chef's tables that happen after the tourists head back to their hotels for the night.",
      },
      {
        role: "chef",
        cityHeadline: "Orlando's locals are hungry for you",
        cityDescription:
          "The city's 75 million annual tourists create the impression of a monoculture. But Orlando's local food scene — Mills 50, Audubon Park, Thornton Park — has a passionate audience that shows up for real food experiences.",
      },
      {
        role: "mixologist",
        cityHeadline: "Mills 50 is the right crowd for craft",
        cityDescription:
          "The Vietnamese and Southeast Asian corridor along Colonial Drive has no shortage of adventurous palates. Pop-up cocktail programs that engage with regional spirits, tropical ingredients, and the neighborhood's immigrant food traditions find an audience that doesn't need to be convinced.",
      },
      {
        role: "curator",
        cityHeadline: "The real Orlando is waiting to be mapped",
        cityDescription:
          "The city's Mills 50 corridor, Winter Park farmers market circuit, and Audubon Park dining community exist almost entirely outside the national food press. Curators who document this scene are telling a story no one else is telling.",
      },
      {
        role: "venueHost",
        cityHeadline: "Orlando has the best event spaces no one knows about",
        cityDescription:
          "Garden spaces, converted warehouse venues, and private dining rooms in local neighborhoods offer everything theme park venues don't — authenticity, intimacy, and a local audience who comes back.",
      },
      {
        role: "facilitator",
        cityHeadline: "Connect Mills 50 chefs to Audubon Park audiences",
        cityDescription:
          "Orlando's local food community is spread across neighborhoods that don't always talk to each other. You know which Winter Park pop-up chef is looking for a Thornton Park venue, and which Audubon Park space has the right audience for a Mills 50 collaboration.",
      },
    ],
    tier: 2,
  },

  // ─── TIER 3 ──────────────────────────────────────────────────────────────

  "cincinnati-oh": {
    slug: "cincinnati-oh",
    displayName: "Cincinnati, OH",
    state: "Ohio",
    heroHeadline: "Over-the-Rhine has a table with your name.",
    heroSubhead:
      "Findlay Market. OTR's revival. Cincinnati's food scene is deeper than its reputation.",
    metaTagline: "Cincinnati's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Cincinnati, OH — Over-the-Rhine, Findlay Market, Northside. The city's food scene runs deeper than its reputation.",
    sceneIntro:
      "Cincinnati's OTR revival is complete — now the pop-up culture in its wake is the interesting story. Findlay Market, America's oldest continuously operating public market, anchors a food community that reaches across the city's neighborhoods.",
    sceneBlocks: [
      {
        heading: "Findlay Market's pop-up circuit",
        description:
          "America's oldest continuously operating public market is also Cincinnati's food incubator. Chefs who test concepts here on weekends build loyal audiences before they ever sign a lease.",
        unsplashQuery: "cincinnati findlay market pop-up food",
      },
      {
        heading: "OTR's second act",
        description:
          "Over-the-Rhine's historic Italianate architecture has become one of America's great urban food corridors. The pop-ups and supper clubs using its renovated spaces are the neighborhood's most interesting story since the revival itself.",
        unsplashQuery: "cincinnati over-the-rhine supper club dinner",
      },
      {
        heading: "The craft beverage table",
        description:
          "Cincinnati's craft distillery and brewery scene has matured into a serious pairing dinner circuit. Bourbon, rye, and local beer pairings with locally-sourced small plates happen throughout OTR every weekend.",
        unsplashQuery: "cincinnati craft bourbon dinner pairing",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Cincinnati's table runs deeper than the chili",
        cityDescription:
          "OTR's food revival has produced a genuine pop-up culture beyond the neighborhood's headline tables. Tenseats surfaces the Findlay Market dinners and supper clubs the city's food community keeps to themselves.",
      },
      {
        role: "chef",
        cityHeadline: "OTR's revival is your opportunity",
        cityDescription:
          "Over-the-Rhine's renovated Italianate spaces and Findlay Market's loyal community create ideal conditions for pop-up chefs. Cincinnati's food community supports the chefs who show up and cook seriously.",
      },
      {
        role: "mixologist",
        cityHeadline: "Cincinnati's spirits scene is underrated",
        cityDescription:
          "The city's craft distillery and brewery culture — bourbon, rye, and locally-brewed ale pairings — offers cocktail opportunities that Cincinnati's growing food audience is ready for. Your program fits perfectly into the OTR pop-up circuit.",
      },
      {
        role: "curator",
        cityHeadline: "OTR's second act is worth documenting",
        cityDescription:
          "Cincinnati chili is the legend; the Findlay Market pop-up circuit and OTR supper clubs are the story no one has told yet. Curators who track what's happening in the historic Italianate blocks are capturing an urban food revival mid-stride.",
      },
      {
        role: "venueHost",
        cityHeadline: "OTR's architecture is the best dining room",
        cityDescription:
          "Over-the-Rhine's renovated buildings — 19th-century Italianate facades, brick floors, high ceilings — create intimate dinner settings that no new construction can replicate. Connect your space with the pop-up chefs who know what to do with a room like this.",
      },
      {
        role: "facilitator",
        cityHeadline: "Connect Findlay Market chefs to OTR venues",
        cityDescription:
          "Cincinnati's food revival runs on the right introductions. You know which Findlay Market vendor is ready for a proper sit-down dinner, which OTR venue has a Tuesday opening, and which Northside crowd would show up for something they've never seen before.",
      },
    ],
    tier: 3,
  },

  "pittsburgh-pa": {
    slug: "pittsburgh-pa",
    displayName: "Pittsburgh, PA",
    state: "Pennsylvania",
    heroHeadline: "The Strip District feeds the whole city.",
    heroSubhead:
      "Lawrenceville pop-ups. Strip District provisions. Pittsburgh's food scene is the best-kept secret in the Northeast.",
    metaTagline: "Pittsburgh's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Pittsburgh, PA — Lawrenceville, Strip District, East Liberty. The Northeast's best-kept culinary secret.",
    sceneIntro:
      "Pittsburgh's Strip District is one of America's great food corridors, and Lawrenceville's growing creative scene has produced a pop-up culture that the city's modest self-presentation hasn't fully advertised to the world.",
    sceneBlocks: [
      {
        heading: "Strip District provisions",
        description:
          "The Strip's weekend market culture — Eastern European delis, Italian specialty stores, international grocers — provides the pantry for the city's pop-up chefs. The best dinners in Pittsburgh start here Saturday morning.",
        unsplashQuery: "pittsburgh strip district market food",
      },
      {
        heading: "Lawrenceville's creative table",
        description:
          "Pittsburgh's most rapidly evolving neighborhood has attracted a chef community that takes risks. Pop-up dinners, supper clubs in converted row houses, and collaborative events between artists and chefs define Lawrenceville's food scene.",
        unsplashQuery: "pittsburgh lawrenceville pop-up dinner",
      },
      {
        heading: "The pierogies are just the beginning",
        description:
          "Pittsburgh's Eastern European food heritage is the foundation, not the ceiling. The chefs building on these traditions — Polish, Ukrainian, Slovak ingredients treated with contemporary technique — are making the city's most original food.",
        unsplashQuery: "pittsburgh eastern european food heritage dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Pittsburgh eats better than the reputation",
        cityDescription:
          "The Strip District, Lawrenceville, and East Liberty have a pop-up culture that the Northeast hasn't discovered yet. Tenseats maps the dinners happening before Pittsburgh's food scene gets the national attention it deserves.",
      },
      {
        role: "chef",
        cityHeadline: "Pittsburgh's food community runs deep",
        cityDescription:
          "The city's modest reputation creates opportunity for chefs who show up. Lawrenceville's growing audience and the Strip District's Eastern European and Italian pantry create ideal conditions for pop-up concepts with real culinary ambition.",
      },
      {
        role: "mixologist",
        cityHeadline: "Lawrenceville is ready for your program",
        cityDescription:
          "Pittsburgh's bar culture has always been serious; what's changed is the ambition. Pop-up cocktail programs in Lawrenceville creative spaces and East Liberty venues find an audience that knows the difference between a well and a craft pour.",
      },
      {
        role: "curator",
        cityHeadline: "Strip District is your research library",
        cityDescription:
          "The weekend market's Eastern European delis, Italian specialty stores, and international grocers represent a living food archive. Curators who document Pittsburgh's Polish, Ukrainian, and Slovak culinary traditions — as they're being revived by a new generation — are doing essential work.",
      },
      {
        role: "venueHost",
        cityHeadline: "Pittsburgh's spaces are ready for events",
        cityDescription:
          "Lawrenceville row houses, Strip District lofts, and East Liberty creative spaces create intimate venues for pop-up dinners. Connect your space with Pittsburgh's growing chef community.",
      },
      {
        role: "facilitator",
        cityHeadline: "Match Strip District provisions to Lawrenceville tables",
        cityDescription:
          "Pittsburgh's food revival runs quietly, and the right connector makes it run better. You know which Lawrenceville chef needs a Strip District sourcing introduction, which East Liberty space is available for a Saturday dinner series, and which crowd is worth gathering.",
      },
    ],
    tier: 3,
  },

  "tampa-fl": {
    slug: "tampa-fl",
    displayName: "Tampa, FL",
    state: "Florida",
    heroHeadline: "Ybor City's table has been waiting.",
    heroSubhead:
      "Cuban sandwich culture evolved into something more. Tampa's food scene is as layered as its cigar-making past.",
    metaTagline: "Tampa's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Tampa, FL — Ybor City, Armature Works, Hyde Park. Cuban heritage meets modern food culture.",
    sceneIntro:
      "Tampa's Ybor City heritage — Cuban, Spanish, Italian immigrant food traditions — has blended with Armature Works' modern food hall energy and a growing chef population to create one of Florida's most interesting culinary scenes.",
    sceneBlocks: [
      {
        heading: "Ybor City's living heritage",
        description:
          "The Cuban, Spanish, and Italian immigrant food traditions that built Ybor City are still alive and evolving. Pop-up chefs drawing on this heritage — and pushing it forward with modern technique — are telling the neighborhood's next chapter.",
        unsplashQuery: "tampa ybor city cuban food heritage dinner",
      },
      {
        heading: "Armature Works after hours",
        description:
          "Tampa's most successful modern food hall has created a pop-up culture in its shadow — chefs who want the Armature Works audience without the overhead test their concepts in nearby venues and private spaces.",
        unsplashQuery: "tampa armature works food hall pop-up",
      },
      {
        heading: "The Gulf Coast table",
        description:
          "Tampa's proximity to Gulf Coast seafood creates pop-up opportunities that inland cities can't match. Stone crab claws, grouper, and Gulf shrimp treated with care and creativity are the city's most distinctive culinary offering.",
        unsplashQuery: "tampa gulf coast seafood pop-up dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Tampa is more than Cuban sandwiches",
        cityDescription:
          "The city's Ybor City heritage, Gulf Coast seafood, and growing chef community create a food scene that goes far beyond the tourist narrative. Tenseats surfaces the pop-ups and chef's tables where Tampa's real food culture lives.",
      },
      {
        role: "chef",
        cityHeadline: "Ybor's heritage is your ingredient",
        cityDescription:
          "Tampa's immigrant food traditions — Cuban, Spanish, Italian — are rich culinary material. Pop-up chefs who draw on these roots while pushing them forward find an audience that's both proud of the history and hungry for what comes next.",
      },
      {
        role: "mixologist",
        cityHeadline: "Gulf Coast spirits deserve a proper program",
        cityDescription:
          "Tampa's cocktail culture is catching up to its food scene. Pop-up bar programs that engage with the city's Cuban rum heritage, Ybor history, and Gulf Coast citrus find an audience that knows there's more to drink here than the waterfront tourist bars suggest.",
      },
      {
        role: "curator",
        cityHeadline: "Ybor City's food story is still being written",
        cityDescription:
          "The Cuban, Spanish, and Italian immigrant traditions that built Ybor are evolving, not disappearing. Curators who document the pop-up chefs building on this heritage — and the Armature Works shadow circuit developing around it — are telling Tampa's most honest food story.",
      },
      {
        role: "venueHost",
        cityHeadline: "Tampa's historic spaces need events",
        cityDescription:
          "Ybor City's cigar factories, Hyde Park bungalows, and Channel District lofts offer intimate dining spaces with genuine history. Connect your venue with the pop-up chefs ready to fill them.",
      },
      {
        role: "facilitator",
        cityHeadline: "Connect Ybor heritage chefs to Armature Works crowds",
        cityDescription:
          "Tampa's food scene has the traditions and the talent; what it needs is the right matchmaker. You know which Ybor City chef wants a proper dining room, which Hyde Park venue is looking for a dinner series, and which Armature Works crowd would show up for something with real history behind it.",
      },
    ],
    tier: 3,
  },

  "st-petersburg-fl": {
    slug: "st-petersburg-fl",
    displayName: "St. Petersburg, FL",
    state: "Florida",
    heroHeadline: "Where art and food share a table.",
    heroSubhead:
      "St. Pete's creative culture flows directly into its dining scene. The pop-ups in the Warehouse Arts District are the city at its best.",
    metaTagline: "St. Petersburg's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and art-adjacent food events in St. Petersburg, FL — Warehouse Arts District, Central Arts District. Florida's arts capital eats well.",
    sceneIntro:
      "St. Petersburg's identity as Florida's arts capital extends naturally into food — pop-up dinners in gallery spaces, chef-artist collaborations, and farm-table events in the Central Arts District run year-round.",
    sceneBlocks: [
      {
        heading: "Gallery dinners after closing",
        description:
          "St. Pete's art galleries regularly become dining rooms after the last visitor leaves. Pop-up chefs and gallery directors have built a circuit of art-adjacent dinners that neither the food press nor the arts press has fully covered.",
        unsplashQuery: "st petersburg florida gallery art dinner pop-up",
      },
      {
        heading: "Warehouse Arts District eats",
        description:
          "The industrial spaces that house St. Pete's most creative studios are also its most interesting pop-up dinner venues. Chef-artist collaborations in the Warehouse Arts District produce the city's most distinctive food experiences.",
        unsplashQuery: "st pete warehouse arts district food event",
      },
      {
        heading: "The waterfront table",
        description:
          "St. Petersburg's waterfront position creates outdoor dining opportunities unmatched in the region. Pop-ups along the waterfront during the cooler months are among the most atmospheric dining experiences in Florida.",
        unsplashQuery: "st pete florida waterfront outdoor dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Art and food in one evening",
        cityDescription:
          "St. Pete's gallery dinner circuit combines two of the best things a city can offer. Tenseats surfaces the chef-artist collaborations and Warehouse Arts District pop-ups that make St. Petersburg's cultural scene complete.",
      },
      {
        role: "chef",
        cityHeadline: "St. Pete's art community is your audience",
        cityDescription:
          "Florida's arts capital has a creative-class audience primed for thoughtful food experiences. Pop-up chefs who engage with the gallery and studio community find collaborators and guests who show up ready for something different.",
      },
      {
        role: "mixologist",
        cityHeadline: "EDGE District is your pop-up stage",
        cityDescription:
          "St. Pete's emerging creative corridor runs on the same crowd that discovers art before it's reviewed and drinks before they're on a menu. Pop-up cocktail programs in EDGE District gallery spaces and Central Arts District venues find the city's most adventurous palates.",
      },
      {
        role: "curator",
        cityHeadline: "Document the arts-food crossover, dish by dish",
        cityDescription:
          "The chef-artist collaborations happening in St. Pete's Warehouse Arts District and gallery dinner circuit exist almost entirely off the record. Curators who trace this scene are capturing Florida's most genuinely creative food culture before the national press arrives.",
      },
      {
        role: "venueHost",
        cityHeadline: "Your gallery is the best dining room in the city",
        cityDescription:
          "St. Pete's gallery and studio spaces are natural venues for intimate dinners. Connect your creative space with the pop-up chefs who want to cook in an environment that matches the quality of their food.",
      },
      {
        role: "facilitator",
        cityHeadline: "Bridge the Warehouse Arts District and the kitchen",
        cityDescription:
          "St. Pete's gallery dinner circuit runs on people who know both worlds. You know which Central Arts District gallery hosts chefs after closing, which EDGE District venue needs a food series, and which chef wants a space with art on the walls instead of restaurant lighting.",
      },
    ],
    tier: 3,
  },

  "milwaukee-wi": {
    slug: "milwaukee-wi",
    displayName: "Milwaukee, WI",
    state: "Wisconsin",
    heroHeadline: "German roots. Third Ward flavor.",
    heroSubhead:
      "Milwaukee's beer and cheese culture is the foundation. What's built on top of it is the surprise.",
    metaTagline: "Milwaukee's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Milwaukee, WI — Third Ward, Walker's Point, Brady Street. German heritage meets modern pop-up culture.",
    sceneIntro:
      "Milwaukee's food heritage runs German-deep — beer gardens, cheese culture, Friday fish fries — but the Third Ward and Walker's Point neighborhoods have layered modern pop-up culture and craft cocktail scenes on top of these traditions.",
    sceneBlocks: [
      {
        heading: "Third Ward's modern table",
        description:
          "Milwaukee's renovated warehouse district has become the city's most dynamic food neighborhood. Pop-up dinners in converted spaces, chef collaborations in gallery venues, and an increasingly adventurous dining public make the Third Ward the center of the city's food evolution.",
        unsplashQuery: "milwaukee third ward pop-up dinner warehouse",
      },
      {
        heading: "The beer garden reimagined",
        description:
          "Milwaukee's beer garden tradition is being reclaimed by a new generation of chefs and beverage professionals. Modern interpretations — with craft brewing, local sourcing, and serious food — are producing some of the city's most interesting dining experiences.",
        unsplashQuery: "milwaukee beer garden craft food dinner",
      },
      {
        heading: "Walker's Point after dark",
        description:
          "The neighborhood that's anchored Milwaukee's LGBTQ+ community and Latino culture has developed a pop-up food scene that draws on both. Intimate dinners and communal feasts in Walker's Point run on invitation and word of mouth.",
        unsplashQuery: "milwaukee walkers point community dinner pop-up",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Milwaukee's Third Ward is worth the trip",
        cityDescription:
          "Beyond the fish fries and beer halls, Milwaukee's Third Ward and Walker's Point have a pop-up culture that surprises even the city's residents. Tenseats maps the dinners the locals keep off social media.",
      },
      {
        role: "chef",
        cityHeadline: "Milwaukee's heritage is rich material",
        cityDescription:
          "German food traditions, Friday fish fry culture, and a serious cheese and beer pantry give Milwaukee chefs distinctive raw material. Pop-ups that engage with this heritage authentically find the city's most passionate audience.",
      },
      {
        role: "mixologist",
        cityHeadline: "Craft cocktails meet craft brewing country",
        cityDescription:
          "Milwaukee's beer culture creates rare opportunities for cocktail professionals. Spirits programs that engage with local brewing traditions — grain-to-glass pours, brewing-adjacent spirits, supper club beer pairings — find an audience that takes beverages seriously.",
      },
      {
        role: "curator",
        cityHeadline: "The supper club tradition is worth preserving",
        cityDescription:
          "Milwaukee's German-rooted supper club heritage is one of the Midwest's most distinctive dining formats — and the Third Ward's new generation of chefs is finding fresh ways to honor it. Curators who document this evolution are capturing a living tradition mid-transformation.",
      },
      {
        role: "venueHost",
        cityHeadline: "Third Ward spaces hold the city's food future",
        cityDescription:
          "Milwaukee's renovated warehouse district offers converted loft spaces, gallery-adjacent rooms, and restored industrial floors that match the seriousness of the chefs who want to cook in them. Connect your space with the pop-up community redefining Milwaukee's table.",
      },
      {
        role: "facilitator",
        cityHeadline: "Walker's Point dinners run on word of mouth",
        cityDescription:
          "Milwaukee's most interesting food experiences — Walker's Point community feasts, Third Ward supper club revivals, Brady Street pop-ups — operate on invitation and personal networks. You know who's cooking, where the space opens up, and which crowd is worth gathering.",
      },
    ],
    tier: 3,
  },

  "phoenix-az": {
    slug: "phoenix-az",
    displayName: "Phoenix, AZ",
    state: "Arizona",
    heroHeadline: "Sonoran Desert has its own table.",
    heroSubhead:
      "Mesquite-smoked, desert-foraged, Sonoran-influenced. Phoenix's food culture is finally getting the credit it deserves.",
    metaTagline: "Phoenix's Curated Food Events",
    metaDescription:
      "Desert pop-ups, Sonoran food events, and chef dinners in Phoenix, AZ — Melrose, Downtown Phoenix, Arts District. Desert-to-table cuisine, curated by locals.",
    sceneIntro:
      "Phoenix's Sonoran Desert terroir is singular in American food culture — the cuisine that emerges from this landscape, in the hands of the right chefs, is unlike anything on the coasts. Pop-ups exploring Sonoran ingredients and traditions are the city's most compelling dining.",
    sceneBlocks: [
      {
        heading: "Desert-to-table",
        description:
          "Saguaro fruit, mesquite pods, cholla buds, prickly pear — Phoenix's chefs who forage and source within the Sonoran Desert are making cuisine with no parallel. Pop-up dinners built on this terroir are the city's most original food experiences.",
        unsplashQuery: "phoenix sonoran desert foraged food dinner",
      },
      {
        heading: "Melrose and the Arts District",
        description:
          "Phoenix's midtown creative corridor has developed a pop-up culture that reflects the city's diverse creative community. Intimate dinners in gallery spaces and renovated bungalows reach an audience hungry for food that matches the neighborhood's energy.",
        unsplashQuery: "phoenix melrose arts district pop-up dinner",
      },
      {
        heading: "The Sonoran-Mexican borderland table",
        description:
          "Phoenix sits at the cultural crossroads of the American Southwest and northern Mexico. The chefs who draw on this borderland cuisine — Sonoran traditions, elevated norteño cooking, indigenous ingredients — are building something the national food media is beginning to notice.",
        unsplashQuery: "phoenix sonoran mexican borderland food chef",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Phoenix's food scene outgrew its reputation",
        cityDescription:
          "Beyond the resort dining, Phoenix has a desert-to-table pop-up culture that draws on Sonoran ingredients and borderland food traditions. Tenseats maps the chef dinners and pop-up events the city's food community attends.",
      },
      {
        role: "chef",
        cityHeadline: "Sonoran terroir is unlike anything else",
        cityDescription:
          "Phoenix's desert pantry — saguaro fruit, mesquite, prickly pear, Sonoran chiles — gives chefs access to ingredients no coastal city can replicate. Pop-up dinners built on this terroir create genuinely singular dining experiences.",
      },
      {
        role: "mixologist",
        cityHeadline: "Desert botanicals belong in your glass",
        cityDescription:
          "Prickly pear, mesquite, Sonoran herbs, and Arizona agave spirits give Phoenix cocktail professionals a pantry no other American city offers. Pop-up bar programs in Roosevelt Row gallery spaces and Melrose venues find the right crowd for something genuinely regional.",
      },
      {
        role: "curator",
        cityHeadline: "Document the Sonoran table",
        cityDescription:
          "Phoenix's desert food culture is one of America's most distinctive and least-documented culinary stories. Curators who surface the Sonoran pop-up circuit, borderland cooking traditions, and indigenous ingredient work are doing irreplaceable documentation.",
      },
      {
        role: "venueHost",
        cityHeadline: "Roosevelt Row spaces match the city's ambition",
        cityDescription:
          "Phoenix's midtown arts corridor has the right spaces for the food culture it's producing — converted bungalows, gallery floors, and outdoor venues that come alive in the cooler months. Connect your space with the chefs building the Sonoran table.",
      },
      {
        role: "facilitator",
        cityHeadline: "Connect Sonoran chefs to the Roosevelt Row circuit",
        cityDescription:
          "Phoenix's desert-to-table scene runs on relationships between farmers, foragers, chefs, and spaces. You know which Melrose chef is sourcing Sonoran ingredients without a venue to serve them in, which Roosevelt Row gallery opens its floor on Sundays, and who to invite.",
      },
    ],
    tier: 3,
  },

  "scottsdale-az": {
    slug: "scottsdale-az",
    displayName: "Scottsdale, AZ",
    state: "Arizona",
    heroHeadline: "Old Town's best meals are off-menu.",
    heroSubhead:
      "Scottsdale's supper club scene runs quietly behind its resort reputation. Find the private tables before they fill.",
    metaTagline: "Scottsdale's Curated Food Events",
    metaDescription:
      "Supper clubs, private dinners, and chef events in Scottsdale, AZ — Old Town, North Scottsdale. Behind the resort reputation, a serious pop-up dining scene.",
    sceneIntro:
      "Scottsdale's food scene has always operated behind its luxury facade. The supper clubs and private dining experiences in Old Town and North Scottsdale draw on Arizona's agricultural bounty and the city's international resident community.",
    sceneBlocks: [
      {
        heading: "Old Town's hidden supper clubs",
        description:
          "Behind the tourist-facing galleries and resort restaurants, Old Town Scottsdale has a supper club circuit that runs on invitation and local knowledge. These private tables — in historic properties and converted studios — are the city's best dining secret.",
        unsplashQuery: "scottsdale old town supper club private dinner",
      },
      {
        heading: "North Scottsdale's private table",
        description:
          "The residential communities north of Old Town host some of Arizona's most intimate dining experiences. Private chef dinners, farm-to-table events at local ranches, and exclusive supper clubs reach a discerning audience that doesn't need to be found by social media.",
        unsplashQuery: "scottsdale north private chef dinner ranch",
      },
      {
        heading: "Arizona wine country arrives",
        description:
          "Arizona's wine regions — Verde Valley, Sonoita, Willcox — are producing wines that Scottsdale's supper club chefs are pairing with regional food in ways the national press is starting to notice. These pairing dinners are the intersection of two emerging stories.",
        unsplashQuery: "scottsdale arizona wine pairing dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Scottsdale's best tables aren't in the resorts",
        cityDescription:
          "The supper clubs and private dinners happening in Old Town and North Scottsdale operate quietly, filling by invitation and local knowledge. Tenseats gets you access to the tables the city's food community keeps private.",
      },
      {
        role: "chef",
        cityHeadline: "Scottsdale's audience expects the best",
        cityDescription:
          "The city's internationally-traveled resident base creates demand for intimate dining experiences that go beyond resort food. Pop-up chefs who deliver genuine quality and exclusivity find an audience willing to pay for access.",
      },
      {
        role: "mixologist",
        cityHeadline: "Arizona wine and spirits deserve better staging",
        cityDescription:
          "Verde Valley, Sonoita, and Willcox wines are finding their way to Scottsdale's private tables — and Arizona agave spirits are following. Pop-up cocktail and pairing programs in Old Town studio spaces find residents who know the difference between a resort pour and a genuinely regional one.",
      },
      {
        role: "curator",
        cityHeadline: "Old Town's supper club circuit runs quietly",
        cityDescription:
          "Scottsdale's private dining scene — historic property dinners, North Scottsdale ranch events, Old Town studio suppers — exists almost entirely by word of mouth. Curators who document this circuit give it the audience it deserves without removing its intimacy.",
      },
      {
        role: "venueHost",
        cityHeadline: "Scottsdale's private spaces are the best venues",
        cityDescription:
          "Historic Old Town properties, North Scottsdale ranch settings, and private estate gardens create intimate venues for chef's table experiences. Connect your space with the chefs who want to serve Scottsdale's most discerning guests.",
      },
      {
        role: "facilitator",
        cityHeadline: "Old Town's best nights run on local knowledge",
        cityDescription:
          "Scottsdale's private dining circuit doesn't advertise. You know which Old Town historic property hosts chef dinners off-calendar, which North Scottsdale ranch is available for farm-to-desert-table events, and which chef is ready to serve the city's most discerning private audience.",
      },
    ],
    tier: 3,
  },

  "ann-arbor-mi": {
    slug: "ann-arbor-mi",
    displayName: "Ann Arbor, MI",
    state: "Michigan",
    heroHeadline: "Zingerman's taught the city to eat.",
    heroSubhead:
      "University town with serious food ambitions. The Kerrytown Market pop-ups are where Ann Arbor's palate is growing.",
    metaTagline: "Ann Arbor's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Ann Arbor, MI — Kerrytown, Zingerman's community, downtown. A university town with serious food culture.",
    sceneIntro:
      "Zingerman's created a food culture in Ann Arbor that far exceeds what a city of its size typically produces. The Kerrytown Market area, the university's international community, and a tradition of craft food business have built something special.",
    sceneBlocks: [
      {
        heading: "Kerrytown's pop-up circuit",
        description:
          "Ann Arbor's historic market neighborhood hosts a rotating pop-up food scene that draws on the university's global community and the city's strong craft food tradition. Saturday mornings at Kerrytown are the city's best food discovery experience.",
        unsplashQuery: "ann arbor kerrytown market pop-up food",
      },
      {
        heading: "The Zingerman's generation",
        description:
          "Zingerman's Community of Businesses has trained a generation of food professionals who've stayed in Ann Arbor or returned to it. The pop-up scene they've built reflects the depth of culinary education the community has produced.",
        unsplashQuery: "ann arbor zingerman chef food dinner",
      },
      {
        heading: "The international university table",
        description:
          "Ann Arbor's global student and faculty community has generated authentic culinary traditions across dozens of cuisines. Pop-ups drawing on these traditions — often in collaboration with university communities — are the city's most culturally rich dining experiences.",
        unsplashQuery: "ann arbor university international food dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Ann Arbor eats beyond Zingerman's",
        cityDescription:
          "Zingerman's built the foundation, but Kerrytown's pop-up circuit and the university's international food community have built on it. Tenseats surfaces the dinners that Ann Arbor's most food-literate locals attend — not the delis, the dinner tables.",
      },
      {
        role: "chef",
        cityHeadline: "Ann Arbor's food culture runs deep",
        cityDescription:
          "The Zingerman's community has trained the city's palate and created an audience that understands craft and quality. Pop-up chefs find a university town that takes food seriously and shows up for the chefs who match that seriousness.",
      },
      {
        role: "mixologist",
        cityHeadline: "Kerrytown has room for the right pour",
        cityDescription:
          "Ann Arbor's craft beverage culture — built alongside Zingerman's and the university's international palette — creates an audience for cocktail programs that reference the same depth. Pop-ups pairing Kerrytown-sourced ingredients with considered spirits find a city ready for it.",
      },
      {
        role: "curator",
        cityHeadline: "Document Ann Arbor's food heritage",
        cityDescription:
          "The city's Zingerman's-built food culture is a genuine culinary legacy. Curators who surface the Kerrytown pop-up scene and the chef community the deli incubated are telling one of American food's most interesting local stories.",
      },
      {
        role: "venueHost",
        cityHeadline: "Kerrytown spaces host the city's best evenings",
        cityDescription:
          "Ann Arbor's historic market district and university-adjacent spaces create intimate venues with genuine character. Your Kerrytown storefront or renovated historic space connects with the Zingerman's-generation chefs who want to cook for an audience that gets it.",
      },
      {
        role: "facilitator",
        cityHeadline: "The Zingerman's network needs a connector",
        cityDescription:
          "Ann Arbor's chef community — trained in the Zingerman's ecosystem, feeding a university population with global tastes — runs on the right introductions. You know which Kerrytown venue has a dark Monday, which Zingerman's alumnus is ready for a pop-up. Make that call.",
      },
    ],
    tier: 3,
  },

  "grand-rapids-mi": {
    slug: "grand-rapids-mi",
    displayName: "Grand Rapids, MI",
    state: "Michigan",
    heroHeadline: "Michigan's second city eats first.",
    heroSubhead:
      "Fulton Street Farmers Market. The Bridge Street corridor. Grand Rapids is building something real.",
    metaTagline: "Grand Rapids's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Grand Rapids, MI — Fulton Street, Eastown, West Side. Michigan's agricultural bounty, locally curated.",
    sceneIntro:
      "Grand Rapids' food scene benefits from Michigan's extraordinary agricultural diversity — cherries, asparagus, Great Lakes fish, craft beverages — and a growing chef community committed to local sourcing and intimate dining formats.",
    sceneBlocks: [
      {
        heading: "Fulton Street feeds the city",
        description:
          "Grand Rapids' farmers market anchors a food community that draws on Michigan's extraordinary agricultural diversity. The pop-up chefs who shop here on Saturday mornings build menus that reflect what the region actually grows and raises.",
        unsplashQuery: "grand rapids fulton street market michigan food",
      },
      {
        heading: "Eastown and the West Side",
        description:
          "Grand Rapids' creative neighborhoods have developed a pop-up food culture that reflects the city's craft ethic — intimate, locally-sourced, and built for a community that takes food seriously without taking itself too seriously.",
        unsplashQuery: "grand rapids eastown west side pop-up dinner",
      },
      {
        heading: "Michigan's pantry on the table",
        description:
          "Great Lakes fish, Michigan cherries, asparagus, and craft beverages from the country's most productive hop-growing region — Grand Rapids chefs who source within the state have access to ingredients that make the city's pop-up dinners genuinely distinctive.",
        unsplashQuery: "grand rapids michigan local ingredients chef dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Grand Rapids is building something worth attending",
        cityDescription:
          "The Fulton Street pop-up circuit and Eastown's creative dining scene are producing food experiences that reflect Michigan's best ingredients. Tenseats maps the dinners where Grand Rapids' food community actually eats — and the ones they keep quiet.",
      },
      {
        role: "chef",
        cityHeadline: "Michigan's pantry is your competitive advantage",
        cityDescription:
          "Grand Rapids' access to Michigan's agricultural bounty — Great Lakes fish, orchard fruits, craft beverages — gives local chefs distinctive ingredients that no coastal city can replicate. Pop-up dinners built on this sourcing create genuinely local dining experiences.",
      },
      {
        role: "mixologist",
        cityHeadline: "West Michigan hops deserve the spotlight",
        cityDescription:
          "Grand Rapids sits in the country's most productive hop-growing region, and Michigan's craft spirit scene is building alongside it. Cocktail programs that work with local distilleries and the Fulton Street Market's seasonal ingredients find an audience already attuned to provenance.",
      },
      {
        role: "curator",
        cityHeadline: "Document West Michigan's food story",
        cityDescription:
          "Grand Rapids' agricultural access and growing chef community create a food story the national press hasn't told yet. Curators who surface the Fulton Street pop-up scene are documenting the early chapters of something significant.",
      },
      {
        role: "venueHost",
        cityHeadline: "Eastown spaces anchor the city's creative table",
        cityDescription:
          "Grand Rapids' Eastown and Bridge Street corridor spaces — creative-class storefronts, renovated warehouses, neighborhood venues with real character — connect with the chef community that sources at Fulton Street. Your space is the stage they're looking for.",
      },
      {
        role: "facilitator",
        cityHeadline: "West Michigan's food scene needs its connector",
        cityDescription:
          "Grand Rapids' chef community is building on Michigan's agricultural pantry — and the right introductions determine which dinners actually happen. You know which Fulton Street vendor has produce worth featuring, which Eastown venue has a dark weekend. Bridge that gap.",
      },
    ],
    tier: 3,
  },

  "memphis-tn": {
    slug: "memphis-tn",
    displayName: "Memphis, TN",
    state: "Tennessee",
    heroHeadline: "The BBQ capital has a secret table.",
    heroSubhead:
      "Beyond Beale Street. South Main's pop-up scene is where Memphis food tells its real story.",
    metaTagline: "Memphis's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Memphis, TN — South Main, Soulsville, Cooper-Young. Beyond the BBQ mythology, a serious food scene.",
    sceneIntro:
      "Memphis is the BBQ capital of the universe — and the pop-up chefs building on that tradition, rather than just replicating it, are creating some of the South's most interesting meals in South Main's gallery spaces and Soulsville's community kitchens.",
    sceneBlocks: [
      {
        heading: "South Main's creative table",
        description:
          "Memphis's arts district has developed a pop-up food culture that sits at the intersection of the city's music heritage and its emerging chef community. Gallery dinners, warehouse supper clubs, and chef collaborations in South Main run on community and invitation.",
        unsplashQuery: "memphis south main arts district pop-up dinner",
      },
      {
        heading: "BBQ elevated",
        description:
          "Memphis chefs who take the city's BBQ heritage seriously — and push it into tasting menu territory, pairing dinners, and chef's table experiences — are making the most honest and ambitious food in the South. Pop-ups that engage with this tradition without being limited by it are the city's most interesting dining.",
        unsplashQuery: "memphis bbq elevated chef dinner tasting",
      },
      {
        heading: "Soulsville's community kitchen",
        description:
          "The neighborhood that built Memphis's music soul is also building its food soul. Community kitchen dinners, pop-ups celebrating African-American culinary traditions, and chef collaborations in Soulsville run on the same communal spirit that produced the music.",
        unsplashQuery: "memphis soulsville community food dinner soul",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Memphis beyond Beale Street",
        cityDescription:
          "South Main's gallery dinners, Cooper-Young's creative food scene, and Soulsville's community kitchen events tell a Memphis food story that Beale Street's tourist circuit never reaches. Tenseats maps where Memphis locals actually eat.",
      },
      {
        role: "chef",
        cityHeadline: "Memphis's BBQ heritage is your canvas",
        cityDescription:
          "The city's most interesting chefs don't just replicate the BBQ tradition — they expand it. Pop-ups that take Memphis's culinary heritage seriously and push it somewhere new find an audience hungry for exactly that conversation.",
      },
      {
        role: "mixologist",
        cityHeadline: "South Main's cocktail scene is just starting",
        cityDescription:
          "Cooper-Young and South Main are building a craft beverage culture alongside the food scene. Cocktail programs that draw on Tennessee whiskey heritage, Southern botanicals, and the neighborhood's creative energy find an audience that's graduated from Beale Street's tourist bars.",
      },
      {
        role: "curator",
        cityHeadline: "Memphis food deserves better documentation",
        cityDescription:
          "The city's BBQ mythology overshadows a genuinely deep and evolving food culture. Curators who surface the South Main pop-up circuit and Soulsville's community kitchen scene are telling the real Memphis food story.",
      },
      {
        role: "venueHost",
        cityHeadline: "South Main gallery spaces host the real Memphis table",
        cityDescription:
          "Memphis's arts district warehouses, Cooper-Young storefronts, and Soulsville community spaces create intimate dining settings with genuine neighborhood character. Connect your space with the chefs who are building something beyond the BBQ mythology.",
      },
      {
        role: "facilitator",
        cityHeadline: "Cooper-Young's food scene runs on introductions",
        cityDescription:
          "Memphis's creative food circuit — South Main gallery dinners, Cooper-Young chef collaborations, Soulsville community events — needs the right connector. You know which warehouse has a dark weekend, which chef's ready to push the BBQ tradition somewhere new. Make it happen.",
      },
    ],
    tier: 3,
  },

  "indianapolis-in": {
    slug: "indianapolis-in",
    displayName: "Indianapolis, IN",
    state: "Indiana",
    heroHeadline: "Mass Ave has more than galleries.",
    heroSubhead:
      "Indy's food scene is growing up. Fountain Square and the Stutz campus are where it's happening.",
    metaTagline: "Indianapolis's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Indianapolis, IN — Mass Ave, Fountain Square, Stutz campus. Indy's food scene growing beyond expectations.",
    sceneIntro:
      "Indianapolis's Mass Ave Arts District and Fountain Square neighborhood have incubated a food scene that surprised even the city's residents — creative pop-ups, chef's table dinners, and a craft cocktail culture building genuine community.",
    sceneBlocks: [
      {
        heading: "Mass Ave's dining corridor",
        description:
          "Indianapolis's most walkable arts district has become the city's food discovery corridor. Pop-up dinners in gallery spaces, chef collaborations in repurposed storefronts, and rotating supper clubs reach an audience that the city didn't know it had until Mass Ave proved it.",
        unsplashQuery: "indianapolis mass ave arts food pop-up dinner",
      },
      {
        heading: "Fountain Square's creative table",
        description:
          "Indianapolis's most creative neighborhood has developed a food scene that reflects its eclectic community. Intimate dinners, cocktail-forward pop-ups, and chef's table experiences in Fountain Square's renovated spaces are the city's most surprising food story.",
        unsplashQuery: "indianapolis fountain square pop-up dinner creative",
      },
      {
        heading: "The Stutz campus after hours",
        description:
          "The historic Stutz factory campus — now home to artists, makers, and creative businesses — has become the setting for some of Indianapolis's most distinctive pop-up dining events. The building's industrial history and creative present make it a natural venue for food experiences that match its character.",
        unsplashQuery: "indianapolis stutz campus food event dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Indy's food scene outgrew its reputation",
        cityDescription:
          "Beyond the steakhouses and sports bars, Indianapolis has a creative food culture in Mass Ave, Fountain Square, and the Stutz campus. Tenseats maps the pop-up dinners and chef's tables where Indy's food community actually eats.",
      },
      {
        role: "chef",
        cityHeadline: "Indianapolis is ready to be surprised",
        cityDescription:
          "The city's Mass Ave and Fountain Square communities have an appetite for food experiences that go beyond expectations. Pop-up chefs who show up with genuine ambition find an audience that shows up back — and brings its friends.",
      },
      {
        role: "mixologist",
        cityHeadline: "Indy's cocktail culture is ready",
        cityDescription:
          "Indianapolis's craft cocktail scene has matured alongside its food culture. Cocktail-forward pop-ups and pairing dinners in Mass Ave and Fountain Square find an audience that's graduated from sports bars and is ready for something more considered.",
      },
      {
        role: "curator",
        cityHeadline: "Document Indy's food scene before it's obvious",
        cityDescription:
          "Mass Ave and Fountain Square's pop-up circuit is building faster than the national food press has noticed. Curators who surface the Stutz campus events and the chef's table circuit in Indianapolis are capturing something at the right moment.",
      },
      {
        role: "venueHost",
        cityHeadline: "Stutz campus spaces belong in the story",
        cityDescription:
          "The historic Stutz factory, Fountain Square's renovated storefronts, and Mass Ave's gallery spaces create intimate dinner venues with real character. Connect your Indianapolis space with the chefs who want to cook for an audience that's already past expectations.",
      },
      {
        role: "facilitator",
        cityHeadline: "Mass Ave's food circuit runs on the right calls",
        cityDescription:
          "Indianapolis's creative food scene — Fountain Square pop-ups, Stutz campus events, Mass Ave chef collaborations — needs someone who knows which chef is ready and which space has a dark night. You're the bridge between Indy's culinary ambition and the rooms where it lands.",
      },
    ],
    tier: 3,
  },

  "buffalo-ny": {
    slug: "buffalo-ny",
    displayName: "Buffalo, NY",
    state: "New York",
    heroHeadline: "Beyond the wing. Finally.",
    heroSubhead:
      "Buffalo's Allentown neighborhood and Great Lakes pantry are building a food scene the rest of the country is starting to notice.",
    metaTagline: "Buffalo's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Buffalo, NY — Allentown, Elmwood Village, Larkinville. Great Lakes ingredients, emerging food culture.",
    sceneIntro:
      "Buffalo's food culture is emerging from behind its wings mythology. The Allentown neighborhood's creative community, Great Lakes regional ingredients, and a new generation of chefs committed to the city have produced something worth visiting for.",
    sceneBlocks: [
      {
        heading: "Allentown's creative table",
        description:
          "Buffalo's historic arts neighborhood has developed a pop-up food culture that reflects its creative community. Intimate dinners in renovated Victorian spaces, chef collaborations with the neighborhood's artists, and rotating supper clubs build a food scene with real character.",
        unsplashQuery: "buffalo allentown pop-up dinner arts",
      },
      {
        heading: "Great Lakes in the kitchen",
        description:
          "Buffalo's proximity to Lake Erie and the Great Lakes region gives chefs access to ingredients — perch, walleye, whitefish, lake trout — that make the city's best pop-up dinners distinctly regional. The chefs who source here make food no other city can replicate.",
        unsplashQuery: "buffalo great lakes fish dinner regional",
      },
      {
        heading: "Larkinville's industrial revival",
        description:
          "The Larkin District's industrial revival has created event spaces that match Buffalo's creative ambition. Pop-up dinners in Larkinville's converted warehouse spaces reach an audience that understands the city's transformation and wants to be part of its next chapter.",
        unsplashQuery: "buffalo larkin district warehouse food event",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Buffalo's food scene outgrew the wings mythology",
        cityDescription:
          "Allentown, Elmwood Village, and Larkinville have a pop-up food culture that the national food press is beginning to notice. Tenseats maps the dinners where Buffalo's food community is building the city's culinary next chapter.",
      },
      {
        role: "chef",
        cityHeadline: "Buffalo's moment is now",
        cityDescription:
          "The city's creative revival has attracted a chef community ready to prove Buffalo is more than wings. Pop-up chefs who engage with Great Lakes ingredients and Allentown's creative energy find an audience that's been waiting for exactly this.",
      },
      {
        role: "mixologist",
        cityHeadline: "Great Lakes ingredients belong in the glass",
        cityDescription:
          "Buffalo's proximity to Lake Erie and the Niagara wine region gives cocktail programs access to regional spirits and local fruit that most cities can't source. Elmwood Village pop-ups and Allentown supper clubs are ready for pairings that reflect the city's actual pantry.",
      },
      {
        role: "curator",
        cityHeadline: "Buffalo's Polish and Italian kitchens deserve coverage",
        cityDescription:
          "The West Side's Polish delis, the East Side's Italian heritage kitchens, and Elmwood Village's evolving food community are building a food culture with real depth. Curators who surface Buffalo's heritage food scene alongside its emerging pop-up circuit tell the complete story.",
      },
      {
        role: "venueHost",
        cityHeadline: "Buffalo's spaces are perfect for intimate events",
        cityDescription:
          "Allentown Victorians, Larkinville industrial spaces, and Elmwood Village storefronts create intimate dining venues that match the city's character. Connect your space with the chefs building Buffalo's food future.",
      },
      {
        role: "facilitator",
        cityHeadline: "Elmwood Village's food scene needs its matchmaker",
        cityDescription:
          "Buffalo's revival is producing chefs with Great Lakes sourcing savvy and venues with genuine character — but the right dinner doesn't happen without the right introduction. You know which Allentown Victorian is available and which chef is ready to cook for 14. Bridge it.",
      },
    ],
    tier: 3,
  },

  "birmingham-al": {
    slug: "birmingham-al",
    displayName: "Birmingham, AL",
    state: "Alabama",
    heroHeadline: "The South's most exciting food city.",
    heroSubhead:
      "Birmingham's food renaissance is real. Chef Chris Hastings started it. The pop-up generation is carrying it further.",
    metaTagline: "Birmingham's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Birmingham, AL — Five Points South, Woodlawn, Avondale. The South's most exciting emerging food city.",
    sceneIntro:
      "Birmingham's food scene has undergone a genuine transformation, built on Southern food traditions reimagined with contemporary technique. The pop-up circuit building in its wake is the most interesting development in Southern food culture since New Orleans.",
    sceneBlocks: [
      {
        heading: "The James Beard generation",
        description:
          "Chris Hastings' James Beard recognition opened a door that Birmingham's chefs have been walking through ever since. The pop-up circuit that's emerged in Five Points South, Avondale, and Woodlawn reflects chefs who grew up knowing Birmingham could be taken seriously.",
        unsplashQuery: "birmingham alabama chef dinner five points",
      },
      {
        heading: "Woodlawn's community table",
        description:
          "Birmingham's Woodlawn neighborhood revival has produced a food community rooted in the area's African-American heritage. Pop-up dinners celebrating Southern foodways, soul food traditions, and community-centered hospitality are Woodlawn's most meaningful contribution to the city's food scene.",
        unsplashQuery: "birmingham woodlawn community soul food dinner",
      },
      {
        heading: "Avondale's creative food culture",
        description:
          "The neighborhood that built Birmingham's craft beverage scene has developed a food culture to match. Pop-up dinners in Avondale's brewery spaces and converted venues reach a creative-class audience ready for food experiences that match the neighborhood's energy.",
        unsplashQuery: "birmingham avondale pop-up brewery food dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Birmingham is the South's best food surprise",
        cityDescription:
          "The city's pop-up circuit in Five Points, Avondale, and Woodlawn is producing Southern food experiences that go beyond expectations. Tenseats surfaces the dinners where Birmingham's most food-literate community actually eats.",
      },
      {
        role: "chef",
        cityHeadline: "Birmingham's food renaissance needs your voice",
        cityDescription:
          "The city's transformation from steel town to food destination has created space for chefs who take Southern food seriously. Pop-up chefs who engage with Birmingham's heritage and push it forward find an audience that's been waiting for exactly this.",
      },
      {
        role: "mixologist",
        cityHeadline: "Avondale's brewery scene has a cocktail gap",
        cityDescription:
          "Birmingham's Avondale neighborhood built the city's craft beverage identity — and the cocktail programs moving into that space find a creative-class audience already primed for serious pours. Spirits that reference Southern botanicals and Alabama's distilling tradition land here.",
      },
      {
        role: "curator",
        cityHeadline: "Document Birmingham's food transformation",
        cityDescription:
          "The city's shift from industrial center to Southern food destination is one of America's great culinary stories. Curators who surface the Woodlawn community dinners and Avondale pop-up scene are documenting a transformation in real time.",
      },
      {
        role: "venueHost",
        cityHeadline: "Avondale's spaces match the scene's ambition",
        cityDescription:
          "Birmingham's Avondale brewery venues, Five Points South spaces, and Woodlawn community kitchens create intimate dinner settings with Southern character. Connect your space with the chefs building New South cuisine beyond Frank Stitt's original vision.",
      },
      {
        role: "facilitator",
        cityHeadline: "Birmingham's revival runs on the right introductions",
        cityDescription:
          "The city's pop-up circuit — Avondale brewery dinners, Woodlawn community tables, Five Points South chef collaborations — needs someone who can connect the James Beard generation's protégés with the spaces and guests ready for them. That's your role.",
      },
    ],
    tier: 3,
  },

  "greenville-sc": {
    slug: "greenville-sc",
    displayName: "Greenville, SC",
    state: "South Carolina",
    heroHeadline: "Falls Park has a seat for you.",
    heroSubhead:
      "Southern Appalachian food culture meets a revitalized Main Street. Greenville's table is one of the South's best secrets.",
    metaTagline: "Greenville's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Greenville, SC — Falls Park, Main Street, West End. Southern Appalachian food culture, walkable and curated.",
    sceneIntro:
      "Greenville's revival has produced a walkable, food-forward downtown that punches above its weight class. The Falls Park corridor and Main Street's independent restaurant culture have created the foundation for a genuine pop-up dining scene.",
    sceneBlocks: [
      {
        heading: "Falls Park's outdoor table",
        description:
          "Greenville's Falls Park setting creates one of the South's most atmospheric outdoor dining environments. Pop-up chefs and supper club organizers who use the Falls Park corridor access an audience that comes for the setting and stays for the food.",
        unsplashQuery: "greenville sc falls park outdoor dining",
      },
      {
        heading: "Main Street's independent spirit",
        description:
          "Greenville's walkable Main Street has developed a food culture rooted in independent operators who take local sourcing seriously. Pop-ups that reflect this ethic — Appalachian ingredients, regional produce, local craft beverages — find a community that shows up.",
        unsplashQuery: "greenville sc main street pop-up food dinner",
      },
      {
        heading: "Appalachian food traditions resurface",
        description:
          "Greenville sits at the edge of the Appalachian food region, and the chefs who draw on these traditions — ramps, pawpaws, heritage grains, mountain-raised proteins — create dining experiences with a regional specificity that the city's growing food community is increasingly hungry for.",
        unsplashQuery: "greenville appalachian food tradition chef dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Greenville is the South's most overlooked food city",
        cityDescription:
          "Falls Park supper clubs, Main Street chef's table events, and West End pop-up dinners have built a food scene that rivals cities twice Greenville's size. Tenseats maps where the city's food community actually gathers.",
      },
      {
        role: "chef",
        cityHeadline: "Greenville's food community is ready",
        cityDescription:
          "The city's Main Street revival has created an audience for thoughtful food experiences that Greenville's independent restaurant culture has begun to serve. Pop-up chefs who engage with Appalachian traditions and local sourcing find a community that takes food seriously.",
      },
      {
        role: "mixologist",
        cityHeadline: "Swamp Rabbit Trail farms reach the glass here",
        cityDescription:
          "Greenville's farm-to-table culture — built on Swamp Rabbit Trail agriculture and Upstate SC's growing season — creates ingredient access for cocktail programs that most cities can't source. Falls Park and Main Street pop-ups find an audience already primed for provenance.",
      },
      {
        role: "curator",
        cityHeadline: "Village of West Greenville deserves the spotlight",
        cityDescription:
          "The Village of West Greenville's arts district and the Swamp Rabbit Trail's farm community are producing a food culture that the national press hasn't discovered. Curators who surface this Appalachian-inflected scene are telling one of the South's most interesting emerging stories.",
      },
      {
        role: "venueHost",
        cityHeadline: "Greenville's spaces are perfectly suited for events",
        cityDescription:
          "Falls Park settings, Main Street storefronts, and West End creative spaces create intimate dinner venues with natural atmosphere. Connect your space with the pop-up chefs who want to cook in one of the South's most atmospheric small cities.",
      },
      {
        role: "facilitator",
        cityHeadline: "Main Street's table needs its connector",
        cityDescription:
          "Greenville's food scene — Swamp Rabbit Trail farm sourcing, Village of West Greenville pop-ups, Falls Park supper club circuit — runs on the right introductions. You know which farmer has surplus ramps, which Main Street space has a dark Friday. Connect them.",
      },
    ],
    tier: 3,
  },

  "cleveland-oh": {
    slug: "cleveland-oh",
    displayName: "Cleveland, OH",
    state: "Ohio",
    heroHeadline: "West Side Market never sleeps.",
    heroSubhead:
      "Cleveland's food renaissance is the comeback story the Great Lakes deserved. Ohio City and Tremont are leading it.",
    metaTagline: "Cleveland's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Cleveland, OH — Ohio City, Tremont, Gordon Square. West Side Market anchors a genuine food revival.",
    sceneIntro:
      "Cleveland's West Side Market and Ohio City neighborhood have anchored a food revival that encompasses pop-up dining, craft cocktail culture, and a chef community committed to celebrating the region's agricultural strengths.",
    sceneBlocks: [
      {
        heading: "West Side Market's pop-up circuit",
        description:
          "Cleveland's West Side Market is the anchor of one of America's great urban food communities. The pop-up chefs who source here and host dinners nearby build on a food culture that the market's century of operation has made genuinely deep.",
        unsplashQuery: "cleveland west side market pop-up food dinner",
      },
      {
        heading: "Ohio City and Tremont's creative table",
        description:
          "Cleveland's two most creative neighborhoods have developed a pop-up food culture that reflects the city's resilience. Intimate dinners in renovated spaces, chef collaborations in gallery venues, and supper clubs that draw on Great Lakes ingredients are the scene's backbone.",
        unsplashQuery: "cleveland ohio city tremont pop-up dinner",
      },
      {
        heading: "Great Lakes larder",
        description:
          "Cleveland's access to Lake Erie and the Great Lakes food shed — fish, regional produce, Ohio agricultural diversity — gives chefs distinctive ingredients. Pop-up dinners that celebrate this regional pantry create dining experiences with a specificity no coastal city can match.",
        unsplashQuery: "cleveland great lakes ohio food ingredients dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Cleveland's food scene earned the comeback narrative",
        cityDescription:
          "West Side Market, Ohio City, and Tremont have built a genuine food culture. Tenseats maps the pop-up dinners and supper clubs where Cleveland's food community gathers — the experiences the city's food press hasn't fully documented yet.",
      },
      {
        role: "chef",
        cityHeadline: "Cleveland's comeback is your opportunity",
        cityDescription:
          "Ohio City and Tremont have an established audience for serious food. West Side Market's food community creates natural demand for pop-up dinners that go deeper than the neighborhood's tables. Cleveland rewards the chefs who show up and stay.",
      },
      {
        role: "mixologist",
        cityHeadline: "Cleveland's cocktail culture is underrated",
        cityDescription:
          "Ohio City's craft cocktail scene has matured alongside its food culture. Spirits programs that engage with Great Lakes ingredients and Ohio agricultural products find an audience in Tremont and Gordon Square that takes beverages as seriously as food.",
      },
      {
        role: "curator",
        cityHeadline: "Slavic Village's food heritage is underdocumented",
        cityDescription:
          "Cleveland's Tremont and Slavic Village neighborhoods hold Eastern European food traditions — Polish, Slovenian, Czech — that the city's pop-up scene is beginning to engage with seriously. Curators who surface this archive alongside West Side Market's contemporary scene tell the complete story.",
      },
      {
        role: "venueHost",
        cityHeadline: "Ohio City's spaces have the right character",
        cityDescription:
          "Tremont galleries, Ohio City brick storefronts, and Gordon Square arts spaces create intimate dining venues with real Cleveland character. Connect your space with the chef community that West Side Market anchors — they're looking for rooms like yours.",
      },
      {
        role: "facilitator",
        cityHeadline: "West Side Market's network needs a matchmaker",
        cityDescription:
          "Cleveland's food scene — chef incubation in Tremont, West Side Market sourcing, Gordon Square supper clubs — connects through the right introductions. You know which Ohio City venue has availability, which Market vendor's product a pop-up chef needs. Make the match.",
      },
    ],
    tier: 3,
  },

  "oklahoma-city-ok": {
    slug: "oklahoma-city-ok",
    displayName: "Oklahoma City, OK",
    state: "Oklahoma",
    heroHeadline: "Midtown's table keeps a low profile.",
    heroSubhead:
      "Oklahoma City's growing chef scene is building on Southern food traditions in an underrepresented food city. Now's the time.",
    metaTagline: "Oklahoma City's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Oklahoma City, OK — Film Row, Midtown, Plaza District. OKC's emerging food culture, before the national press arrives.",
    sceneIntro:
      "Oklahoma City's Film Row and Midtown restaurant districts are developing a food culture that the national food media hasn't fully discovered. The chefs building here — drawing on Oklahoma's cattle heritage and Southern traditions — are creating something genuinely compelling.",
    sceneBlocks: [
      {
        heading: "Film Row's underground table",
        description:
          "Oklahoma City's Film Row district has attracted a creative class that's built a pop-up food culture to match its arts energy. Intimate dinners in converted theater spaces, warehouse venues, and gallery pop-ups reach an audience that's hungry for food experiences that match the neighborhood's character.",
        unsplashQuery: "oklahoma city film row pop-up dinner arts",
      },
      {
        heading: "The cattle country table",
        description:
          "Oklahoma's cattle heritage gives OKC chefs access to beef that most cities can only approximate. Pop-ups that take Oklahoma beef seriously — tasting menus built around heritage breeds, dry-aged cuts, and nose-to-tail preparation — are making the city's most distinctive food.",
        unsplashQuery: "oklahoma city beef heritage cattle chef dinner",
      },
      {
        heading: "Plaza District's creative food scene",
        description:
          "Oklahoma City's Plaza District has developed a walkable food culture that defies the city's car-centric reputation. Intimate dinners, rotating pop-ups, and chef collaborations in Plaza's creative spaces reach a local audience ready for food experiences that go beyond steakhouses.",
        unsplashQuery: "oklahoma city plaza district food pop-up dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "Oklahoma City eats better than its reputation",
        cityDescription:
          "Film Row, Midtown, and the Plaza District have a pop-up food culture that the national food media hasn't documented yet. Tenseats maps the dinners where OKC's food community gathers before the rest of the country finds out.",
      },
      {
        role: "chef",
        cityHeadline: "OKC's food scene is building and needs you",
        cityDescription:
          "Oklahoma City's Film Row and Midtown neighborhoods have the creative energy and audience to support serious pop-up concepts. Chefs who arrive before the national press do will build the audiences that define the city's food culture.",
      },
      {
        role: "mixologist",
        cityHeadline: "Oklahoma's ranch country belongs in the glass",
        cityDescription:
          "OKC's emerging craft spirits scene and Paseo Arts District pop-up culture are meeting in cocktail programs that reference Oklahoma's cattle and grain heritage. Film Row's creative audience and the Asian District's ingredient diversity give mixologists something to work with.",
      },
      {
        role: "curator",
        cityHeadline: "Oklahoma City's food story is untold",
        cityDescription:
          "The city's emerging pop-up culture, cattle heritage, and growing chef community are building something worth documenting. Curators who surface OKC's Paseo Arts District scene and the Asian District's culinary depth are telling a story the national press hasn't found yet.",
      },
      {
        role: "venueHost",
        cityHeadline: "Paseo Arts District spaces have the right energy",
        cityDescription:
          "Oklahoma City's Paseo Arts District studios, Film Row converted theaters, and Plaza District creative spaces create intimate dinner settings with real character. Connect your venue with the chefs building ranch-to-table cuisine before the national press arrives.",
      },
      {
        role: "facilitator",
        cityHeadline: "OKC's food scene needs its connector now",
        cityDescription:
          "Oklahoma City's pop-up circuit — Paseo Arts District, Film Row warehouse dinners, Asian District along Classen — is building fast. You know which Plaza District space has a dark night, which ranch-sourcing chef needs an audience. Make the introduction before it's obvious.",
      },
    ],
    tier: 3,
  },

  "meridian-ms": {
    slug: "meridian-ms",
    displayName: "Meridian, MS",
    state: "Mississippi",
    heroHeadline: "Mississippi Delta cooking, properly told.",
    heroSubhead:
      "Meridian is the Delta food tradition's gateway. The chefs telling this story deserve an audience beyond the county line.",
    metaTagline: "Meridian's Curated Food Events",
    metaDescription:
      "Pop-ups, chef dinners, and food events in Meridian, MS. Mississippi Delta foodways, soul food traditions, and African-American culinary heritage — properly told.",
    sceneIntro:
      "Meridian and the Mississippi Delta food tradition represent one of America's most important and underrepresented culinary stories — the roots of soul food, the African-American foodways that shaped Southern cuisine. The chefs telling this story authentically deserve the platform Tenseats provides.",
    sceneBlocks: [
      {
        heading: "Delta foodways, authentically told",
        description:
          "The Mississippi Delta's food traditions — the roots of soul food, the African-American culinary heritage that shaped Southern cuisine — are among America's most important cultural legacies. Pop-up chefs in Meridian who tell this story with knowledge and care are doing irreplaceable work.",
        unsplashQuery: "meridian mississippi delta soul food dinner heritage",
      },
      {
        heading: "Community kitchen culture",
        description:
          "Meridian's food culture is built around community — church suppers, family reunions, neighborhood gatherings that have preserved foodways generations deep. The chefs who bring this tradition into pop-up formats create dining experiences with genuine cultural weight.",
        unsplashQuery: "meridian mississippi community kitchen dinner",
      },
      {
        heading: "The crossroads table",
        description:
          "Meridian sits at the crossroads of Mississippi's food traditions — Delta cooking, Gulf Coast influence, and the African-American culinary heritage that runs through all of it. Pop-ups that engage with this intersection create the most culturally honest food in the state.",
        unsplashQuery: "mississippi crossroads food traditions dinner",
      },
    ],
    topPersonas: [
      {
        role: "guest",
        cityHeadline: "The Delta table is one of America's most important",
        cityDescription:
          "Meridian and the Mississippi Delta represent the roots of American soul food and one of the nation's most significant culinary heritages. Tenseats surfaces the pop-ups and community dinners where this tradition is being kept alive and carried forward.",
      },
      {
        role: "chef",
        cityHeadline: "Tell the Delta food story with authority",
        cityDescription:
          "Meridian's culinary heritage is one of America's most important and least-documented food traditions. Chefs who cook from this knowledge — Delta foodways, African-American culinary heritage, soul food's deep roots — deserve an audience far beyond the county line.",
      },
      {
        role: "mixologist",
        cityHeadline: "Mississippi Delta's drinking traditions run deep",
        cityDescription:
          "The Delta's juke joint culture and community gathering traditions have their own beverage heritage — bourbon, sweet tea, fruit-forward spirits — that Meridian's pop-up scene is beginning to reclaim. Cocktail programs that reference this history find an audience hungry for authenticity.",
      },
      {
        role: "curator",
        cityHeadline: "Mississippi Delta food deserves its platform",
        cityDescription:
          "The culinary heritage of Meridian and the Delta is among America's most important and least-documented food stories. Curators who surface these traditions — connecting them to audiences who can support the chefs who carry them — are doing essential preservation work.",
      },
      {
        role: "venueHost",
        cityHeadline: "Meridian's community spaces hold the Delta tradition",
        cityDescription:
          "Church halls, community kitchens, and the civic spaces where Meridian's food culture has always lived create the most culturally honest dinner venues in Mississippi. Open your space to the chefs preserving Delta foodways and the audience that needs to find them.",
      },
      {
        role: "facilitator",
        cityHeadline: "Delta food traditions need a bridge to wider tables",
        cityDescription:
          "Meridian's pop-up circuit — church supper traditions, community kitchen dinners, Delta-rooted chef collaborations — needs someone who can connect local knowledge to audiences beyond the county line. You know which community kitchen is available, which chef's story deserves to be heard. Tell it.",
      },
    ],
    tier: 3,
  },
};
