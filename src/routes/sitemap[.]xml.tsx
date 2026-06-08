import { createFileRoute } from "@tanstack/react-router";
import { STATIC_ROUTES, getAllLocationCombos, SITE_ORIGIN } from "@/data/locations";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

// Static lastmod dates per route — update when content changes significantly.
// Using a fixed date prevents Google from discarding the freshness signal
// (a rolling "today" date on every request trains Googlebot to ignore lastmod).
const ROUTE_LASTMOD: Record<string, string> = {
  "/": "2025-11-01",
  "/about": "2025-09-01",
  "/contact": "2025-10-01",
  "/siding": "2025-11-01",
  "/painting": "2025-10-01",
  "/roofing": "2025-10-01",
  "/gutters": "2025-09-01",
  "/windows": "2025-09-01",
  "/doors": "2025-09-01",
  "/decks": "2025-09-01",
  "/dumpster": "2025-08-01",
  "/dumpster-rental": "2025-08-01",
  "/guide": "2025-10-01",
  "/projects": "2025-11-01",
  "/finance": "2025-09-01",
  "/blog": "2025-11-01",
};
const DEFAULT_LASTMOD = "2025-10-01";
const LOCATION_LASTMOD = "2025-10-01";

function buildSitemap(origin: string): string {
  const urls: { loc: string; priority: string; changefreq: string; lastmod: string }[] = [];

  for (const path of STATIC_ROUTES) {
    urls.push({
      loc: `${origin}${path}`,
      priority: path === "/" ? "1.0" : "0.8",
      changefreq: "weekly",
      lastmod: ROUTE_LASTMOD[path] ?? DEFAULT_LASTMOD,
    });
  }

  for (const { city, service } of getAllLocationCombos()) {
    urls.push({
      loc: `${origin}/locations/${city}/${service}`,
      priority: "0.9",
      changefreq: "monthly",
      lastmod: LOCATION_LASTMOD,
    });
  }

  for (const post of BLOG_POSTS) {
    // Only include published posts in sitemap
    if (post.status === "published") {
      urls.push({
        loc: `${origin}/blog/${post.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: (post as any).modifiedDate ?? post.publishDate,
      });
    }
  }

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  head: () => ({
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
    ],
  }),
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin || SITE_ORIGIN;
        const xml = buildSitemap(origin);
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
