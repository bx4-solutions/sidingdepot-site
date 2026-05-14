import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { BLOG_POSTS } from "../src/data/blog-posts";

const SITEMAPS = ["sitemap.xml", "blog-sitemap.xml"];
const origin = 'https://sidingdepot.com';
const parser = new XMLParser();

console.log("🚀 Starting Sitemap Audit...");

let hasError = false;

for (const sitemapFile of SITEMAPS) {
  const filePath = path.join(process.cwd(), "public", sitemapFile);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: ${sitemapFile} not found in public folder.`);
    hasError = true;
    continue;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  
  try {
    const parsed = parser.parse(content);
    console.log(`✅ ${sitemapFile} is well-formed XML.`);

    const urls: string[] = [];
    if (parsed.urlset && parsed.urlset.url) {
      const urlEntries = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
      urlEntries.forEach((entry: any) => {
        if (entry.loc) urls.push(entry.loc);
      });
    }

    if (urls.length === 0) {
      console.error(`❌ Error: ${sitemapFile} contains no URLs.`);
      hasError = true;
    } else {
      console.log(`ℹ️ Found ${urls.length} URLs in ${sitemapFile}.`);
      
      // Specific check for blog-sitemap.xml slugs
      if (sitemapFile === "blog-sitemap.xml") {
        const publishedSlugs = BLOG_POSTS.filter(p => p.status === "published").map(p => p.slug);
        for (const slug of publishedSlugs) {
          const expectedUrl = `${origin}/blog/${slug}`;
          if (!urls.includes(expectedUrl)) {
            console.error(`❌ Error: Missing slug in blog-sitemap.xml: ${slug}`);
            hasError = true;
          }
        }
      }
    }
  } catch (e) {
    console.error(`❌ Error parsing ${sitemapFile}:`, e.message);
    hasError = true;
  }
}

if (hasError) {
  console.log("\n👎 Sitemap audit failed.");
  process.exit(1);
} else {
  console.log("\n👍 Sitemap audit passed successfully!");
  process.exit(0);
}
