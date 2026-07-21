/**
 * useSiteAnalytics — aggregated analytics queries for /admin/analytics.
 * Reads analytics_events from SidingDepot Supabase.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
}

export function useTopPages(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["top-pages", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("page_path, page_title, session_id, scroll_depth, time_on_page")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const map = new Map<
        string,
        { path: string; title: string; views: number; totalScroll: number; totalTime: number }
      >();
      (data || []).forEach((e) => {
        const key = e.page_path;
        if (map.has(key)) {
          const r = map.get(key)!;
          r.views++;
          r.totalScroll += e.scroll_depth || 0;
          r.totalTime += e.time_on_page || 0;
        } else {
          map.set(key, {
            path: key,
            title: e.page_title || key,
            views: 1,
            totalScroll: e.scroll_depth || 0,
            totalTime: e.time_on_page || 0,
          });
        }
      });

      return Array.from(map.values())
        .map((r) => ({
          ...r,
          avgScroll: Math.round(r.totalScroll / r.views),
          avgTime: Math.round(r.totalTime / r.views),
        }))
        .sort((a, b) => b.views - a.views);
    },
    refetchInterval: 60_000,
  });
}

export function useDeviceStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["device-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("device_type")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;
      const m = new Map<string, number>();
      (data || []).forEach((e) => {
        const k = e.device_type || "unknown";
        m.set(k, (m.get(k) || 0) + 1);
      });
      return Array.from(m.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    },
  });
}

export function useBrowserStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["browser-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("browser")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;
      const m = new Map<string, number>();
      (data || []).forEach((e) => {
        const k = e.browser || "Other";
        m.set(k, (m.get(k) || 0) + 1);
      });
      return Array.from(m.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    },
  });
}

export function useOSStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["os-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("os")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;
      const m = new Map<string, number>();
      (data || []).forEach((e) => {
        const k = e.os || "Other";
        m.set(k, (m.get(k) || 0) + 1);
      });
      return Array.from(m.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    },
  });
}

export function useCountryStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["country-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("country")
        .eq("event_type", "pageview")
        .not("country", "is", null)
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;
      const m = new Map<string, number>();
      (data || []).forEach((e) => {
        if (e.country) m.set(e.country, (m.get(e.country) || 0) + 1);
      });
      return Array.from(m.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    },
  });
}

export function useAcquisitionStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["acquisition-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("source_platform, utm_source, utm_medium, utm_campaign, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const sourceMap = new Map<string, number>();
      (data || []).forEach((e) => {
        const src = e.source_platform || "Direct";
        sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
      });
      const sources = Array.from(sourceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const campMap = new Map<
        string,
        { source: string; medium: string; campaign: string; visitors: number }
      >();
      (data || []).forEach((e) => {
        if (!e.utm_campaign) return;
        const key = `${e.utm_source}|${e.utm_medium}|${e.utm_campaign}`;
        if (campMap.has(key)) {
          campMap.get(key)!.visitors++;
        } else {
          campMap.set(key, {
            source: e.utm_source || "",
            medium: e.utm_medium || "",
            campaign: e.utm_campaign,
            visitors: 1,
          });
        }
      });
      const campaigns = Array.from(campMap.values())
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10);

      return { sources, campaigns };
    },
  });
}

export function useChannelStats(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["channel-stats", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("source_platform, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const sessionsByChannel = new Map<string, Set<string>>();
      (data || []).forEach((e) => {
        const ch = e.source_platform || "Direct";
        if (!sessionsByChannel.has(ch)) sessionsByChannel.set(ch, new Set());
        sessionsByChannel.get(ch)!.add(e.session_id);
      });

      return Array.from(sessionsByChannel.entries())
        .map(([name, sessions]) => ({ name, value: sessions.size }))
        .sort((a, b) => b.value - a.value);
    },
    refetchInterval: 60_000,
  });
}

export function useLeadsByChannel(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["leads-by-channel", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("source_platform, gclid, fbclid, created_at")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const m = new Map<string, number>();
      (data || []).forEach((lead) => {
        const ch = lead.source_platform || "Direct";
        m.set(ch, (m.get(ch) || 0) + 1);
      });

      return Array.from(m.entries())
        .map(([name, leads]) => ({ name, leads }))
        .sort((a, b) => b.leads - a.leads);
    },
    refetchInterval: 120_000,
  });
}

export function useFunnelData(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["funnel-data", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const visitors = new Set((sessions || []).map((e) => e.session_id)).size;
      const pageviews = (sessions || []).length;

      const { count: leads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const { count: clientes } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .in("status", ["won", "closed", "client"])
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      return {
        visitors,
        pageviews,
        leads: leads || 0,
        agendamentos: Math.round((leads || 0) * 0.35),
        clientes: clientes || 0,
      };
    },
    refetchInterval: 300_000,
  });
}
