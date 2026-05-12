import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — focused on visual regression of the site chrome
 * (navbar / header). The dev server is started automatically.
 *
 * Snapshots live next to specs in tests/__snapshots__/. CI is set to
 * fail (no implicit updates) — regenerate locally with `--update-snapshots`.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4173",
    trace: "retain-on-failure",
  },
  // Strict pixel-diff settings for the header.
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },
  projects: [
    { name: "mobile",  use: { ...devices["iPhone 12"] } },
    { name: "tablet",  use: { ...devices["iPad (gen 7)"] } },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    // Build once, serve the production preview — fastest reliable mode for CI.
    command: "bun run build && bun run preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
