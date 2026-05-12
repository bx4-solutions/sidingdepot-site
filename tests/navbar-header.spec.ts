import { test, expect, type Page } from "@playwright/test";

/**
 * Header / navbar regression suite.
 *
 * Verifies, at three breakpoints:
 *  1. The bar height matches the canonical value documented in
 *     docs/qa/navbar-header.md (mobile 80, tablet 96, desktop 80).
 *  2. No descendant element overflows the bar's bottom edge.
 *  3. The bar matches the committed visual snapshot (pixel diff).
 *
 * Snapshots live in tests/__snapshots__/navbar-header.spec.ts/ and are
 * tracked in git. Update with: `bunx playwright test --update-snapshots`.
 */

type Case = { name: "mobile" | "tablet" | "desktop"; expectedHeight: number };

const CASES: Record<Case["name"], Case> = {
  mobile:  { name: "mobile",  expectedHeight: 80 },
  tablet:  { name: "tablet",  expectedHeight: 96 },
  desktop: { name: "desktop", expectedHeight: 80 },
};

async function gotoHome(page: Page) {
  await page.goto("/");
  // Wait for fonts/images to settle so the visual diff is stable.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}

test.describe("Navbar header", () => {
  for (const projectName of Object.keys(CASES) as Case["name"][]) {
    const expected = CASES[projectName].expectedHeight;

    test(`[${projectName}] bar is ${expected}px and contains its children`, async ({
      page,
    }, testInfo) => {
      // Only run each test in its matching project to keep the matrix clean.
      test.skip(testInfo.project.name !== projectName, "wrong project");

      await gotoHome(page);
      const bar = page.locator("header > div").first();
      await expect(bar).toBeVisible();
      await expect(bar).toHaveCSS("height", `${expected}px`);

      // Overflow guard: every child must fit inside the bar's box.
      const overflow = await bar.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return [...el.querySelectorAll("*")].some((c) => {
          const cr = c.getBoundingClientRect();
          return cr.bottom > r.bottom + 0.5 || cr.top < r.top - 0.5;
        });
      });
      expect(overflow, "child element overflows the navbar bar").toBe(false);
    });

    test(`[${projectName}] visual snapshot matches`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== projectName, "wrong project");
      await gotoHome(page);
      const header = page.locator("header").first();
      await expect(header).toHaveScreenshot(`navbar-${projectName}.png`);
    });

    test(`[${projectName}] sticky height stays ${expected}px after scroll`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== projectName, "wrong project");

      await gotoHome(page);

      // Make sure the page is tall enough to actually scroll past the header.
      await page.evaluate(() => {
        if (document.body.scrollHeight < window.innerHeight + 1200) {
          const spacer = document.createElement("div");
          spacer.style.height = "1600px";
          spacer.setAttribute("data-test-spacer", "true");
          document.body.appendChild(spacer);
        }
      });

      const header = page.locator("header").first();
      const bar = header.locator("> div").first();

      // Scroll well past the header so the sticky behavior engages.
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForFunction(() => window.scrollY >= 800);

      // Header must remain pinned to the top of the viewport.
      const headerBox = await header.boundingBox();
      expect(headerBox, "header bounding box").not.toBeNull();
      expect(headerBox!.y).toBeCloseTo(0, 0);

      // Bar height must not change between resting and sticky states.
      await expect(bar).toHaveCSS("height", `${expected}px`);

      // Overflow guard must still hold while sticky.
      const overflow = await bar.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return [...el.querySelectorAll("*")].some((c) => {
          const cr = c.getBoundingClientRect();
          return cr.bottom > r.bottom + 0.5 || cr.top < r.top - 0.5;
        });
      });
      expect(overflow, "child overflows sticky navbar").toBe(false);
    });
  }
});
