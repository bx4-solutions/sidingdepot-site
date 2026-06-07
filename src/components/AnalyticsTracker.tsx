/**
 * AnalyticsTracker — tracks page views, geolocation, and real-time presence
 * into Supabase analytics_events + Realtime presence channel.
 *
 * This powers the ClickOne dashboard's:
 *   - Online Visitors Map (real-time dots on world map)
 *   - Visitor History Map (last 24h geo activity)
 *   - Peak Hours, Device, Browser, OS, Country charts
 */
import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── Session helpers ─────────────────────────────────────────────────────────

const generateSessionId = (): string => {
  if (typeof sessionStorage === "undefined") return "ssr";
  const stored = sessionStorage.getItem("sd_session_id");
  if (stored) return stored;
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem("sd_session_id", id);
  return id;
};

// ─── Device / Browser / OS detection ─────────────────────────────────────────

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

// ─── Geolocation (ip-api.com — free, no key, 45 req/min) ─────────────────────

interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
}

const GEO_CACHE_KEY = "sd_geo_data";

const fetchGeoData = async (): Promise<GeoData | null> => {
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) return JSON.parse(cached) as GeoData;
  } catch {
    // corrupt cache — continue
  }

  try {
    // ip-api.com: free, HTTPS only on paid plan — http is fine for anonymous geo
    const res = await fetch(
      "https://ipapi.co/json/",
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error("geo api error");
    const d = await res.json();
    if (d.error) throw new Error(d.reason || "geo blocked");

    const geo: GeoData = {
      country: d.country_name || "Unknown",
      countryCode: d.country_code || "XX",
      region: d.region || "",
      city: d.city || "",
      lat: Number(d.latitude) || 0,
      lon: Number(d.longitude) || 0,
    };
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return null;
  }
};

// ─── Supabase analytics insert ────────────────────────────────────────────────

async function trackEvent(
  eventType: string,
  pathname: string,
  sessionId: string,
  geo: GeoData | null,
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
      country: geo?.country ?? null,
      region: geo?.region ?? null,
      city: geo?.city ?? null,
      lat: geo?.lat ?? null,
      lon: geo?.lon ?? null,
      ...extraData,
    });
  } catch {
    // silent — analytics must never break the site
  }
}

// ─── Supabase Realtime Presence ───────────────────────────────────────────────
// Powers the "Online Visitors Map" in the ClickOne dashboard.
// Each visitor joins the "visitor-presence" channel with their current page + geo.

const PRESENCE_CHANNEL = "visitor-presence";

function buildPresencePayload(
  sessionId: string,
  pathname: string,
  geo: GeoData | null
) {
  return {
    session_id: sessionId,
    page_path: pathname,
    page_title: document.title,
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    country: geo?.country || "Unknown",
    countryCode: geo?.countryCode || "XX",
    region: geo?.region || "",
    city: geo?.city || "",
    lat: geo?.lat || 0,
    lon: geo?.lon || 0,
    joined_at: new Date().toISOString(),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AnalyticsTracker() {
  const location = useLocation();
  const sessionId = useRef(generateSessionId());
  const startTimeRef = useRef(Date.now());
  const lastPathRef = useRef("");
  const maxScrollRef = useRef(0);
  const geoRef = useRef<GeoData | null>(null);
  const geoLoadedRef = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);

  // Load geo once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (geoLoadedRef.current) return;
    geoLoadedRef.current = true;

    fetchGeoData().then((geo) => {
      geoRef.current = geo;
    });
  }, []);

  // Track page_view on route change + manage presence channel
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = location.pathname;
    if (path === lastPathRef.current) return;

    // Fire page_exit for the previous page
    if (lastPathRef.current) {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackEvent("page_exit", lastPathRef.current, sessionId.current, geoRef.current, {
        time_on_page: timeOnPage,
        scroll_depth: maxScrollRef.current,
      });
    }

    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    lastPathRef.current = path;

    // Track page_view (geo may still be loading — that's fine)
    trackEvent("pageview", path, sessionId.current, geoRef.current);

    // Update Realtime Presence with new page
    const updatePresence = async () => {
      // Wait for geo if not loaded yet (max 3s)
      if (!geoRef.current && !geoLoadedRef.current) {
        await new Promise((r) => setTimeout(r, 3000));
      }

      if (!channelRef.current) {
        // Create channel
        channelRef.current = supabase.channel(PRESENCE_CHANNEL, {
          config: { presence: { key: sessionId.current } },
        });

        channelRef.current.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            subscribedRef.current = true;
            await channelRef.current?.track(
              buildPresencePayload(sessionId.current, path, geoRef.current)
            );
          }
        });
      } else if (subscribedRef.current) {
        // Already subscribed — just update the tracked data
        await channelRef.current.track(
          buildPresencePayload(sessionId.current, path, geoRef.current)
        );
      }
    };

    updatePresence();
  }, [location.pathname]);

  // Scroll depth tracker
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

  // Fire page_exit and remove presence on tab close
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      // Use sendBeacon for reliability on unload
      const payload = JSON.stringify({
        session_id: sessionId.current,
        event_type: "page_exit",
        page_path: lastPathRef.current,
        time_on_page: timeOnPage,
        scroll_depth: maxScrollRef.current,
      });
      navigator.sendBeacon?.("/api/analytics-exit", payload);

      // Remove presence
      channelRef.current?.untrack();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  // Cleanup presence channel on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscribedRef.current = false;
      }
    };
  }, []);

  return null;
}
