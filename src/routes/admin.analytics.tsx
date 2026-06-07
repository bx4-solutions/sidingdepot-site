/**
 * /admin/analytics — Intelligent Analytics Dashboard for SidingDepot
 *
 * Modules:
 *   1. Real-time Online Visitors Map (Supabase Presence)
 *   2. Visitor History Map (last 24h geo activity)
 *   3. Peak Hours Chart
 *   4. Audience: Device / Browser / OS / Country breakdown
 *   5. Conversion Funnel (Visitor → Lead → Client) with $ value
 *   6. Acquisition: Traffic sources + UTM campaigns
 *   7. Top Pages performance table
 */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from "react-simple-maps";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Globe, Monitor, Smartphone, Tablet, Clock, Flame, Moon,
  MapPin, Share2, TrendingUp,
  Binoculars, Lightbulb, MessageCircle, MousePointer, Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useOnlineVisitors } from "@/hooks/useOnlineVisitors";
import { useVisitorHistory } from "@/hooks/useVisitorHistory";
import {
  useTopPages, useDeviceStats, useBrowserStats, useOSStats,
  useCountryStats, useAcquisitionStats, useFunnelData,
} from "@/hooks/useSiteAnalytics";

// ── Auth guard ────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/analytics")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: AnalyticsDashboard,
});

// ── Constants ─────────────────────────────────────────────────────────────────

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const COLORS = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))","hsl(var(--chart-4))","hsl(var(--chart-5))"];

const FUNNEL_STAGES = [
  { key: "visitors",     label: "Visitantes",    icon: Binoculars,    color: "#500daa" },
  { key: "pageviews",    label: "Page Views",    icon: Lightbulb,     color: "#6b2fb8" },
  { key: "leads",        label: "Leads",          icon: MessageCircle, color: "#8651c6" },
  { key: "agendamentos", label: "Agendamentos",  icon: MousePointer,  color: "#a173d4" },
  { key: "clientes",     label: "Clientes",       icon: Trophy,        color: "#bc95e2" },
];
const FUNNEL_W = [100, 82, 66, 52, 40];

// ── Helpers ───────────────────────────────────────────────────────────────────

const flag = (code: string) => {
  if (!code || code === "XX" || code.length !== 2) return "🌍";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
};

const deviceIcon = (t: string) =>
  t?.toLowerCase() === "mobile" ? <Smartphone className="h-3.5 w-3.5" />
  : t?.toLowerCase() === "tablet" ? <Tablet className="h-3.5 w-3.5" />
  : <Monitor className="h-3.5 w-3.5" />;

const fmtMin = (m: number) => m < 1 ? "agora" : m < 60 ? `${m}m` : `${Math.floor(m/60)}h`;
const fmtSec = (s: number) => !s ? "—" : s < 60 ? `${s}s` : `${Math.floor(s/60)}m${s%60}s`;

const dotColor = (n: number) => n>=4?"hsl(var(--destructive))":n>=2?"hsl(var(--chart-3))":"hsl(var(--chart-4))";
const dotSize  = (n: number) => n>=4?12:n>=2?10:8;

// ── Real-time map ─────────────────────────────────────────────────────────────

function OnlineMap() {
  const { visitors, count } = useOnlineVisitors();

  const groups = useMemo(() => {
    const m = new Map<string,{lat:number;lon:number;count:number;items:typeof visitors}>();
    visitors.forEach((v) => {
      if (!v.lat && !v.lon) return;
      const k = `${Math.round(v.lat*10)/10},${Math.round(v.lon*10)/10}`;
      if (m.has(k)) { m.get(k)!.count++; m.get(k)!.items.push(v); }
      else m.set(k, {lat:v.lat,lon:v.lon,count:1,items:[v]});
    });
    return Array.from(m.values());
  }, [visitors]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Visitantes Online Agora
          <Badge variant="outline" className="ml-auto font-mono">{count} online</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-72 w-full overflow-hidden rounded-b-lg bg-muted/20">
          <ComposableMap projection="geoMercator" projectionConfig={{scale:130,center:[0,20]}} style={{width:"100%",height:"100%"}}>
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({geographies}) => geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth={0.5}
                    style={{default:{outline:"none"},hover:{outline:"none"},pressed:{outline:"none"}}} />
                ))}
              </Geographies>
              {groups.map((g,i) => (
                <Marker key={i} coordinates={[g.lon,g.lat]}>
                  <circle r={dotSize(g.count)+4} fill={dotColor(g.count)} opacity={0.3}
                    className="animate-ping" style={{animationDuration:"2s"}} />
                  <circle r={dotSize(g.count)} fill={dotColor(g.count)} stroke="white" strokeWidth={2} />
                  {g.count>1&&<text textAnchor="middle" y={4} style={{fontFamily:"system-ui",fontSize:10,fontWeight:"bold",fill:"white"}}>{g.count}</text>}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        {count === 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Nenhum visitante online agora — o mapa preencherá em tempo real
          </div>
        )}
        {visitors.length > 0 && (
          <div className="p-4 border-t space-y-2 max-h-48 overflow-y-auto">
            {visitors.slice(0,8).map((v) => (
              <div key={v.session_id} className="flex items-center gap-3 text-sm">
                <span className="text-base">{flag(v.countryCode)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{v.page_path}</p>
                  <p className="text-xs text-muted-foreground">{v.city||v.country}</p>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {deviceIcon(v.device_type)}
                  <span className="text-xs">{fmtMin(v.online_minutes)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── History map ───────────────────────────────────────────────────────────────

function HistoryMap() {
  const { data, isLoading } = useVisitorHistory();

  const groups = useMemo(() => {
    if (!data?.historyPoints) return [];
    const m = new Map<string,{lat:number;lon:number;count:number;points:typeof data.historyPoints}>();
    data.historyPoints.forEach((p) => {
      const k = `${Math.round(p.lat*10)/10},${Math.round(p.lon*10)/10}`;
      if (m.has(k)) { m.get(k)!.count++; m.get(k)!.points.push(p); }
      else m.set(k,{lat:p.lat,lon:p.lon,count:1,points:[p]});
    });
    return Array.from(m.values());
  }, [data]);

  const hColor = (n:number) => n>=10?"hsl(var(--destructive))":n>=5?"hsl(var(--chart-3))":n>=2?"hsl(var(--chart-2))":"hsl(var(--chart-4))";
  const hSize  = (n:number) => n>=10?12:n>=5?10:n>=2?8:6;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Atividade Geográfica — Últimas 24h
          <Badge variant="outline" className="ml-auto font-mono">{data?.totalVisits||0} visitas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-56 flex items-center justify-center text-muted-foreground animate-pulse">Carregando mapa...</div>
        ) : groups.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-sm gap-1">
            <MapPin className="h-8 w-8 opacity-30" />
            <p>Aguardando visitas com geolocalização</p>
            <p className="text-xs">Os dados geo aparecem após o deploy do AnalyticsTracker</p>
          </div>
        ) : (
          <div className="h-56 overflow-hidden rounded-b-lg bg-muted/20">
            <ComposableMap projectionConfig={{scale:140,center:[0,20]}} style={{width:"100%",height:"100%"}}>
              <Geographies geography={GEO_URL}>
                {({geographies}) => geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth={0.5}
                    style={{default:{outline:"none"},hover:{outline:"none"},pressed:{outline:"none"}}} />
                ))}
              </Geographies>
              {groups.map((g,i) => (
                <Marker key={i} coordinates={[g.lon,g.lat]}>
                  <circle r={hSize(g.count)+3} fill={hColor(g.count)} fillOpacity={0.3} />
                  <circle r={hSize(g.count)} fill={hColor(g.count)} stroke="white" strokeWidth={1} />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        )}
        {data?.peakHour && data.totalVisits > 0 && (
          <div className="flex items-center gap-2 p-3 border-t text-sm">
            <Flame className="h-4 w-4 text-chart-3" />
            Pico: <strong>{String(data.peakHour.hour).padStart(2,"0")}:00</strong> ({data.peakHour.count} visitas)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Peak hours ────────────────────────────────────────────────────────────────

function PeakHoursCard() {
  const { data, isLoading } = useVisitorHistory();
  const chartData = data?.hourlyDistribution || [];
  const hasData = chartData.some((b) => b.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horários de Pico — Últimas 24h
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !hasData ? (
          <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
            {isLoading ? "Carregando..." : "Sem dados de horário ainda"}
          </div>
        ) : (
          <>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{top:4,right:4,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="hour" tickFormatter={(h)=>`${h}h`} tick={{fontSize:10}} interval={1} />
                  <YAxis tick={{fontSize:10}} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{backgroundColor:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"8px"}}
                    formatter={(v:number)=>[`${v} visitas`,""]}
                    labelFormatter={(h)=>`${String(h).padStart(2,"0")}:00`}
                  />
                  <Bar dataKey="count" radius={[4,4,0,0]} fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              {data?.peakHour && data.peakHour.count > 0 && (
                <span className="flex items-center gap-1 text-chart-3">
                  <Flame className="h-4 w-4" />
                  Pico: {String(data.peakHour.hour).padStart(2,"0")}:00 ({data.peakHour.count})
                </span>
              )}
              {data?.lowestHour && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Moon className="h-4 w-4" />
                  Menor: {String(data.lowestHour.hour).padStart(2,"0")}:00
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Pie card ──────────────────────────────────────────────────────────────────

function PieCard({title,data}:{title:string;data:{name:string;value:number}[]|undefined}) {
  if (!data?.length) return (
    <Card>
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent><div className="h-32 flex items-center justify-center text-muted-foreground text-xs">Sem dados</div></CardContent>
    </Card>
  );
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="pt-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3} dataKey="value">
                {data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{backgroundColor:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"6px",fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {data.slice(0,5).map((d,i) => (
            <div key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:COLORS[i%COLORS.length]}} />
              {d.name}: {d.value}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Conversion funnel ─────────────────────────────────────────────────────────

function FunnelCard({filters}:{filters:{startDate:Date;endDate:Date}}) {
  const {data,isLoading} = useFunnelData(filters);
  const [perLead, setPerLead] = useState(2500);

  const vals: Record<string,number> = {
    visitors: data?.visitors||0,
    pageviews: data?.pageviews||0,
    leads: data?.leads||0,
    agendamentos: data?.agendamentos||0,
    clientes: data?.clientes||0,
  };
  const pipeline = (vals.leads+vals.agendamentos+vals.clientes)*perLead;

  if (isLoading) return (
    <Card><CardHeader><CardTitle>Funil de Conversão</CardTitle></CardHeader>
      <CardContent><div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Carregando...</div></CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Funil de Conversão</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">$/lead:</span>
            <input type="number" value={perLead} onChange={(e)=>setPerLead(Number(e.target.value)||0)}
              className="w-20 text-right border rounded px-2 py-1 text-sm bg-background" min={0} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-1">
          {FUNNEL_STAGES.map((stage,i) => {
            const Icon = stage.icon;
            const val = vals[stage.key];
            return (
              <div key={stage.key} className="flex flex-col items-center w-full">
                <div className="relative flex items-center justify-between px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{width:`${FUNNEL_W[i]}%`,backgroundColor:stage.color,clipPath:"polygon(4% 0,96% 0,100% 100%,0 100%)"}}>
                  <div className="flex items-center justify-center w-6 h-6 bg-white rounded">
                    <Icon className="h-3.5 w-3.5" style={{color:stage.color}} />
                  </div>
                  <span className="text-white font-bold text-sm">{val.toLocaleString()}</span>
                </div>
                <p className="text-xs mt-0.5 font-medium" style={{color:stage.color}}>
                  {stage.label}
                  {i>0&&vals.visitors>0&&(
                    <span className="text-muted-foreground ml-1">({((val/vals.visitors)*100).toFixed(1)}%)</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">Pipeline estimado</p>
          <p className="text-2xl font-bold text-green-600">
            {pipeline.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

function AnalyticsDashboard() {
  const [tab, setTab] = useState<"realtime"|"audience"|"acquisition"|"pages"|"funnel">("realtime");
  const [days, setDays] = useState(7);

  const filters = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - days*24*60*60*1000);
    return {startDate:start, endDate:end};
  }, [days]);

  const {data:topPages} = useTopPages(filters);
  const {data:deviceData} = useDeviceStats(filters);
  const {data:browserData} = useBrowserStats(filters);
  const {data:osData} = useOSStats(filters);
  const {data:countryData} = useCountryStats(filters);
  const {data:acqData} = useAcquisitionStats(filters);
  const {count:onlineCount} = useOnlineVisitors();

  const TABS = [
    {id:"realtime",label:"Tempo Real"},
    {id:"audience",label:"Audiência"},
    {id:"acquisition",label:"Aquisição"},
    {id:"pages",label:"Páginas"},
    {id:"funnel",label:"Funil"},
  ] as const;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Inteligente</h1>
          <p className="text-sm text-muted-foreground">Dados reais do sidingdepot.com · Supabase Realtime</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">{onlineCount} online agora</span>
          </div>
          <select value={days} onChange={(e)=>setDays(Number(e.target.value))}
            className="rounded border px-3 py-1.5 text-sm bg-background">
            <option value={1}>Últimas 24h</option>
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border p-1 mb-6 overflow-x-auto bg-muted/30 w-fit">
        {TABS.map((t)=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              tab===t.id?"bg-background shadow text-foreground":"text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Real-time */}
      {tab==="realtime"&&(
        <div className="space-y-6">
          <OnlineMap />
          <div className="grid gap-6 md:grid-cols-2">
            <HistoryMap />
            <PeakHoursCard />
          </div>
        </div>
      )}

      {/* Audience */}
      {tab==="audience"&&(
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5"/>Tráfego por País
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!countryData?.length?(
                <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
                  Os dados de país preencherão após visitas com geolocalização
                </div>
              ):(
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData.slice(0,10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{fontSize:11}} />
                      <YAxis type="category" dataKey="name" width={100} tick={{fontSize:11}} />
                      <Tooltip contentStyle={{backgroundColor:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"6px"}} />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0,4,4,0]} name="Visitas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <PieCard title="Dispositivos" data={deviceData} />
            <PieCard title="Navegadores" data={browserData} />
            <PieCard title="Sistemas Operacionais" data={osData} />
          </div>
        </div>
      )}

      {/* Acquisition */}
      {tab==="acquisition"&&(
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5"/>Fontes de Tráfego</CardTitle></CardHeader>
              <CardContent>
                {!acqData?.sources.length?(
                  <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">Sem dados ainda</div>
                ):(
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={acqData.sources} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                          paddingAngle={5} dataKey="value"
                          label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                          {acqData.sources.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Volume por Fonte</CardTitle></CardHeader>
              <CardContent>
                {!acqData?.sources.length?(
                  <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">Sem dados ainda</div>
                ):(
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={acqData.sources.slice(0,8)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" tick={{fontSize:11}} />
                        <YAxis type="category" dataKey="name" width={70} tick={{fontSize:11}} />
                        <Tooltip contentStyle={{backgroundColor:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"6px"}} />
                        <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0,4,4,0]} name="Visitas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Campanhas UTM</CardTitle></CardHeader>
            <CardContent>
              {!acqData?.campaigns.length?(
                <div className="py-6 text-center text-muted-foreground text-sm">
                  Sem campanhas UTM detectadas ainda
                </div>
              ):(
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fonte</TableHead><TableHead>Meio</TableHead><TableHead>Campanha</TableHead>
                      <TableHead className="text-right">Visitantes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acqData.campaigns.map((c,i)=>(
                      <TableRow key={i}>
                        <TableCell>{c.source||"—"}</TableCell>
                        <TableCell>{c.medium||"—"}</TableCell>
                        <TableCell className="font-medium">{c.campaign}</TableCell>
                        <TableCell className="text-right">{c.visitors.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pages */}
      {tab==="pages"&&(
        <Card>
          <CardHeader><CardTitle>Desempenho de Páginas — últimos {days} dias</CardTitle></CardHeader>
          <CardContent>
            {!topPages?.length?(
              <div className="py-8 text-center text-muted-foreground text-sm">
                As páginas aparecem assim que o site receber tráfego com o tracker ativo
              </div>
            ):(
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Página</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Tempo médio</TableHead>
                    <TableHead className="text-right">Scroll médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPages.map((p)=>(
                    <TableRow key={p.path}>
                      <TableCell>
                        <div className="font-medium">{p.title||p.path}</div>
                        <div className="text-xs text-muted-foreground">{p.path}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{p.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{fmtSec(p.avgTime)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-mono">{p.avgScroll}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Funnel */}
      {tab==="funnel"&&(
        <div className="max-w-lg mx-auto">
          <FunnelCard filters={filters} />
        </div>
      )}
    </div>
  );
}
