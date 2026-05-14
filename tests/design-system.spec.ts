import { test, expect } from "@playwright/test";

/**
 * Design System Regression Test
 * 
 * This test ensures that:
 * 1. The brand tokens (--sd-green, etc.) are defined correctly in the DOM.
 * 2. Elements that should be green actually use the current brand token.
 * 3. Text on top of brand tokens maintains accessibility (black on green).
 */

test.describe("Design System Colors", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
  });

  test("Brand tokens are defined correctly", async ({ page }) => {
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        sdGreen: style.getPropertyValue("--sd-green").trim(),
        sdNavy: style.getPropertyValue("--sd-navy").trim(),
        sdBlack: style.getPropertyValue("--sd-black").trim(),
      };
    });

    // Check if oklch values are present (not empty)
    expect(tokens.sdGreen).toContain("oklch");
    expect(tokens.sdNavy).toContain("oklch");
    expect(tokens.sdBlack).toContain("oklch");
  });

  test("Green elements have black text for readability", async ({ page }) => {
    // Find common green elements like CTA buttons or badges
    // We check specifically for background-color matching --sd-green
    const greenElements = await page.evaluate(() => {
      const sdGreen = getComputedStyle(document.documentElement).getPropertyValue("--sd-green").trim();
      const elements = Array.from(document.querySelectorAll("*"));
      
      return elements
        .filter(el => {
          const style = getComputedStyle(el);
          return style.backgroundColor === sdGreen || 
                 (el.classList.contains('bg-sd-green') && style.backgroundColor !== 'transparent');
        })
        .map(el => {
          const style = getComputedStyle(el);
          return {
            tagName: el.tagName,
            color: style.color,
            backgroundColor: style.backgroundColor,
            text: el.textContent?.trim().substring(0, 20)
          };
        });
    });

    // If we have green elements, verify their text is dark
    // oklch(0.12 0 0) is roughly #0A0A0A
    for (const el of greenElements) {
      // Simple heuristic: black text is usually near rgb(10, 10, 10)
      const color = el.color.match(/\d+/g);
      if (color) {
        const [r, g, b] = color.map(Number);
        // Ensure total brightness is low (black text)
        expect(r + g + b, `Element <${el.tagName}> "${el.text}" has non-black text on green background`).toBeLessThan(100);
      }
    }
  });

  test("Blog pages use the brand green token", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    // Check if the "INSIGHTS" span or category badges use the green token
    const insightsColor = await page.evaluate(() => {
      const insights = document.evaluate("//span[contains(text(), 'INSIGHTS')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
      if (!insights) return null;
      return getComputedStyle(insights).color;
    });

    const sdGreen = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--sd-green").trim());
    
    if (insightsColor) {
      expect(insightsColor).toBe(sdGreen);
    }
  });
});
