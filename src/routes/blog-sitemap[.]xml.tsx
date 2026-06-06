import { createFileRoute } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/data/blog-posts";
import { SITE_ORIGIN } from "@/data/locations";

function buildBlogSitemap(origin: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = BLOG_POSTS.filter((p) => p.status === "published").map(
    (post) =>
      `  <url><loc>${origin}/blog/${post.slug}</loc><lastmod>${post.publishDate || lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/blog-sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin || SITE_ORIGIN;
        const xml = buildBlogSitemap(origin);
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
