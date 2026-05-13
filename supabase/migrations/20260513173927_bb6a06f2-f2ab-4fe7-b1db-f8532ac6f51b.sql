-- Tabelas para Campanhas e Metas
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    target_revenue DECIMAL(12,2) DEFAULT 0,
    current_revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaign_metrics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reach INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(campaign_id, date)
);

-- Métricas Gerais de Tráfego (Visão Geral)
CREATE TABLE IF NOT EXISTS public.traffic_metrics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    avg_session_duration INTERVAL,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    appointments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fontes de Tráfego (Aquisição)
CREATE TABLE IF NOT EXISTS public.traffic_sources_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    source TEXT NOT NULL, -- organic, direct, social, email, etc.
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(date, source)
);

CREATE TABLE IF NOT EXISTS public.utm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conv_rate DECIMAL(5,2) DEFAULT 0,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(utm_source, utm_medium, utm_campaign)
);

-- Alertas
CREATE TABLE IF NOT EXISTS public.alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    metric TEXT NOT NULL, -- e.g., 'traffic_drop', 'conv_rate_low'
    threshold DECIMAL(12,2) NOT NULL,
    comparison_operator TEXT NOT NULL, -- '<', '>', '<=', '>='
    time_window_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    metric_value DECIMAL(12,2) NOT NULL,
    threshold_value DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'unread', -- unread, read
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS e Políticas de Segurança
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_sources_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Políticas usando is_admin() já existente no projeto
CREATE POLICY "Admins have full access to campaigns" ON public.campaigns 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to campaign_metrics" ON public.campaign_metrics_daily 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to traffic_metrics" ON public.traffic_metrics_daily 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to traffic_sources" ON public.traffic_sources_daily 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to utm_campaigns" ON public.utm_campaigns 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to alert_rules" ON public.alert_rules 
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to alert_history" ON public.alert_history 
    FOR ALL TO authenticated USING (public.is_admin());

-- Gatilhos para updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON public.alert_rules 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
