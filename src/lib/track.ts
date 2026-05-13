/**
 * Lightweight analytics helper.
 *
 * Pushes events to window.dataLayer (consumed by Google Tag Manager which is
 * loaded in src/routes/__root.tsx). Safe on SSR — no-ops when window is absent.
 *
 * Every event is automatically enriched with attribution context (UTM params,
 * landing page, referrer) so downstream tools (GA4, GTM, Looker) can attribute
 * conversion lift by city + source without extra wiring at each call site.
 *
 * Usage:
 *   track("quote_cta_click", { source: "before_after_slider", city: "Marietta" });
 */
export type TrackPayload = Record<string, string | number | boolean | undefined>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_keyword",
  "utm_term",
  "utm_content",
] as const;

/**
 * Read UTM params + landing page + referrer from the current document.
 * Safe on SSR (returns {} when window is absent).
 */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  out.landing_page = window.location.pathname;
  if (document.referrer) out.referrer = document.referrer;
  return out;
}

export function track(event: string, payload: TrackPayload = {}): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  const enriched = { event, ...getAttribution(), ...payload };
  w.dataLayer.push(enriched);
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[track]", event, enriched);
  }
}
