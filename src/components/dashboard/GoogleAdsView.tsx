import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CircleDollarSign, MousePointerClick, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGoogleAdsDashboard } from "@/lib/google-ads-dashboard.functions";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function GoogleAdsView({ startDate, endDate }: { startDate: string; endDate: string }) {
  const [customerId, setCustomerId] = useState<string>();
  const query = useQuery({
    queryKey: ["google-ads-dashboard", startDate, endDate, customerId],
    queryFn: () => getGoogleAdsDashboard({ data: { startDate, endDate, customerId } }),
  });
  const data = query.data;
  useEffect(() => {
    if (customerId || !data?.configured) return;
    const defaultAccount = data.accounts.find((account: any) => account.customer_id === data.defaultCustomerId) || data.accounts[0];
    if (defaultAccount) setCustomerId(defaultAccount.customer_id);
  }, [customerId, data]);
  if (query.isLoading) return <div className="py-16 text-center text-slate-400">Carregando Google Ads...</div>;
  if (!data?.configured) return <Card className="bg-[#131921] border-white/10"><CardHeader><CardTitle>Google Ads</CardTitle><CardDescription>Aguardando conexão segura do Google Ads.</CardDescription></CardHeader><CardContent className="text-sm text-slate-400">O dashboard é somente leitura. As operações de campanha são realizadas em ambiente administrativo seguro.</CardContent></Card>;
  if (!customerId) return <div className="py-16 text-center text-slate-400">Preparando contas do Google Ads...</div>;
  const cards = [
    ["Investimento", usd.format(data.totals.costMicros / 1_000_000), CircleDollarSign], ["Impressões", data.totals.impressions.toLocaleString(), BarChart3],
    ["Cliques", data.totals.clicks.toLocaleString(), MousePointerClick], ["Conversões", data.totals.conversions.toLocaleString(undefined, { maximumFractionDigits: 1 }), Target],
  ] as const;
  return <div className="space-y-6 animate-in fade-in duration-500"><Card className="bg-[#131921] border-white/10"><CardContent className="flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase text-slate-400">Conta do Google Ads</p><p className="text-sm text-slate-400">Os dados abaixo pertencem somente à conta escolhida.</p></div><select aria-label="Conta do Google Ads" value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="rounded-md border border-white/10 bg-[#0d131b] px-3 py-2 text-sm font-semibold text-white"><>{data.accounts.map((account: any) => <option key={account.customer_id} value={account.customer_id}>{`${account.customer_id.slice(0, 3)}-${account.customer_id.slice(3, 6)}-${account.customer_id.slice(6)}${account.display_name ? ` — ${account.display_name}` : ""}`}</option>)}</></select></CardContent></Card><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(([label, value, Icon]) => <Card key={label} className="bg-[#131921] border-white/10"><CardContent className="pt-5"><Icon className="h-4 w-4 text-sd-green mb-3" /><p className="text-xs text-slate-400 uppercase font-bold">{label}</p><p className="text-2xl font-black">{value}</p></CardContent></Card>)}</div><Card className="bg-[#131921] border-white/10"><CardHeader><CardTitle>Campanhas</CardTitle><CardDescription>Leitura apenas — atualizado pela sincronização segura.</CardDescription></CardHeader><CardContent><div className="space-y-3">{data.campaigns.slice(0, 10).map((campaign: any) => <div key={campaign.id} className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/5 pb-3 text-sm"><div><p className="font-bold">{campaign.name}</p><p className="text-xs text-slate-400">{campaign.channel || "—"} · {campaign.status}</p></div><div className="text-right"><p>{usd.format(campaign.costMicros / 1_000_000)}</p><p className="text-xs text-slate-400">{campaign.clicks.toLocaleString()} cliques</p></div><div className="text-right text-sd-green font-bold">{campaign.conversions.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div></div>)}</div></CardContent></Card></div>;
}
