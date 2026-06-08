/**
 * useOnlineVisitors — reads Supabase Realtime Presence channel "visitor-presence"
 * to show who is CURRENTLY on the SidingDepot site.
 * Powers the Online Visitors Map in /admin/analytics.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface OnlineVisitor {
  session_id: string;
  page_path: string;
  page_title: string;
  device_type: string;
  browser: string;
  os: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  joined_at: string;
  online_minutes: number;
}

export interface CountryGroup {
  country: string;
  countryCode: string;
  count: number;
}

const CHANNEL_NAME = "visitor-presence";

export const useOnlineVisitors = () => {
  const [visitors, setVisitors] = useState<OnlineVisitor[]>([]);
  const [count, setCount] = useState(0);
  const [byCountry, setByCountry] = useState<CountryGroup[]>([]);

  const calcMinutes = useCallback((joinedAt: string) => {
    return Math.floor((Date.now() - new Date(joinedAt).getTime()) / 60000);
  }, []);

  const processState = useCallback(
    (state: Record<string, unknown[]>) => {
      const all: OnlineVisitor[] = [];
      const countryMap = new Map<string, CountryGroup>();

      Object.values(state).forEach((presences) => {
        presences.forEach((p: unknown) => {
          const data = p as Record<string, unknown>;
          if (!data.session_id) return;
          const v: OnlineVisitor = {
            session_id: data.session_id as string,
            page_path: (data.page_path as string) || "/",
            page_title: (data.page_title as string) || "",
            device_type: (data.device_type as string) || "desktop",
            browser: (data.browser as string) || "",
            os: (data.os as string) || "",
            country: (data.country as string) || "Unknown",
            countryCode: (data.countryCode as string) || "XX",
            region: (data.region as string) || "",
            city: (data.city as string) || "",
            lat: Number(data.lat) || 0,
            lon: Number(data.lon) || 0,
            joined_at: (data.joined_at as string) || new Date().toISOString(),
            online_minutes: calcMinutes((data.joined_at as string) || new Date().toISOString()),
          };
          all.push(v);
          const key = v.countryCode;
          if (countryMap.has(key)) {
            countryMap.get(key)!.count++;
          } else {
            countryMap.set(key, { country: v.country, countryCode: v.countryCode, count: 1 });
          }
        });
      });

      all.sort((a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime());
      const countries = Array.from(countryMap.values()).sort((a, b) => b.count - a.count);
      setVisitors(all);
      setCount(all.length);
      setByCountry(countries);
    },
    [calcMinutes],
  );

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    supabase.getChannels().forEach((ch) => {
      if (ch.topic === `realtime:${CHANNEL_NAME}`) supabase.removeChannel(ch);
    });

    channel = supabase.channel(CHANNEL_NAME);
    channel
      .on("presence", { event: "sync" }, () => {
        processState(channel?.presenceState() || {});
      })
      .on("presence", { event: "join" }, () => {
        processState(channel?.presenceState() || {});
      })
      .on("presence", { event: "leave" }, () => {
        processState(channel?.presenceState() || {});
      })
      .subscribe();

    const timer = setInterval(() => {
      setVisitors((prev) => prev.map((v) => ({ ...v, online_minutes: calcMinutes(v.joined_at) })));
    }, 60000);

    return () => {
      clearInterval(timer);
      if (channel) supabase.removeChannel(channel);
    };
  }, [processState, calcMinutes]);

  return { visitors, count, byCountry };
};
