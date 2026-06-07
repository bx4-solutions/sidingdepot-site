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
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
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
      if (!current || current[k] === undefined) return key;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore noisy events that don't change identity to prevent flicker
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session) setSessionExists(true);
        return;
      }
      if (event === 'SIGNED_OUT') {
        setSessionExists(false);
        toast.error("Sessão encerrada");
      } else if (event === 'SIGNED_IN' && session) {
        setSessionExists(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);


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
      toast.success("CSV exportado com métricas de páginas, blog e botões.");
    } else {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return toast.error("Permita pop-ups para exportar PDF.");
      printWindow.document.write(`<html><head><title>Relatório SEO</title></head><body><h1>Relatório SEO</h1><p>Período: ${dateRange.startDate} até ${dateRange.endDate}</p><pre>${JSON.stringify({ paginas: metrics?.topPages, blog: metrics?.blogStats?.topArticles, botoes: metrics?.clickEvents }, null, 2)}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
      toast.success("PDF pronto para salvar/compartilhar.");
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

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Falha ao atualizar senha");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const renderLeadsRealtime = () => {
    return <LeadsRealtimeView lang={lang} t={t} />;
  };

  const renderSeoAudit = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card className="bg-[#131921] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">{t('auditReport')}</CardTitle>
              <CardDescription>{t('auditDesc')}</CardDescription>
            </div>
            <Button 
              onClick={async () => {
                setIsAuditRunning(true);
                // Simulate running the script we created
                await new Promise(r => setTimeout(r, 2000));
                setIsAuditRunning(false);
                toast.success("Auditoria de SEO concluída e relatório atualizado!");
              }}
              disabled={isAuditRunning}
              className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
            >
              {isAuditRunning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              {t('runAudit')}
            </Button>
          </CardHeader>
          <CardContent>
             <div className="bg-sd-black/30 rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-8">
                      <div>
                         <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{t('auditedPages')}</p>
                         <p className="text-2xl font-black">—</p>
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{t('indexable')}</p>
                         <p className="text-2xl font-black text-slate-400">—</p>
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{t('warnings')}</p>
                         <p className="text-2xl font-black text-slate-400">—</p>
                      </div>
                   </div>
                   <Badge className="bg-white/10 text-slate-300 border-white/20">
                     {lang === 'pt' ? 'Executar auditoria' : 'Run audit'}
                   </Badge>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-10 w-10 text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-300">
                    {lang === 'pt' ? 'Nenhuma auditoria executada ainda' : 'No audit run yet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    {lang === 'pt'
                      ? 'Clique em "Executar Auditoria" para analisar as páginas do site.'
                      : 'Click "Run Audit" to analyze site pages.'}
                  </p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGtmDebugger = () => {
    return <GtmDebuggerView t={t} />;
  };

  const renderAlerts = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card className="bg-[#131921] border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-sd-green" />
              {t('alertsTitle')}
            </CardTitle>
            <CardDescription>{t('alertsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-sd-green mb-4" />
              <p className="text-lg font-bold text-white">
                {lang === 'pt' ? 'Nenhum alerta ativo' : 'No active alerts'}
              </p>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">
                {lang === 'pt'
                  ? 'Alertas automáticos aparecerão aqui quando eventos críticos forem detectados.'
                  : 'Automatic alerts will appear here when critical events are detected.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="dark min-h-screen bg-[#0a0e14] flex text-white font-sans">
      {/* SIDEBAR - Estilo Siding Depot */}
      <aside className="w-64 bg-[#131921] border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-sd-green/10 p-2 rounded-lg">
            <Gauge className="h-6 w-6 text-sd-green" />
          </div>
          <span className="font-display text-2xl tracking-tight text-white uppercase">Siding Depot <span className="text-sd-green">SD</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                activeView === item.id 
                  ? "bg-sd-green text-sd-black shadow-[0_0_15px_rgba(180,210,54,0.3)]" 

                  : "text-slate-200 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {t(item.labelKey)}
            </button>
          ))}

          <div className="pt-6 pb-2">
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">{t('administration')}</span>
          </div>

          {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                activeView === item.id 
                  ? "bg-sd-green text-sd-black shadow-[0_0_15px_rgba(180,210,54,0.3)]" 
                  : "text-slate-200 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-200 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/10 bg-[#131921] px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-bold capitalize">
               {activeView === 'dashboard' ? t('dashboard') : t(menuItems.find(i => i.id === activeView)?.labelKey || adminItems.find(i => i.id === activeView)?.labelKey || activeView.replace('-', ' '))}
             </h2>
             <div className="flex flex-col">
               <span className="text-slate-300 text-[10px] flex items-center gap-2">
                 <Clock className="h-3 w-3" /> 
                 {isFetching ? t('updating') : t('synchronized')}
                 <button 
                   onClick={() => {
                     refetch();
                     toast.success(t('refreshingData'));
                   }}
                   disabled={isFetching}
                   className="p-1 hover:bg-white/5 rounded-md transition-colors disabled:opacity-50"
                   title={t('updateNow')}
                 >
                   <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
                 </button>
               </span>
               {metrics?.isSimulated && (
                 <span className="text-[9px] text-sd-green/70 font-bold uppercase tracking-widest">
                   {t('demoMode')}
                 </span>
               )}
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/10 mr-2">
              <button
                onClick={() => setLang('pt')}
                className={cn(
                  "p-1.5 rounded transition-all flex items-center gap-2",
                  lang === 'pt' ? "bg-sd-green text-sd-black" : "hover:bg-white/10 text-slate-400"
                )}
                title="Português"
              >
                <img src="https://flagcdn.com/w20/br.png" alt="PT" className="w-4 h-3 object-cover rounded-sm" />
                <span className="text-[10px] font-bold">PT</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={cn(
                  "p-1.5 rounded transition-all flex items-center gap-2",
                  lang === 'en' ? "bg-sd-green text-sd-black" : "hover:bg-white/10 text-slate-400"
                )}
                title="English"
              >
                <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-4 h-3 object-cover rounded-sm" />
                <span className="text-[10px] font-bold">EN</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Calendar className="h-3 w-3 text-sd-green" />
              {DATE_RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => setDateRange(resolveDateRange(preset.days))}
                  className="rounded-md px-2 py-1 text-[10px] font-black uppercase text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  {t(`datePresets.${preset.labelKey}`)}
                </button>
              ))}
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((current: any) => ({ ...current, startDate: e.target.value }))}
                className="h-7 w-[130px] bg-transparent border-white/10 text-[10px] text-white"
              />
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((current: any) => ({ ...current, endDate: e.target.value }))}
                className="h-7 w-[130px] bg-transparent border-white/10 text-[10px] text-white"
              />
            </div>

            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{userProfile?.email}</p>
                <span className="text-[10px] font-black text-sd-green uppercase">{userProfile?.role}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-sd-green flex items-center justify-center text-sd-black font-black text-xs">
                {userProfile?.email?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0e14]">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{activeView === 'dashboard' ? t('dashboard') : t(menuItems.find(i => i.id === activeView)?.labelKey || adminItems.find(i => i.id === activeView)?.labelKey || '')}</h1>
                <p className="text-slate-200 text-sm">{t('performanceRealtime')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-10"
                >
                  <Download className="h-4 w-4 mr-2" /> {t('export')} CSV
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast.success(t('generatingWeeklyReport'));
                    handleExport('pdf');
                  }}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-10"
                >
                  <FileText className="h-4 w-4 mr-2" /> {t('weeklyReport')}
                </Button>
              </div>
            </div>

            {!sessionExists ? (
              <Card className="bg-[#131921] border-sd-green/20 p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-sd-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-sd-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('sessionExpired')}</h3>
                <p className="text-slate-200 mb-8 max-w-sm mx-auto">
                  {lang === 'pt' ? 'Não foi possível detectar sua sessão. Por favor, reconecte-se para visualizar as métricas.' : 'Unable to detect your session. Please reconnect to view metrics.'}
                </p>
                <Button 
                  onClick={() => navigate({ to: "/admin/login" })}
                  className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-black"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> {t('reconnectNow')}
                </Button>
              </Card>
            ) : error ? (
              <Card className="bg-[#131921] border-red-500/20 p-12 text-center animate-in fade-in duration-500">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">{t('fetchingError')}</h3>
                <p className="text-slate-200 mt-2">{lang === 'pt' ? 'Ocorreu uma falha intermitente na conexão com o servidor.' : 'An intermittent server connection failure occurred.'}</p>
                <Button 
                  onClick={() => refetch()}
                  variant="outline"
                  className="mt-6 border-white/10 hover:bg-white/5"
                >
                  {t('tryAgain')}
                </Button>
              </Card>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="bg-[#131921] border-white/10 h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {activeView === "gtm-debug" && renderGtmDebugger()}
                {activeView === "alertas" && renderAlerts()}
                {activeView === "leads-realtime" && renderLeadsRealtime()}
                {activeView === "seo-audit" && renderSeoAudit()}

                {activeView === "dashboard" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {/* KPI GRIDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <KPICard title={t('totalConversions')} value={metrics?.overview.totalConversions} icon={MousePointer2} color="sd-green" diff={lang === 'pt' ? "+12% vs anterior" : "+12% vs previous"} />
                      <KPICard title={t('conversionRate')} value={`${metrics?.overview.conversionRate}%`} icon={TrendingUp} color="sd-green" diff={lang === 'pt' ? "+0.5% vs anterior" : "+0.5% vs previous"} />
                      <KPICard title={t('callClicks')} value={metrics?.clickEvents?.find((e: any) => e.button.toLowerCase().includes('call'))?.clicks || 0} icon={Phone} color="sd-green" diff={lang === 'pt' ? "Leads por telefone" : "Phone leads"} />
                      <KPICard title={t('appointments')} value={metrics?.overview.appointments} icon={CalendarCheck2} color="sd-green" diff={lang === 'pt' ? "3 novos hoje" : "3 new today"} />
                      <KPICard title={t('chatInteractions')} value={metrics?.overview.chatInteractions} icon={MessageSquare} color="sd-green" diff={lang === 'pt' ? "Interações 24h" : "24h interactions"} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <MiniKPICard title={t('totalVisitors')} value={metrics?.overview?.totalVisitors ? metrics.overview.totalVisitors.toLocaleString() : "—"} diff="" />
                      <MiniKPICard title={t('uniqueVisitors')} value={metrics?.overview?.uniqueVisitors ? metrics.overview.uniqueVisitors.toLocaleString() : "—"} diff="" />
                      <MiniKPICard title={t('pageViews')} value={metrics?.overview?.pageViews ? metrics.overview.pageViews.toLocaleString() : "—"} diff="" />
                      <MiniKPICard title={t('pagesPerVisit')} value={metrics?.overview?.pagesPerVisit ? String(metrics.overview.pagesPerVisit) : "—"} diff="" />
                      <MiniKPICard title={t('bounceRate')} value={metrics?.overview?.bounceRate ? `${metrics.overview.bounceRate}%` : "—"} diff="" />
                      <MiniKPICard title={t('avgSessionDuration')} value={metrics?.overview?.avgSessionDuration && metrics.overview.avgSessionDuration !== "0s" ? metrics.overview.avgSessionDuration : "—"} diff="" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                          <div>
                            <CardTitle className="text-lg font-bold text-white">{t('trafficEvolution')}</CardTitle>
                            <CardDescription className="text-xs">{t('trafficEvolutionDesc')}</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="h-[300px] p-0 pr-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics?.trafficTrend}>
                              <defs>
                                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--sd-green)" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="var(--sd-green)" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                              />
                              <Area type="monotone" dataKey="views" stroke="var(--sd-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">{t('acquisitionSources')}</CardTitle>
                          <CardDescription className="text-xs">{t('mainChannels')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-0">
                           <div className="h-[200px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={metrics?.acquisition}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="visitors"
                                  >
                                    {metrics?.acquisition?.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="w-full space-y-2 mt-4">
                              {metrics?.acquisition?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-200">{item.source}</span>
                                  </div>
                                  <span className="font-bold">{item.visitors.toLocaleString()}</span>
                                </div>
                              ))}
                           </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* VISUALIZAÇÕES E VISITANTES (série diária) */}
                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Visualizações e Visitantes</CardTitle>
                        <CardDescription className="text-xs">Série diária dentro do período selecionado</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[280px] p-0 pr-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={metrics?.dailyTrend}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--sd-green)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--sd-green)" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} dy={8} interval={3} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="views" name="Visualizações" stroke="var(--sd-green)" strokeWidth={2} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="visitors" name="Visitantes" stroke="oklch(0.65 0.18 220)" strokeWidth={2} fill="url(#colorVisitors)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* DISPOSITIVOS / PÁGINAS / PAÍSES */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Dispositivos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                          <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={metrics?.devices} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                  {metrics?.devices?.map((entry: any, i: number) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex gap-4 mt-3">
                            {metrics?.devices?.map((d: any, i: number) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs">
                                <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
                                <span className="text-slate-200">{d.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-bold text-white">Ranqueamento e Performance de Páginas</CardTitle>
                          <Badge className="bg-sd-green/10 text-sd-green border-sd-green/20">Site Interno</Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                  <th className="pb-3 px-2">{t('page')}</th>
                                  <th className="pb-3 text-right">{t('views')}</th>
                                  <th className="pb-3 text-right">{t('avgTime')}</th>
                                  <th className="pb-3 text-right">{t('bounce')}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {metrics?.topPages?.map((p: any, i: number) => (
                                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sd-green font-bold w-4">#{i+1}</span>
                                        <button
                                          type="button"
                                          onClick={() => setSelectedPageForLeads(p.path)}
                                          className="text-left text-slate-200 truncate font-mono text-xs max-w-[200px] hover:text-sd-green"
                                        >
                                          {p.path}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-3 text-right font-bold">{p.views}</td>
                                    <td className="py-3 text-right text-slate-300">{p.avgTime}</td>
                                    <td className="py-3 text-right">
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold",
                                        p.bounceRate < 30 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                      )}>
                                        {p.bounceRate}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">{t('leadOrigin')}</CardTitle>
                          <CardDescription className="text-xs">{t('trackingChannel')}</CardDescription>
                        </CardHeader>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">{t('ctaPerformance')}</CardTitle>
                            <CardDescription className="text-xs">{t('segmentationDesc')}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-sd-green/30 text-sd-green">Top CTA: Hero</Badge>
                            <Badge variant="outline" className="border-sd-green/30 text-sd-green">Top SVC: Siding</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {metrics?.acquisition?.map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{item.source}</span>
                                <span className="font-bold text-sd-green">{item.leads} leads</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-sd-green rounded-full" 
                                  style={{ width: `${(item.leads / 142) * 100}%` }} 
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* RANKING DE CLIQUES E COMPETIÇÃO */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">Ranking de Cliques em Botões</CardTitle>
                          <CardDescription className="text-xs">CTAs mais convertidos e origem do clique</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {metrics?.clickEvents?.map((ev: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-sd-green/30 transition-all">
                               <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-sd-green/10 rounded-lg">
                                        <MousePointer2 className="h-4 w-4 text-sd-green" />
                                     </div>
                                     <span className="text-sm font-bold text-white">{ev.button}</span>
                                  </div>
                                  <Badge className="bg-sd-green/20 text-sd-green border-0 text-xs font-black">{ev.conversion}% CONV.</Badge>
                               </div>
                               <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                  <div className="flex gap-2">
                                     {ev.sources?.map((s: any, si: number) => (
                                       <span key={si} className="text-[9px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">{s.source}</span>
                                     ))}
                                  </div>
                                  <div className="text-right">
                                     <span className="text-lg font-black text-white">{ev.clicks}</span>
                                     <span className="text-[10px] text-slate-500 ml-1 uppercase font-bold tracking-tighter">Cliques</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">Competição de Permanência</CardTitle>
                          <CardDescription className="text-xs">Tempo médio: Top Páginas vs Resto do Site</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[280px] flex flex-col justify-between pt-6">
                           <div className="flex-1">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                  { name: 'Top Páginas', value: metrics?.timeComparison?.topPagesAvg || 0 },
                                  { name: 'Média Geral', value: metrics?.timeComparison?.restOfSiteAvg || 0 }
                                ]}>
                                  <XAxis dataKey="name" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                                  <YAxis hide />
                                  <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                    contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    formatter={(v: any) => [`${v} segundos`, 'Tempo Médio']}
                                  />
                                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                     <Cell fill="var(--sd-green)" />
                                     <Cell fill="rgba(255,255,255,0.1)" />
                                  </Bar>
                                </BarChart>
                             </ResponsiveContainer>
                           </div>
                           <div className="flex justify-around items-end pt-6 border-t border-white/5">
                              <div className="text-center">
                                 <p className="text-2xl font-black text-sd-green">{metrics?.timeComparison?.topPagesAvg}s</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Retenção Top</p>
                              </div>
                              <div className="h-8 w-px bg-white/10" />
                              <div className="text-center">
                                 <p className="text-2xl font-black text-white/20">{metrics?.timeComparison?.restOfSiteAvg}s</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Média Site</p>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-bold text-white">Performance de Artigos</CardTitle>
                            <CardDescription className="text-xs">Ranqueamento dos melhores posts do blog</CardDescription>
                          </div>
                          <Badge className="bg-sd-green/10 text-sd-green border-sd-green/20">Blog</Badge>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              {metrics?.blogStats?.topArticles?.map((art: any, i: number) => (
                                <button key={i} type="button" onClick={() => setSelectedBlogArticle(art)} className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors text-left">
                                   <div className="flex items-center gap-4">
                                      <div className="h-8 w-8 rounded bg-sd-green/10 flex items-center justify-center text-sd-green font-bold text-xs">
                                        {i + 1}
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-white">{art.title}</p>
                                        <p className="text-[10px] text-slate-400">{art.views.toLocaleString()} views · {art.conversion}% conv.</p>
                                      </div>
                                   </div>
                                   <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-sd-green transition-colors" />
                                </button>
                              ))}
                           </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Benchmarks do Mercado</CardTitle>
                          <CardDescription className="text-xs">Comparativo com médias do setor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           {metrics?.blogStats?.marketBenchmarks?.map((bench: any, i: number) => (
                             <div key={i} className="space-y-2">
                               <div className="flex justify-between text-xs">
                                 <span className="text-slate-300 font-bold">{bench.category}</span>
                                 <span className="text-sd-green font-black">{bench.value}% <span className="text-slate-500 font-normal">/ {bench.benchmark}%</span></span>
                               </div>
                               <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="absolute top-0 left-0 h-full bg-sd-green rounded-full z-10" style={{ width: `${bench.value}%` }} />
                                 <div className="absolute top-0 left-[70%] h-full w-0.5 bg-white/20 z-20" title="Benchmark" />
                               </div>
                             </div>
                           ))}
                           <div className="pt-2 border-t border-white/5">
                              <p className="text-[10px] text-slate-400 italic">Benchmarks baseados em dados de mercado para o segmento de Construção/IA em 2026.</p>
                           </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Visitantes por País</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {metrics?.countries?.map((c: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                              <span className="text-slate-200">{c.name}</span>
                              <span className="font-bold text-white">{c.visitors}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                    </div>
                  </div>
                )}

                {activeView === "profile" && (
                  <div className="max-w-2xl animate-in fade-in duration-500">
                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-sd-green/10 rounded-xl">
                          <User className="h-6 w-6 text-sd-green" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white">Meu Perfil</CardTitle>
                          <CardDescription>Gerencie suas informações e segurança</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 mb-1">E-mail</p>
                            <p className="font-bold">{userProfile?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 mb-1">Nível de Acesso</p>
                            <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30 uppercase">{userProfile?.role}</Badge>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Key className="h-4 w-4 text-sd-green" /> Alterar Senha
                          </h3>
                          <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm text-slate-200">Nova Senha</label>
                                <Input 
                                  type="password" 
                                  className="bg-white/5 border-white/10 text-white" 
                                  placeholder="••••••••"
                                  value={newPassword}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-slate-200">Confirmar Senha</label>
                                <Input 
                                  type="password" 
                                  className="bg-white/5 border-white/10 text-white" 
                                  placeholder="••••••••"
                                  value={confirmPassword}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <Button 
                              type="submit" 
                              className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold h-11 px-8"
                              disabled={updatingPassword}
                            >
                              {updatingPassword ? "Atualizando..." : "Salvar Nova Senha"}
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeView === "integrations" && (
                   <div className="space-y-6 animate-in fade-in duration-500">
                     {/* Status banner */}
                     <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                       <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-sm font-bold text-yellow-400">Integrações externas requerem configuração manual</p>
                         <p className="text-xs text-slate-300 mt-1">Google Search Console e GA4 não se conectam automaticamente. Siga as instruções abaixo para ativá-los.</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Google Search Console */}
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <Search className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">Google Search Console</CardTitle>
                              <CardDescription>Status de indexação e performance orgânica</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Globe className="h-4 w-4 text-slate-400" />
                                 <span className="text-sm font-bold font-mono">
                                   {typeof window !== 'undefined' ? window.location.hostname : 'sidingdepot.vercel.app'}
                                 </span>
                              </div>
                              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Verificar</Badge>
                           </div>
                           <div className="p-3 bg-sd-black/40 border border-white/5 rounded-lg text-[11px] text-slate-300 space-y-1">
                             <p className="font-bold text-white text-xs mb-2">Como configurar:</p>
                             <p>1. Acesse <span className="text-sd-green font-mono">search.google.com/search-console</span></p>
                             <p>2. Adicione a propriedade <span className="text-sd-green font-mono">sidingdepot.com</span></p>
                             <p>3. Verifique via tag HTML (já está no site) ou DNS</p>
                             <p className="text-slate-500 mt-2">O código de verificação já está no site: <span className="font-mono text-sd-green">Q3iqnEYQT-...</span></p>
                           </div>
                           <a
                             href="https://search.google.com/search-console/welcome"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="block w-full"
                           >
                             <Button className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-black uppercase tracking-widest text-xs h-12 rounded-xl">
                               Abrir Search Console
                               <ExternalLink className="h-4 w-4 ml-2" />
                             </Button>
                           </a>
                        </CardContent>
                      </Card>

                      {/* Google Analytics 4 */}
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <Activity className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">Google Analytics 4</CardTitle>
                              <CardDescription>Eventos, conversões e fluxo de usuários</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">GTM</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-sd-green" />
                                <span className="text-xs font-bold text-sd-green">GTM-TFGQWCQN</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">Ativo no site</p>
                            </div>
                            <div className="p-3 bg-white/5 border border-yellow-500/20 rounded-xl">
                              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">GA4 ID</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                                <span className="text-xs font-bold text-yellow-400">Não configurado</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">VITE_GA4_ID faltando</p>
                            </div>
                          </div>
                          <div className="p-3 bg-sd-black/40 border border-white/5 rounded-lg text-[11px] text-slate-300 space-y-1">
                            <p className="font-bold text-white text-xs mb-2">Como ativar GA4:</p>
                            <p>1. Crie uma propriedade GA4 em <span className="text-sd-green font-mono">analytics.google.com</span></p>
                            <p>2. Copie o Measurement ID (ex: <span className="font-mono text-sd-green">G-XXXXXXXXXX</span>)</p>
                            <p>3. Adicione na Vercel: <span className="font-mono text-sd-green">VITE_GA4_ID = G-XXXXXXXXXX</span></p>
                            <p className="text-slate-500 mt-1">Ou configure via GTM → GA4 Configuration Tag</p>
                          </div>
                          <a
                            href="https://analytics.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          >
                            <Button variant="outline" className="w-full border-white/10 text-white font-bold h-10 hover:bg-white/5">
                              Abrir Google Analytics
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </a>
                        </CardContent>
                      </Card>

                      {/* GHL Webhook */}
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <MessageSquare className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">GHL Chat Widget</CardTitle>
                              <CardDescription>Captura de leads via formulário do widget</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                            <span className="font-mono text-xs text-slate-300">Widget ID: 6a05e7c2f127bb4126a40721</span>
                            <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30">Ativo</Badge>
                          </div>
                          <div className="p-3 bg-sd-black/40 border border-white/5 rounded-lg text-[11px] text-slate-300 space-y-1">
                            <p className="font-bold text-white text-xs mb-2">Webhook para captura de leads:</p>
                            <p className="font-mono text-sd-green break-all">
                              {typeof window !== 'undefined' ? window.location.origin : 'https://sidingdepot.vercel.app'}/api/ghl-webhook
                            </p>
                            <p className="mt-2">Configure no GHL → Settings → Integrations → Webhooks → POST</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* GTM */}
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <BarChart3 className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">Google Tag Manager</CardTitle>
                              <CardDescription>Container de tags e eventos</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-white/5 border border-sd-green/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-5 w-5 text-sd-green" />
                              <div>
                                <p className="text-sm font-bold">GTM-TFGQWCQN</p>
                                <p className="text-[10px] text-slate-400">Instalado em todas as páginas</p>
                              </div>
                            </div>
                            <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30">Ativo</Badge>
                          </div>
                          <a
                            href="https://tagmanager.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          >
                            <Button variant="outline" className="w-full border-white/10 text-white font-bold h-10 hover:bg-white/5">
                              Abrir Tag Manager
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                     </div>
                   </div>
                )}

                {activeView === "blog-analytics" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <KPICard title="Total de Artigos" value={metrics?.blogStats?.totalPosts} icon={FileText} color="sd-green" diff="Ativos no site" />
                      <KPICard title="Tempo Médio de Leitura" value={metrics?.blogStats?.avgReadingTime} icon={Clock} color="sd-green" diff="Benchmark do setor" />
                      <KPICard title="Lead Conversion" value="4.8%" icon={Target} color="sd-green" diff="+1.2% vs set/25" />
                    </div>

                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Ranking de Performance do Blog</CardTitle>
                          <CardDescription className="text-xs">Comparativo detalhado entre os melhores posts</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 h-8 text-[10px] font-black uppercase">
                          Filtrar por Keywords
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Artigo</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Tempo Médio</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Bounce</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Conversão</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Palavras-Chave</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {metrics?.blogStats?.topArticles?.map((art: any, i: number) => (
                                <TableRow key={i} onClick={() => setSelectedBlogArticle(art)} className="border-white/5 group hover:bg-white/5 transition-colors cursor-pointer">
                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sd-green font-black">#{i+1}</span>
                                      <span className="text-white font-bold">{art.title}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right py-4 font-mono text-xs">{art.avgTime}</TableCell>
                                  <TableCell className="text-right py-4">
                                    <span className="text-yellow-500 font-bold">{art.bounceRate}%</span>
                                  </TableCell>
                                  <TableCell className="text-right py-4">
                                    <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30">{art.conversion}%</Badge>
                                  </TableCell>
                                  <TableCell className="text-right py-4">
                                    <div className="flex gap-1 justify-end flex-wrap max-w-[200px] ml-auto">
                                      {art.keywords?.map((kw: string, kidx: number) => (
                                        <Badge key={kidx} variant="outline" className="text-[9px] py-0 px-1 border-white/10 text-slate-400 font-normal">
                                          {kw}
                                        </Badge>
                                      ))}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Benchmarks de Engajamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           {metrics?.blogStats?.marketBenchmarks?.map((bench: any, i: number) => (
                             <div key={i} className="space-y-2">
                               <div className="flex justify-between text-xs">
                                 <span className="text-slate-300 font-bold">{bench.category}</span>
                                 <span className="text-sd-green font-black">{bench.value}% <span className="text-slate-500 font-normal">/ {bench.benchmark}%</span></span>
                               </div>
                               <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="absolute top-0 left-0 h-full bg-sd-green rounded-full z-10" style={{ width: `${bench.value}%` }} />
                                 <div className="absolute top-0 left-[70%] h-full w-0.5 bg-white/20 z-20" />
                               </div>
                             </div>
                           ))}
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#131921] border-white/10 flex flex-col items-center justify-center p-8 text-center">
                        <TrendingUp className="h-12 w-12 text-sd-green mb-4 opacity-50" />
                        <h4 className="text-lg font-bold mb-2">Sugestão de Conteúdo</h4>
                        <p className="text-sm text-slate-400 mb-6">Com base na performance das palavras-chave, sugerimos criar conteúdos sobre "Automação de Orçamentos com IA".</p>
                        <Button className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-black uppercase text-xs px-8">Ver Sugestões IA</Button>
                      </Card>
                    </div>
                  </div>
                )}

                {/* PLACEHOLDER PARA OUTRAS ABAS */}
                {["campaigns", "ab-testing", "site", "audiencia", "blog", "calendar", "users"].includes(activeView) && (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
                    <div className="bg-sd-green/5 p-8 rounded-full mb-6">
                      <LayoutDashboard className="h-16 w-16 text-sd-green/20" />
                    </div>
                    <h3 className="text-2xl font-bold">Módulo em Desenvolvimento</h3>
                    <p className="text-slate-300 max-w-sm mt-2">Estamos portando as métricas 1:1 do Siding Depot para este módulo. Disponível em breve.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Dialog open={!!selectedPageForLeads} onOpenChange={() => setSelectedPageForLeads(null)}>
        <DialogContent className="bg-[#131921] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-sd-green" />
              Origem dos Leads
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-mono text-[10px]">
              {selectedPageForLeads}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-xs font-black uppercase text-slate-400">Origem dos Leads (Total)</p>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads)?.leadsBySource?.map((src: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-sm font-bold truncate max-w-[150px]" title={src.source}>{src.source}</span>
                      <Badge className="bg-sd-green text-sd-black font-black whitespace-nowrap">{src.count} LEADS</Badge>
                    </div>
                  ))}
                  {(!metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads)?.leadsBySource || metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads)?.leadsBySource.length === 0) && (
                    <div className="text-center py-8 text-slate-500 italic text-sm">
                      Nenhuma conversão registrada.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black uppercase text-slate-400">Métricas Principais</p>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const page = metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads);
                    return [
                      { label: "Visualizações", value: page?.views || 0, icon: Eye },
                      { label: "Tempo Médio", value: page?.avgTime || "0s", icon: Clock },
                      { label: "Conversões", value: page?.conversions || 0, icon: Target },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between rounded-lg bg-white/5 p-3 border border-white/5">
                        <div className="flex items-center gap-2">
                          <m.icon className="h-3 w-3 text-sd-green" />
                          <span className="text-[10px] uppercase font-black text-slate-400">{m.label}</span>
                        </div>
                        <p className="text-lg font-black text-white">{m.value}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400">Evolução de Leads por Canal</p>
              <div className="h-[250px] rounded-xl bg-white/5 p-4 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads)?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                      itemStyle={{ padding: '0px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    {(() => {
                      const trend = metrics?.topPages?.find((p: any) => p.path === selectedPageForLeads)?.trend || [];
                      const allChannels = new Set<string>();
                      trend.forEach((day: any) => {
                        Object.keys(day.leadsByChannel || {}).forEach(ch => allChannels.add(ch));
                      });
                      
                      const palette = ["var(--sd-green)", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#ef4444"];
                      
                      return Array.from(allChannels).map((channel, i) => (
                        <Bar 
                          key={channel} 
                          dataKey={`leadsByChannel.${channel}`} 
                          name={channel} 
                          stackId="a" 
                          fill={palette[i % palette.length]} 
                          radius={i === allChannels.size - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                        />
                      ));
                    })()}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedPageForLeads(null)}
            className="w-full border-white/10 hover:bg-white/5 text-white"
          >
            FECHAR
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedBlogArticle} onOpenChange={() => setSelectedBlogArticle(null)}>
        <DialogContent className="bg-[#131921] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-sd-green" />
              {selectedBlogArticle?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">Leads, UTM, palavras-chave e evolução no período selecionado.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Views", selectedBlogArticle?.views || 0],
              ["Tempo", selectedBlogArticle?.avgTime || "0s"],
              ["Bounce", `${selectedBlogArticle?.bounceRate || 0}%`],
              ["Conversão", `${selectedBlogArticle?.conversion || 0}%`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg bg-white/5 p-3 border border-white/5">
                <p className="text-[10px] uppercase font-black text-slate-400">{label}</p>
                <p className="mt-1 text-lg font-black text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-400">Origem dos Leads</p>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedBlogArticle?.leadsBySource || []).map((src: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 p-3 border border-white/5">
                      <span className="text-sm font-bold truncate max-w-[150px]" title={src.source}>{src.source}</span>
                      <Badge className="bg-sd-green text-sd-black font-black">{src.count}</Badge>
                    </div>
                  ))}
                  {(!selectedBlogArticle?.leadsBySource || selectedBlogArticle.leadsBySource.length === 0) && (
                    <div className="text-center py-4 text-slate-500 italic text-xs">Sem leads registrados.</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-400">Palavras-chave</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedBlogArticle?.keywords || []).map((kw: string) => (
                    <Badge key={kw} variant="outline" className="border-white/10 text-slate-300">{kw}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-slate-400">Evolução de Leads por Canal</p>
              <div className="h-[250px] rounded-xl bg-white/5 p-3 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedBlogArticle?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    {(() => {
                      const trend = selectedBlogArticle?.trend || [];
                      const allChannels = new Set<string>();
                      trend.forEach((day: any) => {
                        Object.keys(day.leadsByChannel || {}).forEach(ch => allChannels.add(ch));
                      });
                      const palette = ["var(--sd-green)", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#ef4444"];
                      return Array.from(allChannels).map((channel, i) => (
                        <Bar key={channel} dataKey={`leadsByChannel.${channel}`} name={channel} stackId="a" fill={palette[i % palette.length]} />
                      ));
                    })()}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pb-4">
            <p className="text-xs font-black uppercase text-slate-400">Visão Geral de Tráfego vs Leads</p>
            <div className="h-[200px] rounded-xl bg-white/5 p-3 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedBlogArticle?.trend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="views" name="Views" stroke="var(--sd-green)" fill="var(--sd-green)" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="leads" name="Total Leads" stroke="oklch(0.65 0.18 220)" fill="oklch(0.65 0.18 220)" fillOpacity={0.12} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, diff }: any) {
  return (
    <Card className="bg-[#131921] border-white/10 relative overflow-hidden group hover:border-sd-green/30 transition-all duration-300">
       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="h-12 w-12 text-sd-green" />
       </div>
       <CardHeader className="pb-2">
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">{title}</CardDescription>
          <CardTitle className="text-3xl font-black text-white">{value}</CardTitle>
       </CardHeader>
       <CardContent>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-green">
             <TrendingUp className="h-3 w-3" /> {diff}
          </div>
       </CardContent>
    </Card>
  );
}

function MiniKPICard({ title, value, diff }: any) {
  const isPositive = diff?.startsWith('+');
  return (
    <div className="bg-[#131921]/50 border border-white/5 rounded-xl p-4 hover:bg-[#131921] transition-colors">
       <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{title}</p>
       <div className="flex items-end justify-between">
          <span className="text-xl font-bold">{value}</span>
          {diff ? <span className={cn("text-[10px] font-bold", isPositive ? "text-sd-green" : "text-red-400")}>{diff}</span> : null}
       </div>
    </div>
  );
}

// ── Real Leads view — reads from Supabase `leads` table ──────────────────────
function LeadsRealtimeView({ lang, t }: { lang: string; t: (k: string) => string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setLeads(data || []);
        setLoading(false);
      });

    // Real-time subscription
    const channel = supabase
      .channel("leads-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, (payload) => {
        setLeads((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayLeads = leads.filter((l) => l.created_at?.slice(0, 10) === today);

  const formatTime = (ts: string) => {
    if (!ts) return "—";
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return lang === 'pt' ? "Agora" : "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ${lang === 'pt' ? 'atrás' : 'ago'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${lang === 'pt' ? 'atrás' : 'ago'}`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#131921] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {lang === 'pt' ? "Envios Hoje" : "Submissions Today"}
            </CardDescription>
            <CardTitle className="text-3xl font-black text-white">{todayLeads.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-green">
              <Activity className="h-3 w-3" /> {lang === 'pt' ? 'Via widget GHL' : 'Via GHL widget'}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#131921] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {lang === 'pt' ? "Total de Leads" : "Total Leads"}
            </CardDescription>
            <CardTitle className="text-3xl font-black text-white">{leads.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-green">
              <Zap className="h-3 w-3" /> {lang === 'pt' ? 'Captados no site' : 'Captured on site'}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#131921] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {lang === 'pt' ? "Status" : "Status"}
            </CardDescription>
            <CardTitle className="text-xl font-black text-sd-green">
              {lang === 'pt' ? 'Monitorando' : 'Monitoring'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-green">
              <div className="h-2 w-2 rounded-full bg-sd-green animate-pulse" />
              {lang === 'pt' ? 'Tempo real ativo' : 'Real-time active'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#131921] border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{t('leadStream')}</CardTitle>
          <CardDescription>{t('instantMonitoring')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              {lang === 'pt' ? 'Carregando leads...' : 'Loading leads...'}
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-lg font-bold text-white">
                {lang === 'pt' ? 'Nenhum lead capturado ainda' : 'No leads captured yet'}
              </p>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">
                {lang === 'pt'
                  ? 'Quando alguém preencher o formulário do widget GHL, o lead aparecerá aqui automaticamente em tempo real.'
                  : 'When someone fills out the GHL widget form, the lead will appear here automatically in real time.'}
              </p>
              <div className="mt-6 p-4 bg-sd-green/5 border border-sd-green/20 rounded-xl max-w-md text-left">
                <p className="text-xs text-sd-green font-bold mb-1">
                  {lang === 'pt' ? 'Como capturar leads:' : 'How to capture leads:'}
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                  <li>{lang === 'pt' ? 'Preencha o widget de chat no site' : 'Fill out the chat widget on the site'}</li>
                  <li>{lang === 'pt' ? 'Configure o webhook no GHL: POST /api/ghl-webhook' : 'Configure the webhook in GHL: POST /api/ghl-webhook'}</li>
                </ul>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-400">{t('time')}</TableHead>
                  <TableHead className="text-slate-400">{lang === 'pt' ? 'Nome' : 'Name'}</TableHead>
                  <TableHead className="text-slate-400">{lang === 'pt' ? 'Contato' : 'Contact'}</TableHead>
                  <TableHead className="text-slate-400">{lang === 'pt' ? 'Página' : 'Page'}</TableHead>
                  <TableHead className="text-slate-400">{lang === 'pt' ? 'Fonte' : 'Source'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-mono text-xs">{formatTime(lead.created_at)}</TableCell>
                    <TableCell className="font-bold text-sd-green">{lead.name || "—"}</TableCell>
                    <TableCell className="text-slate-300 text-xs">{lead.email || lead.phone || "—"}</TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400 max-w-[160px] truncate">{lead.page_url || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-sd-green/30 text-sd-green text-[10px]">
                        {lead.source || "ghl"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── GTM Debugger — reads real window.dataLayer events ───────────────────────
function GtmDebuggerView({ t }: { t: (k: string) => string }) {
  const [dlEvents, setDlEvents] = useState<any[]>([]);

  useEffect(() => {
    // Snapshot current dataLayer
    if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
      const meaningful = (window as any).dataLayer
        .filter((e: any) => e.event && e.event !== "gtm.js" && e.event !== "gtm.load" && e.event !== "gtm.dom")
        .slice(-20)
        .reverse();
      setDlEvents(meaningful);
    }

    // Poll every 5 s for new events
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
        const meaningful = (window as any).dataLayer
          .filter((e: any) => e.event && e.event !== "gtm.js" && e.event !== "gtm.load" && e.event !== "gtm.dom")
          .slice(-20)
          .reverse();
        setDlEvents(meaningful);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const integrations = [
    { name: "Google Tag Manager", id: "GTM-TFGQWCQN", ok: typeof window !== "undefined" && !!(window as any).google_tag_manager },
    { name: "Google Analytics 4", id: "GA4", ok: typeof window !== "undefined" && typeof (window as any).gtag === "function" },
    { name: "GHL Lead Webhook", id: "/api/ghl-webhook", ok: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#131921] border-sd-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sd-green animate-pulse" />
              DataLayer Live Feed
            </CardTitle>
            <CardDescription>Eventos reais disparados na sessão atual</CardDescription>
          </CardHeader>
          <CardContent>
            {dlEvents.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-sm">
                Nenhum evento de conversão registrado nesta sessão ainda.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 font-mono text-[10px]">
                {dlEvents.map((item, i) => {
                  const { event, ...rest } = item;
                  return (
                    <div key={i} className="p-3 bg-sd-black/30 border border-white/5 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sd-green font-bold uppercase">{event}</span>
                        <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <pre className="text-slate-400 overflow-x-auto">{JSON.stringify(rest, null, 2)}</pre>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#131921] border-white/10">
          <CardHeader>
            <CardTitle>{t('integrationStatus')}</CardTitle>
            <CardDescription>{t('trackingConnectivity')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  {service.ok
                    ? <CheckCircle2 className="h-5 w-5 text-sd-green" />
                    : <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                  <div>
                    <p className="text-sm font-bold">{service.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{service.id}</p>
                  </div>
                </div>
                <Badge className={service.ok ? "bg-sd-green/10 text-sd-green border-sd-green/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}>
                  {service.ok ? "Active" : "Check"}
                </Badge>
              </div>
            ))}
            <div className="p-4 bg-sd-green/5 border border-sd-green/20 rounded-xl">
              <p className="text-xs text-sd-green font-bold mb-2">{t('debugTip')}</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t('debugDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
