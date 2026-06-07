/**
 * useVisitorHistory — last 24h analytics_events with geo data.
 * Powers the Visitor History Map in /admin/analytics.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VisitorHistoryPoint {
  lat: number;
  lon: number;
  country: string;
  city: string;
  region: string;
  page_path: string;
  device_type: string;
  timestamp: string;
  hour: number;
}

export interface HourlyBucket {
  hour: number;
  count: number;
  label: string;
}

export interface VisitorHistoryData {
  historyPoints: VisitorHistoryPoint[];
  hourlyDistribution: HourlyBucket[];
  peakHour: { hour: number; count: number } | null;
  lowestHour: { hour: number; count: number } | null;
  totalVisits: number;
}

export function useVisitorHistory(pageFilter = "all") {
  return useQuery({
    queryKey: ["visitor-history", pageFilter],
    queryFn: async (): Promise<VisitorHistoryData> => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      let q = supabase
        .from("analytics_events")
        .select("lat, lon, country, region, city, page_path, device_type, created_at")
        .gte("created_at", since)
        .not("lat", "is", null)
        .not("lon", "is", null)
        .order("created_at", { ascending: false });

      if (pageFilter !== "all") q = q.eq("page_path", pageFilter);

      const { data, error } = await q;
      if (error) throw error;

      const points: VisitorHistoryPoint[] = (data || []).map((e) => ({
        lat: Number(e.lat),
        lon: Number(e.lon),
        country: e.country || "Unknown",
        city: e.city || "",
        region: e.region || "",
        page_path: e.page_path,
        device_type: e.device_type || "desktop",
        timestamp: e.created_at,
        hour: new Date(e.created_at).getHours(),
      }));

      const hourCounts: Record<number, number> = {};
      for (let h = 0; h < 24; h++) hourCounts[h] = 0;
      points.forEach((p) => hourCounts[p.hour]++);

      const hourlyDistribution: HourlyBucket[] = Object.entries(hourCounts).map(
        ([h, count]) => ({ hour: Number(h), count, label: String(h).padStart(2, "0") + ":00" })
      );

      let peakHour: { hour: number; count: number } | null = null;
      let lowestHour: { hour: number; count: number } | null = null;
      hourlyDistribution.forEach((b) => {
        if (!peakHour || b.count > peakHour.count) peakHour = { hour: b.hour, count: b.count };
        if (!lowestHour || b.count < lowestHour.count) lowestHour = { hour: b.hour, count: b.count };
      });

      return { historyPoints: points, hourlyDistribution, peakHour, lowestHour, totalVisits: points.length };
    },
    refetchInterval: 60_000,
  });
}
