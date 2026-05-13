import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";


const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_search_console/webmasters/v3";
const GSC_SITE_URL = "https://sidingdepot.lovable.app/";
const ENCODED_GSC_SITE_URL = encodeURIComponent(GSC_SITE_URL);

const unknownIndexingStatus = (url: string, message: string) => ({
  url,
  indexingState: "UNKNOWN" as const,
  lastCrawlTime: null,
  coverageState: null,
  crawlState: null,
  robotsTxtState: null,
  timestamp: new Date().toISOString(),
  verdict: "NEUTRAL" as const,
  error: message,
});

const parseJsonResponse = async (response: Response) => {
  const text = await response.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const normalizeIndexingStatus = (url: string, result: any) => {
  const indexStatus = result?.inspectionResult?.indexStatusResult ?? result ?? {};

  return {
    url,
    indexingState: indexStatus.indexingState || "UNKNOWN",
    lastCrawlTime: indexStatus.lastCrawlTime ?? null,
    coverageState: indexStatus.coverageState ?? null,
    crawlState: indexStatus.pageFetchState ?? indexStatus.crawlState ?? null,
    robotsTxtState: indexStatus.robotsTxtState ?? null,
    timestamp: new Date().toISOString(),
    verdict: indexStatus.verdict || "NEUTRAL",
    error: null,
  };
};

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

    const response = await fetch(
      `${GATEWAY_URL}/sites/${ENCODED_GSC_SITE_URL}/inspectUrl`,
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
      const error = await parseJsonResponse(response);
      throw new Error(`GSC inspection failed (${response.status}): ${JSON.stringify(error)}`);
    }

    const result = await parseJsonResponse(response);
    
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
    if (!LOVABLE_API_KEY) return unknownIndexingStatus(data.url, "LOVABLE_API_KEY not configured");
    if (!GSC_API_KEY) return unknownIndexingStatus(data.url, "Google Search Console not connected");

    try {
      const response = await fetch(
        `${GATEWAY_URL}/sites/${ENCODED_GSC_SITE_URL}/inspectUrl`,
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
        return unknownIndexingStatus(data.url, `GSC unavailable (${response.status})`);
      }

      const result = await parseJsonResponse(response);
      return normalizeIndexingStatus(data.url, result);
    } catch (e) {
      console.error("[GSC] inspectUrl exception:", e);
      return unknownIndexingStatus(data.url, e instanceof Error ? e.message : "Unknown error");
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

    const response = await fetch(
      `${GATEWAY_URL}/sites/${ENCODED_GSC_SITE_URL}/searchAnalytics/query`,
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
      const error = await parseJsonResponse(response);
      throw new Error(`Failed to fetch GSC analytics: ${JSON.stringify(error)}`);
    }

    const result = await parseJsonResponse(response);
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
    // 1. Fetch data from our ab_events table for "real" conversion metrics
    const { data: events, error } = await supabase
      .from("ab_events")
      .select("event_type, variation, service_key")
      .gte("timestamp", data.startDate)
      .lte("timestamp", data.endDate);

    if (error) {
      console.error("[GA4 Metrics] Supabase error:", error);
      // Fallback to simulation if DB fails, or return zeros
      return { leads: 0, whatsapp: 0, conversionRate: "0.0", error: error.message };
    }

    const views = events.filter(e => e.event_type === 'ab_variation_view').length;
    const leads = events.filter(e => e.event_type === 'qualified_lead' || e.event_type === 'lead_submit').length;
    const whatsapp = events.filter(e => e.event_type === 'whatsapp_click').length;
    const calls = events.filter(e => e.event_type === 'call_click').length;

    const totalConversions = leads + whatsapp + calls;
    const conversionRate = views > 0 ? ((totalConversions / views) * 100).toFixed(1) : "0.0";

    return {
      leads,
      whatsapp,
      calls,
      views,
      conversionRate,
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
