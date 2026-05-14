import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const SITEMAPS = ["sitemap.xml", "blog-sitemap.xml"];
const parser = new XMLParser();

test.describe("Sitemap Validation", () => {
  for (const sitemapFile of SITEMAPS) {
    test(`validate ${sitemapFile} format and URLs`, async ({ page }) => {
      const filePath = path.join(process.cwd(), "public", sitemapFile);
      
      // 1. Check if file exists
      expect(fs.existsSync(filePath), `${sitemapFile} should exist in public folder`).toBe(true);
      
      const content = fs.readFileSync(filePath, "utf-8");
      
      // 2. Check if XML is well-formed
      let parsed;
      try {
        parsed = parser.parse(content);
      } catch (e) {
        throw new Error(`${sitemapFile} is not a valid XML: ${e.message}`);
      }
      
      expect(parsed.urlset || parsed.sitemapindex, `${sitemapFile} should have a valid root tag`).toBeDefined();

      // 3. Extract URLs and check for 200 status
      const urls: string[] = [];
      if (parsed.urlset && parsed.urlset.url) {
        const urlEntries = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
        urlEntries.forEach((entry: any) => {
          if (entry.loc) urls.push(entry.loc);
        });
      } else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
        const sitemapEntries = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];
        sitemapEntries.forEach((entry: any) => {
          if (entry.loc) urls.push(entry.loc);
        });
      }

      expect(urls.length, `${sitemapFile} should contain URLs`).toBeGreaterThan(0);

      // Validate a sample of URLs (or all if the list is small) to ensure they return 200
      // We use page.goto or request.get. Since these are absolute URLs in sitemap, 
      // they might point to the production domain. We'll map them to local for testing.
      for (const url of urls.slice(0, 10)) { // Testing first 10 for performance
        const urlObj = new URL(url);
        const localPath = urlObj.pathname;
        
        const response = await page.goto(localPath);
        expect(response?.status(), `URL ${url} should return 200 OK`).toBe(200);
      }
    });
  }
});
