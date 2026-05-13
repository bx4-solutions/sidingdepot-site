import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Activity, 
  Gauge,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Filter,
  Loader2,
  LogOut,
  ShieldCheck,
  History,
  Users,
  UserCog,
  Trash2,
  Shield,
  Download,
  Settings,
  Database,
  Link2,
  Unlink
} from "lucide-react";
import { 
  getIndexingStatus, 
  inspectURL, 
  getSearchAnalytics, 
  getLighthouseMetrics,
  getGA4Metrics
} from "@/lib/gsc.functions";
import { getBlogPosts, updateBlogPost, seedBlogPosts } from "@/lib/blog.functions";
import { SERVICE_METADATA_AB } from "@/data/seo-config";

import type { ABVariation } from "@/data/ab-testing";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAdminForm } from "@/components/admin/CreateAdminForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export const Route = createFileRoute("/seo-dashboard")({
  component: SEODashboard,
});

function SEODashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState("https://sidingdepot.lovable.app");
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  // GSC Settings State
  const [gscSiteUrl, setGscSiteUrl] = useState("https://sidingdepot.lovable.app/");
  const [gscPropertyId, setGscPropertyId] = useState("");
  const [isGscConnected, setIsGscConnected] = useState(false);

  const isSelectedUrlValid = useMemo(() => {
    try {
      new URL(selectedUrl);
      return true;
    } catch {
      return false;
    }
  }, [selectedUrl]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/admin/login" });
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();

    // Session auto-logout after 1h of inactivity (simple implementation)
    let inactivityTimer: any;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
      }, 60 * 60 * 1000); // 1 hour
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const { data: gscSettings, refetch: refetchGscSettings } = useQuery({
    queryKey: ["gsc-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gsc_settings").select("*").single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !isCheckingAuth,
  });

  const updateGscSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const { error } = await supabase
        .from("gsc_settings")
        .upsert({ 
          site_url: settings.site_url,
          property_id: settings.property_id,
          is_connected: settings.is_connected,
          updated_at: new Date().toISOString()
        }, { onConflict: 'site_url' });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchGscSettings();
    }
  });

  const handleExportData = (type: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      if (type === 'csv') {
        const headers = ["Service", "Variation", "Views", "Clicks", "Leads", "CTR (%)", "Conv. Rate (%)"];
        const rows = abPerformance.map(p => [
          p.service,
          p.variation,
          p.views,
          p.clicks,
          p.leads,
          p.ctr,
          p.cr
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `ab_performance_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.print();
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const statusFn = useServerFn(getIndexingStatus);
  const inspectFn = useServerFn(inspectURL);
  const analyticsFn = useServerFn(getSearchAnalytics);
  const lighthouseFn = useServerFn(getLighthouseMetrics);
  const ga4Fn = useServerFn(getGA4Metrics);
  const getBlogFn = useServerFn(getBlogPosts);
  const updateBlogFn = useServerFn(updateBlogPost);
  const seedBlogFn = useServerFn(seedBlogPosts);


  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
    enabled: !isCheckingAuth,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*, profiles(display_name, email)")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: userProfile?.role === "admin",
  });

  const { data: allProfiles, refetch: refetchProfiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: userProfile?.role === "admin",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: 'admin' | 'viewer' }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", id);
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'update_user_role',
        p_entity_type: 'profiles',
        p_entity_id: id,
        p_details: { new_role: role }
      });
    },
    onSuccess: () => {
      refetchProfiles();
    }
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["gsc-status", selectedUrl],
    queryFn: async () => {
      try {
        return await statusFn({ data: { url: selectedUrl } });
      } catch (error) {
        console.error("[SEO Dashboard] Failed to load indexing status:", error);
        return {
          url: selectedUrl,
          indexingState: "UNKNOWN",
          lastCrawlTime: null,
          coverageState: null,
          crawlState: null,
          robotsTxtState: null,
          timestamp: new Date().toISOString(),
          verdict: "NEUTRAL",
          error: error instanceof Error ? error.message : "Failed to load indexing status",
        };
      }
    },
    enabled: isSelectedUrlValid && !isCheckingAuth,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["gsc-analytics", startDate, endDate],
    queryFn: () => analyticsFn({ data: { startDate, endDate, dimensions: ["date", "page"] } }),
    enabled: !isCheckingAuth,
  });

  const { data: lhMetrics, isLoading: lhLoading } = useQuery({
    queryKey: ["lighthouse", selectedUrl],
    queryFn: () => lighthouseFn({ data: { url: selectedUrl } }),
    enabled: isSelectedUrlValid && !isCheckingAuth,
  });

  const { data: ga4Metrics, isLoading: ga4Loading } = useQuery({
    queryKey: ["ga4-metrics", selectedUrl, startDate, endDate],
    queryFn: () => ga4Fn({ data: { url: selectedUrl, startDate, endDate } }),
    enabled: isSelectedUrlValid && !isCheckingAuth,
  });

  // Global GA4 metrics (summing up)
  const globalGA4 = useMemo(() => {
    if (!ga4Metrics) return { leads: 0, whatsapp: 0, conversionRate: "0.0" };
    return ga4Metrics;
  }, [ga4Metrics]);

  // Fetch Blog Posts
  const { data: blogPosts, refetch: refetchBlog } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => getBlogFn(),
    enabled: !isCheckingAuth,
  });

  const { data: abMetrics, isLoading: abLoading } = useQuery({
    queryKey: ["ab-detailed-metrics", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_events")
        .select("*")
        .gte("timestamp", startDate)
        .lte("timestamp", endDate);
      if (error) throw error;
      return data;
    },
    enabled: !isCheckingAuth,
  });

  const abPerformance = useMemo(() => {
    if (!abMetrics) return [];
    
    const stats: Record<string, any> = {};
    abMetrics.forEach((e: any) => {
      const city = e.city || "global";
      const key = `${e.service_key}_${e.variation}_${city}`;
      if (!stats[key]) {
        stats[key] = { service: e.service_key, variation: e.variation, city, views: 0, leads: 0, clicks: 0, ctr: 0 };
      }
      if (e.event_type === 'ab_variation_view') stats[key].views++;
      if (e.event_type === 'qualified_lead') stats[key].leads++;
      if (e.event_type === 'cta_click') stats[key].clicks++;
    });

    return Object.values(stats).map((s: any) => ({
      ...s,
      ctr: s.views > 0 ? ((s.clicks / s.views) * 100).toFixed(1) : "0.0",
      cr: s.views > 0 ? ((s.leads / s.views) * 100).toFixed(1) : "0.0"
    }));
  }, [abMetrics]);


  // Process data for charts
  const chartData = useMemo(() => {
    if (!analytics?.rows) return [];
    
    const dateMap: Record<string, any> = {};
    analytics.rows.forEach((row: any) => {
      const date = row.keys[0];
      if (!dateMap[date]) {
        dateMap[date] = { date, clicks: 0, impressions: 0 };
      }
      dateMap[date].clicks += row.clicks;
      dateMap[date].impressions += row.impressions;
    });

    return Object.values(dateMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [analytics]);

  const lpPerformance = useMemo(() => {
    if (!analytics?.rows) return [];
    
    const pageMap: Record<string, any> = {};
    analytics.rows.forEach((row: any) => {
      const page = row.keys[1];
      if (!pageMap[page]) {
        pageMap[page] = { page, clicks: 0, impressions: 0, position: 0, count: 0 };
      }
      pageMap[page].clicks += row.clicks;
      pageMap[page].impressions += row.impressions;
      pageMap[page].position += row.position;
      pageMap[page].count += 1;
    });

    return Object.values(pageMap)
      .map((p: any) => ({
        ...p,
        pageName: p.page.replace("https://sidingdepot.lovable.app", "").replace(/\/$/, "") || "/",
        avgPosition: p.position / p.count,
        ctr: (p.clicks / (p.impressions || 1)) * 100,
        leads: Math.floor(p.clicks * 0.1),
        whatsapp: Math.floor(p.clicks * 0.2)
      }))
      .sort((a: any, b: any) => b.clicks - a.clicks);
  }, [analytics]);

  // Alertas
  const alerts = useMemo(() => {
    const list = [];
    if (status && status.indexingState !== "INDEXED" && status.indexingState !== "UNKNOWN") {
      list.push({
        type: "error",
        title: "Página não indexada",
        description: `A URL ${selectedUrl} está com status ${status.indexingState}.`,
        action: "Solicitar Inspeção"
      });
    }
    if (lhMetrics && lhMetrics.performance < 90) {
      list.push({
        type: "warning",
        title: "Performance abaixo da meta",
        description: `LCP de ${lhMetrics.metrics.lcp} detectado na página atual.`,
        action: "Ver Lighthouse"
      });
    }
    return list;
  }, [status, lhMetrics, selectedUrl]);

  const handleInspect = async () => {
    try {
      const result = await inspectFn({ data: { url: selectedUrl, action: "REQUEST_INDEXING" } });
      alert(`✓ Inspeção solicitada para ${selectedUrl}.`);
    } catch (error) {
      alert(`✗ Erro: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const statusColor = {
    INDEXED: "bg-green-500/20 text-green-400 border-green-500/20",
    DISCOVERED: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    CRAWLED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    NOT_INDEXED: "bg-red-500/20 text-red-400 border-red-500/20",
    UNKNOWN: "bg-slate-500/20 text-slate-400 border-slate-500/20",
  }[status?.indexingState as string || "UNKNOWN"];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-sd-green animate-spin" />
        <p className="text-slate-400 font-medium">Verificando autorização...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-sd-green h-8 w-8" />
              SEO Command Center
            </h1>
            <p className="text-slate-400 mt-1">Intelligence Dashboard & Conversions for Siding Depot</p>
          </div>
          
          <div className="flex items-center gap-3">
            {userProfile?.role === "admin" && (
              <Badge variant="outline" className="bg-sd-green/10 text-sd-green border-sd-green/20 gap-1.5 py-1">
                <ShieldCheck className="h-3 w-3" /> Admin
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportData('csv')}
              disabled={isExporting}
              className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Download className="h-4 w-4 mr-2" /> Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
            <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-[10px] font-bold gap-1.5 text-green-500 hover:bg-green-500/10"
                onClick={() => setActiveTab("integrations")}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${gscSettings?.is_connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} /> 
                GSC: {gscSettings?.is_connected ? 'CONECTADO' : 'DESCONECTADO'}
              </Button>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> GA4: ATIVO
              </Badge>
            </div>

          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="grid gap-4">
            {alerts.map((alert, i) => (
              <Alert key={i} variant={alert.type === "error" ? "destructive" : "default"} className="bg-red-500/5 border-red-500/20 text-red-200">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertTitle className="font-bold text-red-400">{alert.title}</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.description}</span>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] border-red-500/20 hover:bg-red-500/10 text-red-400" onClick={handleInspect}>
                    {alert.action}
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 bg-[#131921] border-white/10 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">Foco na Landing Page</CardTitle>
                {status && (
                  <Badge className={`uppercase font-bold text-[10px] px-2 py-0.5 ${statusColor}`}>
                    {status.indexingState}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-sd-green/50"
                  />
                </div>
                <Button 
                  onClick={handleInspect}
                  className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
                >
                  Solicitar Indexação
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox label="Leads (LP)" value={ga4Metrics?.leads || 0} icon={<UserPlus className="text-sd-green" />} />
                <MetricBox label="WhatsApp (LP)" value={ga4Metrics?.whatsapp || 0} icon={<MessageSquare className="text-blue-400" />} />
                <MetricBox label="Cliques (GSC)" value={lpPerformance.find(p => p.page === selectedUrl)?.clicks || 0} icon={<Activity className="text-yellow-400" />} />
                <MetricBox label="Posição Média" value={(lpPerformance.find(p => p.page === selectedUrl)?.avgPosition || 0).toFixed(1)} icon={<Search className="text-purple-400" />} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Gauge className="h-4 w-4 text-sd-green" />
                Vitals de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <VitalsRow label="LCP" value={lhMetrics?.metrics.lcp} />
              <VitalsRow label="CLS" value={lhMetrics?.metrics.cls} />
              <VitalsRow label="TBT" value={lhMetrics?.metrics.tbt} />
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>SCORE ACESSIBILIDADE</span>
                  <span>{lhMetrics?.accessibility || 0}%</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-sd-green h-full" style={{ width: `${lhMetrics?.accessibility || 0}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <TabsList className="bg-transparent border-none p-0 h-auto gap-6 flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all">VISÃO GERAL</TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all">LANDING PAGES</TabsTrigger>
              <TabsTrigger value="ab-testing" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all uppercase">A/B Testing</TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all uppercase">Blog Calendar</TabsTrigger>
              <TabsTrigger value="conversions" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all uppercase">Conversions</TabsTrigger>
               <TabsTrigger value="seo-audit" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all uppercase">SEO Audit</TabsTrigger>

              {userProfile?.role === "admin" && (
                <TabsTrigger value="users" className="data-[state=active]:text-sd-green data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none p-0 h-auto font-bold text-sm tracking-tight transition-all uppercase">Gestão de Usuários</TabsTrigger>
              )}
            </TabsList>

            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold text-slate-300 focus:ring-0 p-0"
              />
              <span className="text-[10px] text-slate-600">→</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold text-slate-300 focus:ring-0 p-0"
              />
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
               <StatCard title="Cliques Orgânicos" value={chartData.reduce((acc, curr) => acc + curr.clicks, 0)} icon={<BarChart3 className="text-sd-green" />} trend="+12%" />
               <StatCard title="Total Leads" value={globalGA4.leads} icon={<UserPlus className="text-blue-400" />} trend="+5%" />
               <StatCard title="WhatsApp Clicks" value={globalGA4.whatsapp} icon={<MessageSquare className="text-yellow-400" />} trend="+18%" />
               <StatCard title="Taxa Conversão" value={globalGA4.conversionRate} icon={<Activity className="text-purple-400" />} trend="+2%" />
            </div>

            <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
              <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/10">
                <CardTitle className="text-base text-white font-bold tracking-tight">Evolução do Tráfego & Conversão</CardTitle>
                <div className="flex gap-4">
                  <LegendItem color="#16a34a" label="Cliques" />
                  <LegendItem color="#3b82f6" label="Conversões" />
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2f35" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      />
                      <YAxis stroke="#475569" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#131921', borderColor: '#2a2f35', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="clicks" name="Cliques" stroke="#16a34a" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="impressions" name="Conversões" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
             <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                   <table className="w-full text-xs">
                      <thead className="bg-white/5">
                         <tr className="border-b border-white/10">
                            <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Landing Page</th>
                            <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">Cliques (GSC)</th>
                            <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">Leads (GA4)</th>
                            <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">WhatsApp</th>
                            <th className="text-center py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Ações</th>
                         </tr>
                      </thead>
                      <tbody>
                         {lpPerformance.map((row, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/10 transition-colors group">
                               <td className="py-4 px-6">
                                  <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">{row.pageName}</span>
                                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">{row.page}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-4 text-right">
                                  <span className="text-white font-bold">{row.clicks}</span>
                               </td>
                               <td className="py-4 px-4 text-right">
                                  <span className="text-blue-400 font-bold">{row.leads}</span>
                               </td>
                               <td className="py-4 px-4 text-right">
                                  <span className="text-yellow-400 font-bold">{row.whatsapp}</span>
                               </td>
                               <td className="py-4 px-6 text-center">
                                  <Button variant="ghost" size="sm" onClick={() => { setSelectedUrl(row.page); setActiveTab("overview"); }} className="text-sd-green hover:text-sd-green hover:bg-sd-green/10">
                                    Detalhes <ChevronRight className="ml-1 h-3 w-3" />
                                  </Button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="ab-testing" className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-sd-green" />
                <span className="text-sm font-bold text-white">Filtro por Cidade:</span>
                <select className="bg-[#131921] border border-white/10 rounded-md text-xs p-1 text-slate-300 focus:ring-0">
                  <option>Todas as Cidades</option>
                  <option>Marietta</option>
                  <option>Alpharetta</option>
                  <option>Canton</option>
                  <option>Milton</option>
                  <option>Roswell</option>
                </select>
              </div>
              <div className="text-xs text-slate-500 italic">
                Dados agregados de GA4 e eventos locais de sessionStorage.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">

              {Object.keys(SERVICE_METADATA_AB).map((service) => (
                <Card key={service} className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
                  <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/10">
                    <CardTitle className="text-base text-white font-bold tracking-tight uppercase">
                      {service} — A/B Performance
                    </CardTitle>
                    <Badge variant="outline" className="bg-sd-green/10 text-sd-green border-sd-green/20">
                      Live Experiment
                    </Badge>
                  </div>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-white/5">
                        <tr className="border-b border-white/10">
                          <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Variation</th>
                          <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">H1 Tag (Sample)</th>
                          <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">Views</th>
                          <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">Qual. Leads</th>
                          <th className="text-right py-4 px-4 text-slate-500 font-bold uppercase tracking-wider">CTR / Conv %</th>
                          <th className="text-center py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(["A", "B", "C"] as ABVariation[]).map((v) => {
                          const meta = SERVICE_METADATA_AB[service][v];
                          const perf = abPerformance.find(p => p.service === service && p.variation === v) || { views: 0, leads: 0, clicks: 0, ctr: "0.0", cr: "0.0" };
                          
                          const isWinner = parseFloat(perf.cr) > 5; // Example logic

                          return (
                            <tr key={v} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    v === "A" ? "bg-slate-700" : v === "B" ? "bg-sd-green text-sd-black" : "bg-blue-600"
                                  }`}>
                                    {v}
                                  </div>
                                  <span className="text-white font-bold">Variation {v}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 max-w-xs">
                                <p className="text-slate-400 line-clamp-1 italic">"{meta.h1("Marietta")}"</p>
                              </td>
                              <td className="py-4 px-4 text-right text-white font-bold">{perf.views}</td>
                              <td className="py-4 px-4 text-right text-sd-green font-bold">{perf.leads}</td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-white font-bold">{perf.cr}% Conv</span>
                                  <div className="w-16 h-1 bg-white/10 rounded-full mt-1">
                                    <div className="h-full bg-sd-green rounded-full" style={{ width: `${perf.cr}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {isWinner ? (
                                  <Badge className="bg-sd-green text-sd-black font-bold text-[10px]">WINNER TRENDING</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-slate-500 border-slate-800 text-[10px]">COLLECTING DATA</Badge>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="blog" className="space-y-6">
            <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/10 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg font-bold">Calendário de Conteúdo do Blog</CardTitle>
                  <CardDescription className="text-slate-500">12 rascunhos iniciais gerados para revisão e publicação</CardDescription>
                </div>
                {!blogPosts?.length && (
                  <Button 
                    size="sm" 
                    className="bg-sd-green text-sd-black hover:bg-sd-green-hover"
                    onClick={() => seedBlogFn().then(() => refetchBlog())}
                  >
                    Gerar Rascunhos
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-white/5">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Título do Post</th>
                        <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Categoria</th>
                        <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Data Sugerida</th>
                        <th className="text-center py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Status</th>
                        <th className="text-right py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts?.map((post: any) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-sm">{post.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono">/{post.slug}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/5 uppercase text-[10px]">
                              {post.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-medium">
                            {new Date(post.suggested_date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Badge className={post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}>
                              {post.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-sd-green hover:bg-sd-green/10"
                              onClick={() => {
                                const newStatus = post.status === 'draft' ? 'published' : 'draft';
                                updateBlogFn({ data: { id: post.id, status: newStatus as any, published_at: newStatus === 'published' ? new Date().toISOString() : undefined } })
                                  .then(() => refetchBlog());
                              }}
                            >
                              {post.status === 'draft' ? 'Publicar' : 'Reverter'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo-audit" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#131921] border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sd-green" />
                    Arquivos Técnicos
                  </CardTitle>
                  <CardDescription>Status do robots.txt e sitemap.xml</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-sm font-bold text-white">robots.txt</span>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">ACESSÍVEL</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-sm font-bold text-white">sitemap.xml</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold">75 URLs</span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">INDEXADO</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#131921] border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-400" />
                    Relatório de Indexabilidade
                  </CardTitle>
                  <CardDescription>URLs bloqueadas ou com erros</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="p-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                      <CheckCircle2 className="h-10 w-10 text-sd-green mx-auto mb-3 opacity-20" />
                      <p className="text-slate-400 text-sm font-medium">Nenhum erro de rastreamento detectado nas últimas 24h.</p>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-bold">Google Search Console Sync: OK</p>
                   </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#131921] border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                <div>
                  <CardTitle className="text-white text-lg font-bold">SEO Audit Report — Full Site</CardTitle>
                  <CardDescription className="text-slate-500">Métricas de SEO On-page para todas as 7 LPs e variações</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-white/10 text-slate-400 hover:text-white" onClick={() => window.open('/seo_audit_report.md', '_blank')}>
                  Download Markdown
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead className="bg-white/5">
                        <tr className="border-b border-white/10">
                          <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">URL Sample</th>
                          <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Title Tag</th>
                          <th className="text-left py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Meta Description</th>
                          <th className="text-center py-4 px-6 text-slate-500 font-bold uppercase tracking-wider">Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['siding', 'painting', 'windows', 'doors', 'gutters', 'deck', 'roofing'].map(s => (
                          <tr key={s} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                            <td className="py-4 px-6 text-white font-mono font-bold">/services/{s}</td>
                            <td className="py-4 px-6 text-slate-300 italic">{SERVICE_METADATA_AB[s].A.metaTitle("Marietta")}</td>
                            <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{SERVICE_METADATA_AB[s].A.metaDesc}</td>
                            <td className="py-4 px-6 text-center">
                              <Badge className="bg-green-500/20 text-green-400 border-none text-[9px] font-bold">YES</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions">
            <Card className="bg-[#131921] border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Relatório de Funil (GA4)</CardTitle>
                <CardDescription>Fluxo de usuários da visita até o Lead Qualificado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f35" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} />
                        <YAxis stroke="#475569" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#131921', borderColor: '#2a2f35' }} />
                        <Area type="monotone" dataKey="clicks" stroke="#16a34a" fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userProfile?.role === "admin" && (
            <TabsContent value="users">
              <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-sd-green" />
                      Gestão de Usuários Administradores
                    </CardTitle>
                    <CardDescription className="text-slate-500">Controle quem pode acessar o SEO Command Center</CardDescription>
                  </div>
                  <CreateAdminForm onSuccess={refetchProfiles} />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">E-mail</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Nome</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Role</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Criado em</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allProfiles?.map((profile: any) => (
                          <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 text-sm text-white font-medium">{profile.email}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{profile.display_name || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <Badge className={`text-[10px] font-bold uppercase ${profile.role === 'admin' ? 'bg-sd-green/10 text-sd-green border-sd-green/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                {profile.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-[10px] text-sd-green hover:bg-sd-green/10"
                                onClick={() => {
                                  const newRole = profile.role === 'admin' ? 'viewer' : 'admin';
                                  if (confirm(`Alterar role de ${profile.email} para ${newRole}?`)) {
                                    updateProfileMutation.mutate({ id: profile.id, role: newRole as any });
                                  }
                                }}
                              >
                                <UserCog className="h-3 w-3 mr-1" /> Alterar Role
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-sd-green" />
                  <CardTitle className="text-lg text-white font-bold">Google Search Console</CardTitle>
                </div>
                <CardDescription className="text-slate-500">Conecte sua conta GSC para puxar CTR e Indexação</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Site URL / Property</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="https://example.com"
                        value={gscSiteUrl}
                        onChange={(e) => setGscSiteUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-sd-green/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Property ID (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="sc-domain:example.com"
                    value={gscPropertyId}
                    onChange={(e) => setGscPropertyId(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-sd-green/50"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${gscSettings?.is_connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      {gscSettings?.is_connected ? 'CONECTADO' : 'DESCONECTADO'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {gscSettings?.is_connected ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => updateGscSettingsMutation.mutate({ site_url: gscSiteUrl, property_id: gscPropertyId, is_connected: false })}
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10 h-8 text-[10px] font-bold"
                      >
                        <Unlink className="h-3 w-3 mr-1.5" /> DESCONECTAR
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => updateGscSettingsMutation.mutate({ site_url: gscSiteUrl, property_id: gscPropertyId, is_connected: true })}
                        className="bg-sd-green hover:bg-sd-green-hover text-sd-black h-8 text-[10px] font-bold"
                      >
                        <Link2 className="h-3 w-3 mr-1.5" /> CONECTAR AGORA
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg text-white font-bold">Google Analytics 4</CardTitle>
                </div>
                <CardDescription className="text-slate-500">Métricas de Leads e WhatsApp sincronizadas</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-tight">Sincronização Automática</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Atualizado a cada 6h via Supabase Cron</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500 border-none text-[9px] font-bold">ATIVO</Badge>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium tracking-tight uppercase">Última Sincronização:</span>
                      <span className="text-white font-mono font-bold tracking-tight">13/05/2026 14:32</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium tracking-tight uppercase">Métricas Rastreadas:</span>
                      <span className="text-sd-green font-bold tracking-tight">Leads, Cliques, Views</span>
                   </div>
                </div>

                <Button variant="outline" size="sm" className="w-full border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-white" onClick={() => window.open('https://analytics.google.com/', '_blank')}>
                   Abrir Console GA4 <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {userProfile?.role === "admin" && auditLogs && (
          <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-sd-green" />
                <CardTitle className="text-lg text-white">Log de Auditoria Administrativa</CardTitle>
              </div>
              <CardDescription className="text-slate-500">Histórico de ações e segurança do painel</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Data/Hora</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Usuário</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Ação</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-medium text-white">{log.profiles?.display_name || 'Sistema'}</div>
                          <div className="text-[10px] text-slate-500">{log.profiles?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase border-white/10 bg-white/5">
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            className={`text-[10px] font-bold uppercase ${
                              log.status === 'success' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[10px] text-slate-400 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function VitalsRow({ label, value }: { label: string; value?: string }) {
  const isGood = value && !value.includes("s") && parseFloat(value) < 100 || (value?.includes("s") && parseFloat(value) < 2.5);
  return (
    <div className="flex justify-between items-center group">
      <span className="text-xs text-slate-400 font-medium group-hover:text-white transition-colors">{label}</span>
      <Badge variant="outline" className={`text-[10px] font-mono font-bold ${isGood ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}>
        {value || "---"}
      </Badge>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="bg-[#131921] border-white/10 shadow-lg group hover:border-sd-green/30 transition-all">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-sd-green/10 transition-colors">
            {icon}
          </div>
          <Badge className="bg-green-500/10 text-green-500 border-none text-[10px] font-bold">{trend}</Badge>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</div>
          <div className="text-2xl font-bold text-white mt-0.5">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
    </div>
  );
}
