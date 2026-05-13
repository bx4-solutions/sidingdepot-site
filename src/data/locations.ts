import { CITIES, SERVICES } from "./site";

export const SITE_ORIGIN =
  (import.meta.env?.VITE_SITE_ORIGIN as string | undefined) ??
  "https://sidingdepot.lovable.app";

/**
 * Phase 2 — City × Service priority matrix from the PRD.
 * Only combinations listed here are valid /locations/$city/$service routes.
 * Adding a new combo here automatically:
 *   - enables the dynamic route (loader stops 404'ing)
 *   - includes the URL in /sitemap.xml
 */
export const LOCATION_MATRIX: Record<string, readonly string[]> = {
  marietta:        ["siding", "painting", "roofing", "doors"],
  alpharetta:      ["siding", "painting", "windows", "doors"],
  milton:          ["siding", "deck", "painting"],
  canton:          ["siding", "roofing", "gutters"],
  woodstock:       ["siding", "painting"],
  roswell:         ["siding", "windows", "painting", "doors"],
  kennesaw:        ["siding", "roofing"],
  "johns-creek":   ["siding", "deck"],
  "sandy-springs": ["siding", "painting"],
  acworth:         ["siding", "gutters"],
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

export function getServiceMeta(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
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
  "/deck",
  "/dumpster",
  "/dumpster-rental",
  "/contact",
  "/guide",
  "/guide/thank-you",
  "/lp/siding-marietta",
  "/lp/siding-alpharetta",
  "/lp/siding-canton",
] as const;
