import fs from "fs";
import { BLOG_POSTS } from "../src/data/blog-posts";
import { LOCATION_MATRIX } from "../src/data/locations";

const DOMAIN = "https://sidingdepot.com";
const lastMod = new Date().toISOString().split("T")[0];

// Only routes with actual route files in src/routes/
const staticRoutes: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/siding", priority: "0.9", changefreq: "weekly" },
  { path: "/painting", priority: "0.9", changefreq: "weekly" },
  { path: "/windows", priority: "0.9", changefreq: "weekly" },
  { path: "/doors", priority: "0.9", changefreq: "weekly" },
  { path: "/decks", priority: "0.9", changefreq: "weekly" },
  { path: "/gutters", priority: "0.9", changefreq: "weekly" },
  { path: "/roofing", priority: "0.9", changefreq: "weekly" },
  { path: "/dumpster", priority: "0.8", changefreq: "monthly" },
  { path: "/dumpster-rental", priority: "0.8", changefreq: "monthly" },
  { path: "/finance", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/projects", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/guide", priority: "0.7", changefreq: "monthly" },
  { path: "/guide/thank-you", priority: "0.4", changefreq: "yearly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/lp/siding-marietta", priority: "0.9", changefreq: "monthly" },
  { path: "/lp/siding-alpharetta", priority: "0.9", changefreq: "monthly" },
  { path: "/lp/siding-canton", priority: "0.9", changefreq: "monthly" },
];

// Generate all city × service location combos from LOCATION_MATRIX
const locationCombos = Object.entries(LOCATION_MATRIX).flatMap(([city, services]) =>
  services.map((service) => `/locations/${city}/${service}`),
);

const generateSitemap = () => {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  // Static routes
  for (const { path, priority, changefreq } of staticRoutes) {
    lines.push("  <url>");
    lines.push(`    <loc>${DOMAIN}${path}</loc>`);
    lines.push(`    <lastmod>${lastMod}</lastmod>`);
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);
    lines.push("  </url>");
  }

  // Location pages (city × service) — highest SEO value
  for (const path of locationCombos) {
    lines.push("  <url>");
    lines.push(`    <loc>${DOMAIN}${path}</loc>`);
    lines.push(`    <lastmod>${lastMod}</lastmod>`);
    lines.push("    <changefreq>weekly</changefreq>");
    lines.push("    <priority>0.9</priority>");
    lines.push("  </url>");
  }

  // Published blog posts
  for (const post of BLOG_POSTS) {
    if (post.status === "published") {
      lines.push("  <url>");
      lines.push(`    <loc>${DOMAIN}/blog/${post.slug}</loc>`);
      lines.push(`    <lastmod>${post.publishDate ?? lastMod}</lastmod>`);
      lines.push("    <changefreq>monthly</changefreq>");
      lines.push("    <priority>0.7</priority>");
      lines.push("  </url>");
    }
  }

  lines.push("</urlset>");

  fs.writeFileSync("./public/sitemap.xml", lines.join("\n"));

  const publishedPosts = BLOG_POSTS.filter((p) => p.status === "published").length;
  const total = staticRoutes.length + locationCombos.length + publishedPosts;
  console.log(`sitemap.xml generated: ${total} URLs total`);
  console.log(`  - ${staticRoutes.length} static routes`);
  console.log(`  - ${locationCombos.length} location pages (city x service)`);
  console.log(`  - ${publishedPosts} blog posts`);
};

generateSitemap();
