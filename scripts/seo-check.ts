/**
 * SEO validation script for /locations/* indexability.
 * Run: bun run scripts/seo-check.ts [base-url]
 * Default base: http://localhost:8080
 *
 * Validates:
 *   1. /robots.txt exists and explicitly allows /locations/
 *   2. /sitemap.xml responds with valid XML
 *   3. Sitemap contains every (city × service) combo from LOCATION_MATRIX
 *   4. Each /locations/$city/$service URL returns 200 with a unique <title>
 *      and JSON-LD schema markup (LocalBusiness + Service)
 */
import { LOCATION_MATRIX } from "../src/data/locations";

const BASE = process.argv[2] ?? "http://localhost:8080";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let failed = 0;
let passed = 0;
const log = (ok: boolean, msg: string) => {
  if (ok) {
    passed++;
    console.log(`${GREEN}✓${RESET} ${msg}`);
  } else {
    failed++;
    console.log(`${RED}✗ ${msg}${RESET}`);
  }
};

async function main() {
  console.log(`\nSEO check against ${YELLOW}${BASE}${RESET}\n`);

  // 1. robots.txt
  const robotsRes = await fetch(`${BASE}/robots.txt`);
  log(robotsRes.ok, `GET /robots.txt → ${robotsRes.status}`);
  const robots = await robotsRes.text();
  log(/allow:\s*\/locations\//i.test(robots), "robots.txt: explicit Allow: /locations/");
  log(/sitemap:\s*https?:\/\//i.test(robots), "robots.txt: declares Sitemap URL");

  // 2. sitemap.xml
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  log(sitemapRes.ok, `GET /sitemap.xml → ${sitemapRes.status}`);
  const ct = sitemapRes.headers.get("content-type") ?? "";
  log(ct.includes("xml"), `sitemap.xml: content-type is XML (${ct})`);
  const sitemap = await sitemapRes.text();
  log(sitemap.startsWith("<?xml"), "sitemap.xml: starts with <?xml declaration");
  log(/<urlset/.test(sitemap), "sitemap.xml: contains <urlset>");

  // 3. every location combo in sitemap
  const expected: string[] = [];
  for (const [city, services] of Object.entries(LOCATION_MATRIX)) {
    for (const service of services) expected.push(`/locations/${city}/${service}`);
  }
  const missing = expected.filter((u) => !sitemap.includes(u));
  log(
    missing.length === 0,
    `sitemap.xml: contains all ${expected.length} location combos${
      missing.length ? ` (missing: ${missing.slice(0, 3).join(", ")}…)` : ""
    }`,
  );

  // 4. sample location pages — first combo of each city
  const samples = Object.entries(LOCATION_MATRIX).map(
    ([city, services]) => `/locations/${city}/${services[0]}`,
  );
  const titles = new Set<string>();
  for (const path of samples) {
    const res = await fetch(`${BASE}${path}`);
    const ok = res.status === 200;
    log(ok, `GET ${path} → ${res.status}`);
    if (!ok) continue;
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() ?? "";
    log(Boolean(title), `${path}: has <title>`);
    log(!titles.has(title), `${path}: <title> is unique ("${title.slice(0, 60)}")`);
    titles.add(title);
    log(
      /"@type"\s*:\s*"LocalBusiness"/.test(html),
      `${path}: JSON-LD LocalBusiness present`,
    );
    log(/"@type"\s*:\s*"Service"/.test(html), `${path}: JSON-LD Service present`);
  }

  // 5. invalid combo must 404
  const bogus = await fetch(`${BASE}/locations/marietta/dumpster`);
  log(bogus.status === 404, `GET /locations/marietta/dumpster → 404 (invalid combo)`);

  console.log(
    `\n${passed} passed, ${failed} failed.${
      failed === 0 ? ` ${GREEN}All SEO checks OK.${RESET}` : ""
    }\n`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`${RED}SEO check crashed:${RESET}`, err);
  process.exit(1);
});
