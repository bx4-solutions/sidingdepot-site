/**
 * Lightweight analytics helper.
 *
 * Pushes events to window.dataLayer (consumed by Google Tag Manager which is
 * loaded in src/routes/__root.tsx). Safe on SSR — no-ops when window is absent.
 *
 * Usage:
 *   track("quote_cta_click", { source: "before_after_slider" });
 */
export type TrackPayload = Record<string, string | number | boolean | undefined>;

export function track(event: string, payload: TrackPayload = {}): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[track]", event, payload);
  }
}
