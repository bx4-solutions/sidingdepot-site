import { createFileRoute } from "@tanstack/react-router";
import {
  STATIC_ROUTES,
  getAllLocationCombos,
  SITE_ORIGIN,
} from "@/data/locations";
import { BLOG_POSTS } from "@/data/blog-posts";

function buildSitemap(origin: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls: { loc: string; priority: string; changefreq: string }[] = [];

  for (const path of STATIC_ROUTES) {
    urls.push({
      loc: `${origin}${path}`,
      priority: path === "/" ? "1.0" : "0.8",
      changefreq: "weekly",
    });
  }

  for (const { city, service } of getAllLocationCombos()) {
    urls.push({
      loc: `${origin}/locations/${city}/${service}`,
      priority: "0.9",
      changefreq: "weekly",
    });
  }

  for (const post of BLOG_POSTS) {
    // Only include published posts in sitemap
    if (post.status === 'published') {
      urls.push({
        loc: `${origin}/blog/${post.slug}`,
        priority: "0.7",
        changefreq: "monthly",
      });
    }
  }

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
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
