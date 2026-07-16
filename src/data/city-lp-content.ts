/**
 * Per-city content for the dedicated high-conversion siding LPs
 * (/lp/{city}-siding). Structure is identical across cities (paid-traffic
 * best practice); only the hyperlocal copy changes per city.
 *
 * These LPs are SEPARATE from the shared /locations/$city/$service template —
 * they are standalone, conversion-focused landing pages for paid traffic.
 */

export type CityLpData = {
  /** Route slug segment — URL is /lp/{routeSlug}. */
  routeSlug: string;
  city: string;
  county: string;
  /** Neighborhoods / areas served, human-readable (· separated). */
  neighborhoods: string;
  /** ZIP codes served (· separated). */
  zips: string;
  /** Hyperlocal intro paragraph (2–3 sentences, city-specific). */
  intro: string;
  /** City-specific home/climate challenges (bullets). */
  challenges: readonly string[];
  /** Optional extra local-proof line (e.g. HQ proximity) shown in the local section. */
  localNote?: string;
};

const BASE_CHALLENGES: readonly string[] = [
  "Soft, swollen or crumbling siding near the ground and behind gutters",
  "Peeling paint that comes back within a year of repainting",
  "Woodpecker or insect damage in older wood trim",
  "Hidden moisture rot around windows and chimneys",
];

export const CITY_LPS: Record<string, CityLpData> = {
  marietta: {
    routeSlug: "marietta-siding",
    city: "Marietta",
    county: "Cobb County",
    neighborhoods:
      "East Cobb · West Cobb · Marietta Square & Historic District · Kennesaw Mountain area · Whitlock Avenue corridor · Powers Ferry",
    zips: "30060 · 30062 · 30064 · 30066 · 30067 · 30068",
    intro:
      "Marietta homes take a beating from Georgia's climate. Long, humid summers and heavy Cobb County rainfall push moisture into aging wood, Masonite and hardboard siding — the exact materials on thousands of homes across East Cobb, West Cobb and the neighborhoods around historic Marietta Square. Left unchecked, that moisture leads to rot, warping and paint failure. As a James Hardie Elite Preferred Contractor, we replace failing siding with fiber cement built to survive Georgia humidity.",
    challenges: BASE_CHALLENGES,
    localNote:
      "Our headquarters is right here in Marietta — 3036 Roswell Rd — so your estimator, project manager and crews are minutes away, not across the metro.",
  },
  alpharetta: {
    routeSlug: "alpharetta-siding",
    city: "Alpharetta",
    county: "Fulton County",
    neighborhoods:
      "Windward · Avalon & Downtown Alpharetta · Country Club of the South · Crooked Creek · Milton border · Webb Bridge corridor",
    zips: "30004 · 30005 · 30009 · 30022",
    intro:
      "Alpharetta's upscale homes — from Windward to the neighborhoods around Avalon and the tech corridor — were often built with wood, Masonite or early fiber-cement siding that Georgia's humidity slowly breaks down. Homeowners here expect a premium finish that lasts. As a James Hardie Elite Preferred Contractor, Siding Depot replaces failing siding across Alpharetta with fiber cement engineered for durability and a flawless, low-maintenance look.",
    challenges: BASE_CHALLENGES,
  },
  milton: {
    routeSlug: "milton-siding",
    city: "Milton",
    county: "Fulton County",
    neighborhoods:
      "Crabapple · The Manor · White Columns · Six Hills · Blue Valley · Milton's estate & equestrian communities",
    zips: "30004 · 30009",
    intro:
      "Milton's large-lot estates and equestrian properties demand siding that matches the quality of the home. Big elevations mean more exposure to Georgia's humidity, sun and storms — and more square footage where aging wood or Masonite siding fails first. As a James Hardie Elite Preferred Contractor, Siding Depot re-sides Milton homes in fiber cement that protects the investment and holds a premium finish for decades.",
    challenges: BASE_CHALLENGES,
  },
  canton: {
    routeSlug: "canton-siding",
    city: "Canton",
    county: "Cherokee County",
    neighborhoods:
      "BridgeMill · Great Sky · Harmony on the Lakes · Sixes area · Downtown Canton · Hickory Flat",
    zips: "30114 · 30115",
    intro:
      "Canton mixes newer Cherokee County construction with older homes — and both feel Georgia's humidity. On newer builds, builder-grade siding often fails early; on older homes, wood and Masonite rot behind gutters and trim. As a James Hardie Elite Preferred Contractor, Siding Depot replaces failing siding across Canton with fiber cement built to survive the climate and cut maintenance for good.",
    challenges: BASE_CHALLENGES,
  },
  woodstock: {
    routeSlug: "woodstock-siding",
    city: "Woodstock",
    county: "Cherokee County",
    neighborhoods:
      "Towne Lake · Downtown Woodstock · Eagle Watch · Bradshaw Farm · Deer Run · Woodlands",
    zips: "30188 · 30189",
    intro:
      "Woodstock's family neighborhoods — from Towne Lake to the areas around downtown — are full of homes built in the '90s and 2000s with siding that wasn't made for two decades of Georgia humidity. Swelling, rot and repeat paint failure are common. As a James Hardie Elite Preferred Contractor, Siding Depot re-sides Woodstock homes in fiber cement that ends the maintenance cycle and transforms the curb appeal.",
    challenges: BASE_CHALLENGES,
  },
  roswell: {
    routeSlug: "roswell-siding",
    city: "Roswell",
    county: "Fulton County",
    neighborhoods:
      "Historic Roswell · Crabapple · Martin's Landing · Willeo / Chattahoochee riverside · Horseshoe Bend · Country Club",
    zips: "30075 · 30076 · 30077",
    intro:
      "Roswell's mature, tree-lined neighborhoods — many near the Chattahoochee — combine shade, moisture and decades-old homes, a recipe for siding rot and mildew. Historic and established homes here often hide wood or Masonite siding that's failing behind the paint. As a James Hardie Elite Preferred Contractor, Siding Depot replaces it with fiber cement that resists moisture and keeps Roswell homes looking sharp.",
    challenges: BASE_CHALLENGES,
  },
  kennesaw: {
    routeSlug: "kennesaw-siding",
    city: "Kennesaw",
    county: "Cobb County",
    neighborhoods:
      "Kennesaw Mountain area · Town Center · Legacy Park · Stilesboro · Barrett Parkway corridor · Pine Mountain",
    zips: "30144 · 30152",
    intro:
      "Kennesaw's established Cobb County neighborhoods — many around Kennesaw Mountain and Town Center — are full of homes whose original siding has taken 20+ years of Georgia humidity. Rot near the ground, mildew and peeling paint are the usual signs. As a James Hardie Elite Preferred Contractor, Siding Depot replaces failing siding across Kennesaw with fiber cement built to last and cut maintenance.",
    challenges: BASE_CHALLENGES,
  },
  "johns-creek": {
    routeSlug: "johns-creek-siding",
    city: "Johns Creek",
    county: "Fulton County",
    neighborhoods: "Medlock Bridge · St. Ives · Seven Oaks · Rivermont · Sugar Mill · Doublegate",
    zips: "30022 · 30097",
    intro:
      "Johns Creek's master-planned, upscale neighborhoods hold some of North Fulton's most valuable homes — and homeowners here expect siding that protects that investment and looks impeccable. Aging wood, Masonite or early fiber-cement siding fails in Georgia's humidity long before the home's value drops. As a James Hardie Elite Preferred Contractor, Siding Depot re-sides Johns Creek homes in premium fiber cement, done right the first time.",
    challenges: BASE_CHALLENGES,
  },
  "sandy-springs": {
    routeSlug: "sandy-springs-siding",
    city: "Sandy Springs",
    county: "Fulton County",
    neighborhoods:
      "Riverside · Dunwoody Panhandle · High Point · North Springs · Huntcliff · Chattahoochee riverside",
    zips: "30328 · 30342 · 30350",
    intro:
      "Sandy Springs blends mid-century homes with luxury rebuilds — many near the Chattahoochee, where moisture and shade accelerate siding rot and mildew. Older wood and Masonite siding is especially vulnerable. As a James Hardie Elite Preferred Contractor, Siding Depot replaces failing siding across Sandy Springs with fiber cement that resists Georgia's humidity and elevates the home's finish.",
    challenges: BASE_CHALLENGES,
  },
  acworth: {
    routeSlug: "acworth-siding",
    city: "Acworth",
    county: "Cobb County",
    neighborhoods:
      "Lake Acworth · Lake Allatoona · Downtown Acworth · Bentwater · Brookstone · Governors Towne",
    zips: "30101 · 30102",
    intro:
      "Acworth's lakeside setting — Lake Acworth and Lake Allatoona — means higher humidity and more moisture exposure than most of Cobb County, and siding pays the price. Wood, Masonite and hardboard rot, swell and mildew fast near the water. As a James Hardie Elite Preferred Contractor, Siding Depot re-sides Acworth homes in fiber cement built specifically to shrug off moisture and last.",
    challenges: BASE_CHALLENGES,
  },
};
