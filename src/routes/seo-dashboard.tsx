import { createFileRoute, redirect, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TRANSLATIONS, type Language } from "@/lib/translations";
import { 
  Gauge, 
  LogOut, 
  Download, 
  Search,
  BarChart3,
  Activity,
  TrendingUp,
  Clock,
  LayoutDashboard,
  Target,
  Split,
  Eye,
  Globe,
  Users,
  Zap,
  Bell,
  FileText,
  Calendar,
  Settings,
  ChevronRight,
  MousePointer2,
  CalendarCheck2,
  MessageSquare,
  AlertTriangle,
  RefreshCcw,
  User,
  Key,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronDown,
  Info,
  Phone,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { getDashboardMetrics } from "@/lib/dashboard.functions";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FALLBACK_METRICS = {
  overview: {
    totalConversions: 0,
    conversionRate: 0,
    appointments: 0,
    chatInteractions: 0,
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    pagesPerVisit: 0,
    bounceRate: 0,
    avgSessionDuration: "0s",
  },
  trafficTrend: [],
  acquisition: []
};

const DATE_RANGE_PRESETS = [
  { label: "7 dias", days: 7, labelKey: "7 dias" },
  { label: "30 dias", days: 30, labelKey: "30 dias" },
  { label: "90 dias", days: 90, labelKey: "90 dias" },
];

const resolveDateRange = (days: number) => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const getInitialDateRange = () => {
  if (typeof window === "undefined") return resolveDateRange(30);
  try {
    const stored = window.localStorage.getItem("seo-dashboard-date-range");
    return stored ? JSON.parse(stored) : resolveDateRange(30);
  } catch {
    return resolveDateRange(30);
  }
};

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "pt";
  const stored = window.localStorage.getItem("seo-dashboard-lang");
  return (stored === "en" || stored === "pt") ? stored : "pt";
};

export const Route = createFileRoute("/seo-dashboard")({
  beforeLoad: async ({ location }) => {
    // Try to get session, but allow some grace for refreshing
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, try one more time or just let the component handle it
    // to avoid flickering redirects during background refreshes
    if (!session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: "/admin/login",
          search: {
            redirect: location.href,
          },
        });
      }
    }
  },
  loader: async () => {
     const { data: { session } } = await supabase.auth.getSession();
     const user = session?.user;
     
     if (!user) return null;
     
     const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
     return { session, profile };
  },
  component: SEODashboard,
});

function SEODashboard() {
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState("dashboard");
  const [sessionExists, setSessionExists] = useState(true);
  const [dateRange, setDateRange] = useState(getInitialDateRange);
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [selectedPageForLeads, setSelectedPageForLeads] = useState<string | null>(null);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<any | null>(null);
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const userProfile = loaderData?.profile;

  const t = (key: string) => {
    const keys = key.split('.');
    let current: any = TRANSLATIONS[lang];
    for (const k of keys) {
      if (current[k] === undefined) return key;
      current = current[k];
    }
    return current;
  };

  useEffect(() => {
    window.localStorage.setItem("seo-dashboard-date-range", JSON.stringify(dateRange));
  }, [dateRange]);

  useEffect(() => {
    window.localStorage.setItem("seo-dashboard-lang", lang);
  }, [lang]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, !!session);
      
      if (event === 'TOKEN_REFRESHED') {
        setSessionExists(true);
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        // Double check if we really have no session
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setSessionExists(false);
          toast.error(t('sessionExpired'));
        }
      } else if (session) {
        setSessionExists(true);
      }
    });

    const checkCurrent = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionExists(!!session);
    };
    checkCurrent();

    return () => subscription.unsubscribe();
  }, [lang]);

  const { data: metrics, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-metrics", activeView, dateRange.startDate, dateRange.endDate],
    queryFn: async (): Promise<any> => {
      // Ensure we have a fresh session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        // Try refreshing if possible
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshed.session) {
          throw new Error("Unauthorized");
        }
      }
      
      try {
        const response = await getDashboardMetrics({ 
          data: { 
            startDate: dateRange.startDate, 
            endDate: dateRange.endDate 
          } 
        });
        return response;
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        throw err;
      }
    },
    enabled: sessionExists,
    refetchInterval: 60000,
    retry: (failureCount, error: any) => {
      if (error?.message === "Unauthorized") return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    placeholderData: (previousData) => previousData || (FALLBACK_METRICS as any),
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = "Tipo,Nome,Visualizações/Cliques,Tempo Médio,Bounce,Conversões/Taxa,Origem\n";
      const pageRows = metrics?.topPages?.map((p: any) => `Página,"${p.path}",${p.views},${p.avgTime},${p.bounceRate}%,${p.conversions},"${p.leadsBySource?.map((s: any) => `${s.source}: ${s.count}`).join(" | ") || ""}"`) || [];
      const blogRows = metrics?.blogStats?.topArticles?.map((p: any) => `Blog,"${p.title}",${p.views},${p.avgTime},${p.bounceRate}%,${p.conversion}%,"${p.keywords?.join(" | ") || ""}"`) || [];
      const clickRows = metrics?.clickEvents?.map((p: any) => `Botão,"${p.button}",${p.clicks},,,${p.conversion}%,"${p.sources?.map((s: any) => `${s.source}: ${s.count}`).join(" | ") || ""}"`) || [];
      const rows = [...pageRows, ...blogRows, ...clickRows].join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dashboard-metrics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t('csvExportSuccess'));
    } else {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return toast.error(t('popupsError'));
      printWindow.document.write(`<html><head><title>Relatório SEO</title></head><body><h1>Relatório SEO</h1><p>Período: ${dateRange.startDate} até ${dateRange.endDate}</p><pre>${JSON.stringify({ paginas: metrics?.topPages, blog: metrics?.blogStats?.topArticles, botoes: metrics?.clickEvents }, null, 2)}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
      toast.success(t('pdfExportSuccess'));
    }
  };

  const menuItems = [
    { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { id: "leads-realtime", labelKey: "leadsRealtime", icon: Activity },
    { id: "seo-audit", labelKey: "seoAudit", icon: FileText },
    { id: "campaigns", labelKey: "campaigns", icon: Target },
    { id: "ab-testing", labelKey: "abTesting", icon: Split },
    { id: "visao-geral", labelKey: "overview", icon: BarChart3 },
    { id: "site", labelKey: "site", icon: Globe },
    { id: "audiencia", labelKey: "audience", icon: Users },
    { id: "aquisicao", labelKey: "acquisition", icon: TrendingUp },
    { id: "blog-analytics", labelKey: "blogAnalytics", icon: Zap },
    { id: "alertas", labelKey: "alerts", icon: Bell },
    { id: "gtm-debug", labelKey: "gtmDebugger", icon: Activity },
  ];

  const adminItems = [
    { id: "blog", labelKey: "manageBlog", icon: FileText },
    { id: "calendar", labelKey: "calendar", icon: Calendar },
    { id: "users", labelKey: "users", icon: Users },
    { id: "integrations", labelKey: "integrations", icon: Settings },
    { id: "profile", labelKey: "profile", icon: User },
  ];
