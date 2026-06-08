import { useEffect } from "react";

export function GhlChatWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;

    const loadWidget = () => {
      if (loaded) return;
      loaded = true;

      // Clean up event listeners
      window.removeEventListener("scroll", loadWidget);
      window.removeEventListener("mousemove", loadWidget);
      window.removeEventListener("touchstart", loadWidget);

      // 1. Set global page source helper
      (window as any).hl_chat_widget_page_source = window.location.href;

      // 2. Setup fix position function and loop
      const fixGHLPosition = () => {
        const selectors = [
          "#chat-widget-container",
          '[id^="chat-widget"]',
          ".hl-chat-widget",
          "[data-widget-id]",
          "#leadconnector-chat-widget",
        ];
        selectors.forEach((sel) => {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) {
            el.style.cssText +=
              "position:fixed!important;bottom:20px!important;right:20px!important;top:auto!important;left:auto!important;z-index:9999!important;";
          }
        });
      };

      setTimeout(fixGHLPosition, 2000);
      setTimeout(fixGHLPosition, 5000);
      setTimeout(fixGHLPosition, 10000);

      // 3. Message event listener for Lead Capturing
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

          // Store in our Supabase leads table via webhook
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
          } catch (err) {}
        }
      };

      window.addEventListener("message", handleGhlMessage);

      // 4. Dynamically inject the script tag
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

    // Listen to user interaction events to load the widget
    window.addEventListener("scroll", loadWidget, { passive: true });
    window.addEventListener("mousemove", loadWidget, { passive: true });
    window.addEventListener("touchstart", loadWidget, { passive: true });

    // Fallback load after 6 seconds if no interaction occurs
    const fallbackTimeout = setTimeout(loadWidget, 6000);

    return () => {
      window.removeEventListener("scroll", loadWidget);
      window.removeEventListener("mousemove", loadWidget);
      window.removeEventListener("touchstart", loadWidget);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return null;
}
