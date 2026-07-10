import { useEffect } from "react";
import { getAttribution, getVisitorId } from "@/lib/track";
import { getDeviceType, getBrowser, getOS } from "@/lib/device-detect";
import { enrichGhlFromWidget } from "@/lib/ghl-lead.functions";

/**
 * GhlChatWidget — lazy-loads the GHL chat widget after user interaction.
 *
 * The script is appended to <body> (not <head>) so GHL's own loader
 * inserts the widget element inside <body> and applies its default
 * bottom-right positioning correctly.
 *
 * Loading is deferred until first user interaction + 3s, then
 * falls back to 12s — so the widget never affects LCP/FCP scores.
 */
export function GhlChatWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;
    let interactionTimer: ReturnType<typeof setTimeout> | null = null;

    const injectScript = () => {
      if (loaded) return;
      loaded = true;

      (window as any).hl_chat_widget_page_source = window.location.href;

      // Listen for lead capture events from the widget iframe
      const handleGhlMessage = (e: MessageEvent) => {
        const isGHLLead =
          e.data &&
          (e.data.type === "hl-chat-form-submitted" ||
            e.data.type === "form-submitted" ||
            e.data.type === "lead_submitted" ||
            (typeof e.data.type === "string" && e.data.type.includes("submit")));

        if (isGHLLead) {
          const w = window as any;
          if (typeof w.gtag === "function") {
            w.gtag("event", "ghl_chat_lead", {
              event_category: "Lead",
              event_label: window.location.pathname,
              page_source: window.location.href,
            });
          }
          if (w.dataLayer) {
            w.dataLayer.push({
              event: "ghl_chat_lead",
              page_source: window.location.href,
              page_path: window.location.pathname,
            });
          }
          try {
            const payload = e.data.data || e.data.payload || e.data || {};
            const attribution = getAttribution();
            // createServerFn call — the old fetch("/api/ghl-webhook") route was
            // never mounted in this build (always 404). Fire-and-forget.
            enrichGhlFromWidget({
              data: Object.assign({}, payload, {
                page_url: window.location.href,
                source: "ghl-chat-widget",
                utm_source: attribution.utm_source ?? null,
                utm_medium: attribution.utm_medium ?? null,
                utm_campaign: attribution.utm_campaign ?? null,
                utm_content: attribution.utm_content ?? null,
                utm_term: attribution.utm_term ?? null,
                gclid: attribution.gclid ?? null,
                fbclid: attribution.fbclid ?? null,
                landing_page: attribution.landing_page ?? null,
                referrer: attribution.referrer ?? null,
                visitor_id: getVisitorId(),
                device_type: getDeviceType(),
                browser: getBrowser(),
                os: getOS(),
              }),
            }).catch(() => {});
          } catch (_) {}
        }
      };

      window.addEventListener("message", handleGhlMessage);

      // Append to <body> — GHL uses document.currentScript.parentNode to
      // insert the widget element, so body-placement ensures correct positioning.
      const script = document.createElement("script");
      script.src = "https://widgets.leadconnectorhq.com/loader.js";
      script.async = true;
      script.setAttribute(
        "data-resources-url",
        "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
      );
      script.setAttribute("data-widget-id", "6a05e7c2f127bb4126a40721");
      document.body.appendChild(script);
    };

    const scheduleLoad = () => {
      if (loaded || interactionTimer) return;
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("mousemove", scheduleLoad);
      window.removeEventListener("touchstart", scheduleLoad);
      // 3s delay after first interaction — lets Lighthouse record LCP/FCP first
      interactionTimer = setTimeout(injectScript, 3000);
    };

    window.addEventListener("scroll", scheduleLoad, { passive: true });
    window.addEventListener("mousemove", scheduleLoad, { passive: true });
    window.addEventListener("touchstart", scheduleLoad, { passive: true });

    // Fallback: load 12s after mount if user never interacts
    const fallbackTimeout = setTimeout(() => {
      if (!loaded) injectScript();
    }, 12000);

    return () => {
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("mousemove", scheduleLoad);
      window.removeEventListener("touchstart", scheduleLoad);
      if (interactionTimer) clearTimeout(interactionTimer);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return null;
}
