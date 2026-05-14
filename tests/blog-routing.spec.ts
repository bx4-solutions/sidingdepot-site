import { test, expect } from "@playwright/test";
import { BLOG_POSTS } from "../src/data/blog-posts";

const publishedPosts = BLOG_POSTS.filter((post) => post.status === "published");

test.describe("Blog article routing", () => {
  test("listing links point to valid published article slugs", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "blog routing smoke test runs on desktop only");

    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /siding depot insights/i })).toBeVisible();

    const hrefs = await page.locator("a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")).filter(Boolean)
    );

    for (const post of publishedPosts) {
      expect(hrefs, `missing listing link for ${post.slug}`).toContain(`/blog/${post.slug}`);
    }
  });

  test("each article route renders the matching title and body", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "blog routing smoke test runs on desktop only");

    for (const post of publishedPosts) {
      await page.goto(`/blog/${post.slug}`);
      await expect(page).toHaveURL(new RegExp(`/blog/${post.slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(post.title);
      await expect(page.getByRole("heading", { name: post.sections[0].h2 }).first()).toBeVisible();
    }
  });
});