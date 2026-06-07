/**
 * AnalyticsTracker — tracks page views and scroll depth into Supabase analytics_events
 * Ported from ClickOne to TanStack Router for SidingDepot
 */
import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const generateSessionId = (): string => {
  if (typeof sessionStorage === "undefined") return "ssr";
  const stored = sessionStorage.getItem("sd_session_id");
  if (stored) return stored;
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem("sd_session_id", id);
  return id;
};

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
};

const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
};

const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iOS/.test(ua)) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
};

const getUTM = () => {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
};

async function trackEvent(
  eventType: string,
  pathname: string,
  sessionId: string,
  extraData: Record<string, unknown> = {}
) {
  const utm = getUTM();
  try {
    await supabase.from("analytics_events").insert({
      session_id: sessionId,
      event_type: eventType,
      page_path: pathname,
      page_title: document.title,
      referrer: document.referrer || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      country: null,
      region: null,
      city: null,
      ...extraData,
    });
  } catch {
    // silent — analytics should never break the site
  }
}

export function AnalyticsTracker() {
  const location = useLocation();
  const sessionId = useRef(generateSessionId());
  const startTimeRef = useRef(Date.now());
  const lastPathRef = useRef("");
  const maxScrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = location.pathname;
    if (path === lastPathRef.current) return;

    if (lastPathRef.current) {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackEvent("page_exit", lastPathRef.current, sessionId.current, {
        time_on_page: timeOnPage,
        scroll_depth: maxScrollRef.current,
      });
    }

    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    lastPathRef.current = path;

    trackEvent("page_view", path, sessionId.current);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const pct = Math.round((window.scrollY / docH) * 100);
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return null;
}
