import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_search_console/webmasters/v3";

/**
 * Server function to request URL inspection from Google Search Console
 */
export const inspectURL = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ url: z.string().url(), action: z.enum(["REQUEST_INDEXING"]) }).parse(data)
  )
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
      const error = await response.json();
      throw new Error(`GSC inspection failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    
    console.info(`[GSC-LOG] ${new Date().toISOString()} | INSPECTED | ${data.url} | ${result.indexingState || 'PENDING'}`);

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
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    const fallback = (msg: string) => ({
      url: data.url,
      indexingState: "UNKNOWN" as const,
      lastCrawlTime: null,
      coverageState: null,
      crawlState: null,
      robotsTxtState: null,
      timestamp: new Date().toISOString(),
      verdict: "NEUTRAL" as const,
      error: msg,
    });
    if (!LOVABLE_API_KEY) return fallback("LOVABLE_API_KEY not configured");
    if (!GSC_API_KEY) return fallback("Google Search Console not connected");

    const siteUrl = "https%3A%2F%2Fsidingdepot.lovable.app%2F";

    try {
      const response = await fetch(
        `${GATEWAY_URL}/sites/${siteUrl}/inspectUrl`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GSC_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inspectionUrl: data.url }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        console.error(`[GSC] inspectUrl failed: ${response.status} ${errBody}`);
        return {
          url: data.url,
          indexingState: "UNKNOWN",
          lastCrawlTime: null,
          coverageState: null,
          crawlState: null,
          robotsTxtState: null,
          timestamp: new Date().toISOString(),
          verdict: "NEUTRAL",
          error: `GSC unavailable (${response.status})`,
        };
      }

      const result = await response.json();
      return {
        url: data.url,
        indexingState: result.indexingState || "UNKNOWN",
        lastCrawlTime: result.lastCrawlTime ?? null,
        coverageState: result.coverageState ?? null,
        crawlState: result.crawlState ?? null,
        robotsTxtState: result.robotsTxtState ?? null,
        timestamp: new Date().toISOString(),
        verdict: result.verdict || "NEUTRAL",
        error: null,
      };
    } catch (e) {
      console.error("[GSC] inspectUrl exception:", e);
      return {
        url: data.url,
        indexingState: "UNKNOWN",
        lastCrawlTime: null,
        coverageState: null,
        crawlState: null,
        robotsTxtState: null,
        timestamp: new Date().toISOString(),
        verdict: "NEUTRAL",
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  });

/**
 * Fetch search analytics data from GSC
 */
export const getSearchAnalytics = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      startDate: z.string(),
      endDate: z.string(),
      dimensions: z.array(z.string()).optional().default(["page", "query"]),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    if (!GSC_API_KEY) throw new Error("GSC key missing");

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
          dimensions: data.dimensions,
          rowLimit: 100,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch GSC analytics: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return {
      rows: result.rows || [],
      startDate: data.startDate,
      endDate: data.endDate,
    };
  });

/**
 * Simulates GA4 Metrics for leads and WhatsApp clicks
 */
export const getGA4Metrics = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      startDate: z.string(),
      endDate: z.string(),
      url: z.string().url().optional(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    // Simulated GA4 response for lead_submit and whatsapp_click events
    await new Promise(r => setTimeout(r, 500));

    // Generating realistic simulated data
    const seed = data.url ? data.url.length : 10;
    const leads = Math.floor(seed * (0.5 + Math.random()));
    const whatsapp = Math.floor(seed * (1.2 + Math.random()));

    return {
      leads,
      whatsapp,
      conversionRate: ((leads + whatsapp) / (seed * 10 || 1) * 100).toFixed(1),
      startDate: data.startDate,
      endDate: data.endDate,
      url: data.url
    };
  });

/**
 * Simulates Lighthouse metrics
 */
export const getLighthouseMetrics = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }) => {
    await new Promise(r => setTimeout(r, 800));

    return {
      url: data.url,
      performance: 92 + Math.floor(Math.random() * 8),
      accessibility: 95 + Math.floor(Math.random() * 5),
      bestPractices: 98 + Math.floor(Math.random() * 2),
      seo: 100,
      metrics: {
        lcp: "1.2s",
        cls: "0.02",
        tbt: "120ms",
        fid: "15ms",
        tti: "2.1s"
      },
      timestamp: new Date().toISOString(),
    };
  });
