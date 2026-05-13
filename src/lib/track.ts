/**
 * Lightweight analytics helper.
 *
 * Pushes events to window.dataLayer (consumed by Google Tag Manager which is
 * loaded in src/routes/__root.tsx). Safe on SSR — no-ops when window is absent.
 *
 * Attribution: first-touch UTMs are persisted to sessionStorage on first visit
 * so events fired later (e.g. after internal navigation that drops the query
 * string) still carry the original source. If the user arrives without UTM
 * params, attribution falls back to referrer + landing_page only.
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

const STORAGE_KEY = "__lp_attribution_v1";

function safeSession(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
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

  // Read current URL UTMs
  const current: Record<string, string> = {};
  try {
    const sp = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = sp.get(k);
      if (v) current[k] = v;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    const enriched = { event, ...getAttribution(), ...payload };
    w.dataLayer.push(enriched);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[track]", event, enriched);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[track] failed", err);
    }
  }
}

// =====================================================================
// Smoke test / debug helper
// =====================================================================
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
        storage.setItem(
          STORAGE_KEY,
          JSON.stringify({ utm_source: "smoke", utm_medium: "test" }),
        );
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
