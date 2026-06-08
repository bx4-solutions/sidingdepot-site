import { useEffect } from "react";

// Selectors GHL uses for its chat widget container
const GHL_SELECTORS = [
  "#chat-widget-container",
  "#leadconnector-chat-widget",
  '[id^="chat-widget"]',
  ".hl-chat-widget",
  "[data-widget-id]",
  "chat-widget",           // web component tag
  "leadconnector-chat",    // alternate web component
];

const FLOATING_STYLES =
  "position:fixed!important;" +
  "bottom:24px!important;" +
  "right:24px!important;" +
  "top:auto!important;" +
  "left:auto!important;" +
  "z-index:2147483647!important;" +
  "transform:none!important;";

// CSS injected into <head> — stylesheet !important beats GHL's inline styles
const GHL_OVERRIDE_CSS = `
#chat-widget-container,
#leadconnector-chat-widget,
[id^="chat-widget"],
.hl-chat-widget,
chat-widget,
leadconnector-chat {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  top: auto !important;
  left: auto !important;
  z-index: 2147483647 !important;
  transform: none !important;
}
`;

function injectOverrideStyles() {
  if (document.getElementById("ghl-position-override")) return;
  const style = document.createElement("style");
  style.id = "ghl-position-override";
  style.textContent = GHL_OVERRIDE_CSS;
  document.head.appendChild(style);
}

function applyFloatingPosition() {
  let applied = false;
  GHL_SELECTORS.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.cssText !== FLOATING_STYLES) {
          htmlEl.style.cssText = FLOATING_STYLES;
          applied = true;
        }
      });
    } catch (_) {}
  });
  return applied;
}

export function GhlChatWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject CSS override immediately — before GHL loads — so the widget
    // lands at bottom-right from the first paint, regardless of what GHL sets
    injectOverrideStyles();

    let loaded = false;
    let interactionTimer: ReturnType<typeof setTimeout> | null = null;
    let mutationObserver: MutationObserver | null = null;

    // ── MutationObserver: watches DOM for any new GHL element added ──────────
    // This is the most reliable way — fires immediately when the widget appears
    const startObserver = () => {
      if (mutationObserver) return;
      mutationObserver = new MutationObserver(() => {
        applyFloatingPosition();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class", "id"],
      });
    };

    const injectScript = () => {
      if (loaded) return;
      loaded = true;

      (window as any).hl_chat_widget_page_source = window.location.href;

      // Start observer before injecting so we catch the widget immediately
      startObserver();

      // Periodic safety net for the first 30s in case observer misses
      const intervals = [1000, 2000, 3000, 5000, 8000, 15000, 30000];
      intervals.forEach((ms) => setTimeout(applyFloatingPosition, ms));

      // Message event listener for Lead Capturing
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
            fetch("/api/ghl-webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                Object.assign({}, payload, {
                  page_url: window.location.href,
                  source: "ghl-chat-widget",
                })
              ),
            }).catch(() => {});
          } catch (_) {}
        }
      };

      window.addEventListener("message", handleGhlMessage);

      // Inject the GHL loader script
      const script = document.createElement("script");
      script.src = "https://beta.leadconnectorhq.com/loader.js";
      script.async = true;
      script.setAttribute(
        "data-resources-url",
        "https://beta.leadconnectorhq.com/chat-widget/loader.js"
      );
      script.setAttribute("data-widget-id", "6a05e7c2f127bb4126a40721");
      document.head.appendChild(script);
    };

    const scheduleLoad = () => {
      if (loaded || interactionTimer) return;
      // Remove listeners so they don't stack
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("mousemove", scheduleLoad);
      window.removeEventListener("touchstart", scheduleLoad);
      // 3s delay after first interaction — lets Lighthouse record FCP/LCP first
      interactionTimer = setTimeout(injectScript, 3000);
    };

    window.addEventListener("scroll", scheduleLoad, { passive: true });
    window.addEventListener("mousemove", scheduleLoad, { passive: true });
    window.addEventListener("touchstart", scheduleLoad, { passive: true });

    // Fallback: load after 12s if user never interacts
    const fallbackTimeout = setTimeout(() => {
      if (!loaded) injectScript();
    }, 12000);

    return () => {
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("mousemove", scheduleLoad);
      window.removeEventListener("touchstart", scheduleLoad);
      if (interactionTimer) clearTimeout(interactionTimer);
      clearTimeout(fallbackTimeout);
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, []);

  return null;
}
