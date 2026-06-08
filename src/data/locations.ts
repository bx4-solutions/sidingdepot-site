import { CITIES } from "./site-meta";

export const SITE_ORIGIN =
  (import.meta.env?.VITE_SITE_ORIGIN as string | undefined) ?? "https://sidingdepot.com";

/**
 * Phase 2 — City × Service priority matrix from the PRD.
 * Only combinations listed here are valid /locations/$city/$service routes.
 * Adding a new combo here automatically:
 *   - enables the dynamic route (loader stops 404'ing)
 *   - includes the URL in /sitemap.xml
 */
export const LOCATION_MATRIX: Record<string, readonly string[]> = {
  marietta: ["siding", "painting", "roofing", "doors", "windows", "decks", "gutters", "dumpster"],
  alpharetta: ["siding", "painting", "windows", "doors", "roofing", "decks", "gutters", "dumpster"],
  milton: ["siding", "decks", "painting", "roofing", "windows", "doors", "gutters", "dumpster"],
  canton: ["siding", "roofing", "gutters", "painting", "windows", "doors", "decks", "dumpster"],
  woodstock: ["siding", "painting", "roofing", "windows", "doors", "decks", "gutters", "dumpster"],
  roswell: ["siding", "windows", "painting", "doors", "roofing", "decks", "gutters", "dumpster"],
  kennesaw: ["siding", "roofing", "painting", "windows", "doors", "decks", "gutters", "dumpster"],
  "johns-creek": [
    "siding",
    "decks",
    "roofing",
    "painting",
    "windows",
    "doors",
    "gutters",
    "dumpster",
  ],
  "sandy-springs": [
    "siding",
    "painting",
    "roofing",
    "windows",
    "doors",
    "decks",
    "gutters",
    "dumpster",
  ],
  acworth: ["siding", "gutters", "roofing", "painting", "windows", "doors", "decks", "dumpster"],
};

export type LocationCombo = { city: string; service: string };

export function isValidLocation(city: string, service: string): boolean {
  return LOCATION_MATRIX[city]?.includes(service) ?? false;
}

export function getAllLocationCombos(): LocationCombo[] {
  return Object.entries(LOCATION_MATRIX).flatMap(([city, services]) =>
    services.map((service) => ({ city, service })),
  );
}

export function getCityMeta(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}


/** All static (non-dynamic) routes that should appear in sitemap.xml */
export const STATIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/siding",
  "/painting",
  "/roofing",
  "/gutters",
  "/windows",
  "/doors",
  "/decks",
  "/dumpster",
  "/dumpster-rental",
  "/contact",
  "/guide",
  "/lp/siding-marietta",
  "/lp/siding-alpharetta",
  "/lp/siding-canton",
] as const;
