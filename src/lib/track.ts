/**
 * GA4 + GTM event tracking with first-touch attribution and Supabase persistence.
 *
 * Pushes events to window.dataLayer (consumed by Google Tag Manager)
 * and persists A/B testing events to Supabase for the internal dashboard.
 */
import { supabase } from "@/integrations/supabase/client";

export type TrackPayload = Record<string, string | number | boolean | undefined>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_keyword",
  "utm_term",
  "utm_content",
] as const;

// Click IDs — NOT stored in first-touch persistence (they belong to current click only)
const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid", "ttclid"] as const;

const STORAGE_KEY = "__lp_attribution_v1";
const VISITOR_ID_KEY = "__lp_visitor_id_v1";

function safeSession(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeLocal(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Get or create a persistent visitor UUID.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const storage = safeLocal();
  if (!storage) return "";

  let id = storage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    try {
      storage.setItem(VISITOR_ID_KEY, id);
    } catch {
      // ignore
    }
  }
  return id;
}

/**
 * Read UTM params + landing page + referrer from the current document.
 * Persists first-touch UTMs in sessionStorage so later events keep attribution
 * even when the user navigates to URLs without query params.
 * Safe on SSR (returns {} when window is absent).
 */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const out: Record<string, string> = {};
  const storage = safeSession();

  // Load any previously stored first-touch attribution
  let stored: Record<string, string> = {};
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Record<string, string>;
    } catch {
      stored = {};
    }
  }

  // Read current URL UTMs + click IDs
  const current: Record<string, string> = {};
  try {
    const sp = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = sp.get(k);
      if (v) current[k] = v;
    }
    // Click IDs go directly into `out` (not persisted — they are per-click)
    for (const k of CLICK_ID_KEYS) {
      const v = sp.get(k);
      if (v) out[k] = v;
    }
  } catch {
    // ignore malformed URL
  }

  // Persist first-touch: only set storage once
  if (storage && Object.keys(current).length > 0 && !stored.utm_source) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(current));
      stored = current;
    } catch {
      // quota / private mode — ignore
    }
  }

  // Merge: stored first-touch UTMs as base, current URL UTMs override
  for (const k of UTM_KEYS) {
    if (stored[k]) out[k] = stored[k];
    if (current[k]) out[k] = current[k];
  }

  try {
    out.landing_page = window.location.pathname;
  } catch {
    // ignore
  }
  if (typeof document !== "undefined" && document.referrer) {
    out.referrer = document.referrer;
  }
  return out;
}

export function track(event: string, payload: TrackPayload = {}): void {
  try {
    if (typeof window === "undefined") return;

    const attribution = getAttribution();
    const visitorId = getVisitorId();
    const enriched = { event, visitorId, ...attribution, ...payload };

    // 1. DataLayer for GA4/GTM
    const w = window as any;
    w.dataLayer = w.dataLayer || [];

    // Standard GA4 event naming convention
    const ga4Event = {
      event: event,
      visitor_id: visitorId,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...attribution,
      ...payload,
    };

    w.dataLayer.push(ga4Event);

    // 2. Supabase for Dashboard (Clicks, Leads, Conversions)
    const trackedEvents = [
      "cta_click",
      "lead_submit",
      "qualified_lead",
      "whatsapp_click",
      "quote_request",
      "finance_apply",
      "phone_click",
    ];

    if (trackedEvents.includes(event) || event.includes("click") || event.includes("submit")) {
      supabase
        .from("ab_events")
        .insert({
          event_type: event,
          visitor_id: visitorId,
          service_key: String(payload.serviceKey || "unknown"),
          variation: String(payload.variation || "A"),
          city: String(payload.city || ""),
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          landing_page: attribution.landing_page,
          metadata: { ...payload, referrer: attribution.referrer },
        })
        .then(({ error }: { error: any }) => {
          if (error && import.meta.env.DEV) console.error("[track] supabase error", error);
        });
    }

    if (import.meta.env.DEV) {
      console.info("[track]", event, enriched);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[track] failed", err);
    }
  }
}

// =====================================================================
// Meta Pixel Helper
// =====================================================================

/**
 * Fire a Meta Pixel standard or custom event.
 * Safe no-op when Meta Pixel is not loaded (VITE_META_PIXEL_ID not set).
 */
export function trackMeta(event: string, payload?: Record<string, unknown>): void {
  try {
    if (typeof window === "undefined") return;
    const fbq = (window as any).fbq;
    if (typeof fbq !== "function") return;
    if (payload) {
      fbq("track", event, payload);
    } else {
      fbq("track", event);
    }
  } catch {
    // never crash the page
  }
}

// =====================================================================
// Conversion Event Helpers
// =====================================================================

/**
 * Track contact form submission (lead conversion)
 */
export function trackLeadSubmit(data: {
  service?: string;
  city?: string;
  phone?: string;
  source?: string;
}): void {
  track("lead_submit", {
    event_category: "conversion",
    event_label: data.service || "general",
    service: data.service,
    city: data.city,
    source: data.source || "contact_form",
  });
  // Meta Pixel — "Lead" is a standard event recognised by Meta Ads Manager
  trackMeta("Lead", {
    content_name: data.service || "general",
    content_category: "Home Services",
    status: "submitted",
  });
}

/**
 * Track WhatsApp button click
 */
export function trackWhatsAppClick(data: {
  service?: string;
  location?: string;
  source?: string;
}): void {
  track("whatsapp_click", {
    event_category: "engagement",
    event_label: data.service || "general",
    service: data.service,
    location: data.location,
    source: data.source || "whatsapp_btn",
  });
}

/**
 * Track contact page view
 */
export function trackContactPageView(): void {
  track("contact_page_view", {
    event_category: "pageview",
    page_type: "contact",
  });
}

/**
 * Track service page view (siding, windows, painting, etc.)
 */
export function trackServiceView(service: string): void {
  track("service_view", {
    event_category: "pageview",
    page_type: "service",
    service,
  });
}

/**
 * Track quote/estimate request
 */
export function trackQuoteRequest(data: {
  service?: string;
  city?: string;
  source?: string;
}): void {
  track("quote_request", {
    event_category: "conversion",
    event_label: data.service || "general",
    service: data.service,
    city: data.city,
    source: data.source || "quote_btn",
  });
}

// =====================================================================
// A/B Testing — variation-aware lead & engagement helpers
// =====================================================================

type AbCtx = { serviceKey?: string; variation?: string };

/** Fired once per page-view when a variation is rendered. */
export function trackVariationView(ctx: AbCtx & { city?: string }): void {
  track("ab_variation_view", {
    event_category: "experiment",
    event_label: `${ctx.serviceKey}_${ctx.variation}`,
    ...ctx,
  });
}

/** Qualified lead — form submission tagged with variation. */
export function trackQualifiedLead(ctx: AbCtx & { city?: string; source?: string }): void {
  track("qualified_lead", {
    event_category: "conversion",
    event_label: `${ctx.serviceKey}_${ctx.variation}`,
    source: ctx.source ?? "lead_form",
    ...ctx,
  });
}

/** Primary CTA click (Get a free quote, etc.) tagged with variation. */
export function trackCtaClick(ctx: AbCtx & { cta: string; city?: string }): void {
  track("cta_click", {
    event_category: "engagement",
    event_label: `${ctx.serviceKey}_${ctx.variation}_${ctx.cta}`,
    ...ctx,
  });
}

/**
 * Phone tap is intent only. A browser cannot confirm that a call connected,
 * so it must never be sent to Meta or the dashboard as a conversion.
 */
export function trackPhoneClick(ctx: AbCtx & { city?: string; source?: string }): void {
  track("phone_click", {
    event_category: "engagement",
    event_label: `${ctx.serviceKey}_${ctx.variation}`,
    source: ctx.source ?? "phone_cta",
    ...ctx,
  });
}

/** @deprecated Use trackPhoneClick. Kept for existing service pages. */
export const trackCallClick = trackPhoneClick;

/** Track Finance application click. */
export function trackFinanceApply(): void {
  track("finance_apply", {
    event_category: "conversion",
    event_label: "finance_page",
    serviceKey: "finance",
    variation: "A",
    source: "finance_apply_btn",
  });
  trackMeta("InitiateCheckout", { content_name: "GreenSky Financing" });
}

/** Track Finance qualification (next step in the flow). */
export function trackFinanceQualified(): void {
  track("finance_qualified", {
    event_category: "conversion",
    event_label: "finance_qualification",
    serviceKey: "finance",
    variation: "A",
    source: "finance_flow_complete",
  });
}

// Run from the browser console:   __trackSmokeTest()
// Or in dev, results are auto-logged once on first import in the browser.

export type SmokeResult = { name: string; pass: boolean; detail?: string };

export function runTrackSmokeTest(): SmokeResult[] {
  const results: SmokeResult[] = [];

  // 1. SSR safety — getAttribution should not throw if window is undefined.
  try {
    const w = (globalThis as { window?: unknown }).window;
    try {
      // Temporarily hide window to simulate SSR
      delete (globalThis as { window?: unknown }).window;
      const r = getAttribution();
      results.push({
        name: "getAttribution() safe in SSR",
        pass: r && Object.keys(r).length === 0,
        detail: JSON.stringify(r),
      });
    } finally {
      (globalThis as { window?: unknown }).window = w;
    }
  } catch (e) {
    results.push({
      name: "getAttribution() safe in SSR",
      pass: false,
      detail: String(e),
    });
  }

  // 2. track() must not throw in SSR
  try {
    const w = (globalThis as { window?: unknown }).window;
    try {
      delete (globalThis as { window?: unknown }).window;
      track("smoke_ssr", { city: "Marietta" });
      results.push({ name: "track() no-op in SSR", pass: true });
    } finally {
      (globalThis as { window?: unknown }).window = w;
    }
  } catch (e) {
    results.push({
      name: "track() no-op in SSR",
      pass: false,
      detail: String(e),
    });
  }

  // 3. Browser path: attribution returns landing_page even without UTMs
  if (typeof window !== "undefined") {
    const r = getAttribution();
    results.push({
      name: "attribution has landing_page without UTMs",
      pass: typeof r.landing_page === "string" && r.landing_page.length > 0,
      detail: JSON.stringify(r),
    });

    // 4. First-touch persistence: even if no UTMs in URL right now,
    // any previously stored UTMs should still come back.
    const storage = safeSession();
    if (storage) {
      const backup = storage.getItem(STORAGE_KEY);
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ utm_source: "smoke", utm_medium: "test" }));
        const r2 = getAttribution();
        results.push({
          name: "first-touch UTM persists across pages",
          pass: r2.utm_source === "smoke" && r2.utm_medium === "test",
          detail: JSON.stringify(r2),
        });
      } finally {
        if (backup === null) storage.removeItem(STORAGE_KEY);
        else storage.setItem(STORAGE_KEY, backup);
      }
    }
  }

  return results;
}

if (typeof window !== "undefined") {
  // Expose for manual debugging in the console.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__trackSmokeTest = () => {
    const r = runTrackSmokeTest();
    // eslint-disable-next-line no-console
    console.table(r);
    return r;
  };
  if (import.meta.env.DEV) {
    // Auto-run once in dev so regressions surface immediately.
    queueMicrotask(() => {
      const r = runTrackSmokeTest();
      const failed = r.filter((x) => !x.pass);
      if (failed.length) {
        // eslint-disable-next-line no-console
        console.error("[track] smoke test failures", failed);
      } else {
        // eslint-disable-next-line no-console
        console.info("[track] smoke test passed", r);
      }
    });
  }
}
