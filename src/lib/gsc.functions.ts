import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_search_console/webmasters/v3";

/**
 * Server function to request URL inspection from Google Search Console
 * Useful for immediate indexing after publishing new pages
 */
export const inspectURL = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ url: z.string().url(), action: z.enum(["REQUEST_INDEXING"]) }).parse(data)
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    if (!GSC_API_KEY) {
      throw new Error("Google Search Console not connected");
    }

    // Extract site URL from the path parameter
    const siteUrl = "https%3A%2F%2Fsidingdepot.lovable.app%2F";

    const response = await fetch(
      `${GATEWAY_URL}/sites/${siteUrl}/inspectUrl`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GSC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: data.url,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GSC inspection failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return {
      success: true,
      inspectionResult: result,
      message: `URL inspection requested for ${data.url}`,
    };
  });

/**
 * Fetch indexing status from Google Search Console
 */
export const getIndexingStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    if (!GSC_API_KEY) {
      throw new Error("Google Search Console not connected");
    }

    const siteUrl = "https%3A%2F%2Fsidingdepot.lovable.app%2F";

    const response = await fetch(
      `${GATEWAY_URL}/sites/${siteUrl}/inspectUrl`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GSC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: data.url,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch indexing status");
    }

    const result = await response.json();
    return {
      url: data.url,
      indexingState: result.indexingState || "UNKNOWN",
      lastCrawlTime: result.lastCrawlTime,
      coverageState: result.coverageState,
      crawlState: result.crawlState,
      robotsTxtState: result.robotsTxtState,
    };
  });

/**
 * Fetch search analytics data from GSC
 */
export const getSearchAnalytics = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      startDate: z.string(), // YYYY-MM-DD
      endDate: z.string(), // YYYY-MM-DD
    }).parse(data)
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    if (!GSC_API_KEY) {
      throw new Error("Google Search Console not connected");
    }

    const siteUrl = "https%3A%2F%2Fsidingdepot.lovable.app%2F";

    const response = await fetch(
      `${GATEWAY_URL}/sites/${siteUrl}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GSC_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: data.startDate,
          endDate: data.endDate,
          dimensions: ["page", "query"],
          rowLimit: 25,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch search analytics: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return {
      rows: result.rows || [],
      startDate: data.startDate,
      endDate: data.endDate,
    };
  });
