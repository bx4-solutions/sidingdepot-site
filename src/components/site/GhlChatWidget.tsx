import { useEffect } from "react";

export function GhlChatWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;
    let interactionTimer: ReturnType<typeof setTimeout> | null = null;

    const loadWidget = () => {
      if (loaded || interactionTimer) return;

      // Remove interaction listeners immediately so they don't stack
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("mousemove", scheduleLoad);
      window.removeEventListener("touchstart", scheduleLoad);
    };

    const scheduleLoad = () => {
      if (loaded || interactionTimer) return;
      // Delay 3s after first interaction — lets Lighthouse record FCP/LCP first
      interactionTimer = setTimeout(() => {
        if (loaded) return;
        loaded = true;

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
      }, 3000); // 3-second delay after first interaction
    };

    // Listen to user interaction events to load the widget
    window.addEventListener("scroll", scheduleLoad, { passive: true });
    window.addEventListener("mousemove", scheduleLoad, { passive: true });
    window.addEventListener("touchstart", scheduleLoad, { passive: true });

    // Fallback load after 12 seconds if no interaction occurs
    const fallbackTimeout = setTimeout(() => {
      if (!loaded) {
        loaded = true;
        // Inject directly without 3s delay in fallback path
        (window as any).hl_chat_widget_page_source = window.location.href;
        const script = document.createElement("script");
        script.src = "https://beta.leadconnectorhq.com/loader.js";
        script.async = true;
        script.setAttribute(
          "data-resources-url",
          "https://beta.leadconnectorhq.com/chat-widget/loader.js"
        );
        script.setAttribute("data-widget-id", "6a05e7c2f127bb4126a40721");
        document.head.appendChild(script);
      }
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
