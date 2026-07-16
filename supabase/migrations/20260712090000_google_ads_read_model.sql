-- Read model for the internal Google Ads dashboard. OAuth credentials remain in
-- server-side environment variables; no credential or mutation control is exposed here.
CREATE TABLE IF NOT EXISTS public.google_ads_accounts (
  customer_id text PRIMARY KEY,
  display_name text NOT NULL,
  currency_code text,
  time_zone text,
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.google_ads_daily_metrics (
  customer_id text NOT NULL REFERENCES public.google_ads_accounts(customer_id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  cost_micros bigint NOT NULL DEFAULT 0,
  conversions numeric NOT NULL DEFAULT 0,
  conversion_value numeric NOT NULL DEFAULT 0,
  PRIMARY KEY (customer_id, metric_date)
);

CREATE TABLE IF NOT EXISTS public.google_ads_campaign_metrics (
  customer_id text NOT NULL REFERENCES public.google_ads_accounts(customer_id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  campaign_id text NOT NULL,
  campaign_name text NOT NULL,
  campaign_status text NOT NULL,
  campaign_channel_type text,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  cost_micros bigint NOT NULL DEFAULT 0,
  conversions numeric NOT NULL DEFAULT 0,
  conversion_value numeric NOT NULL DEFAULT 0,
  PRIMARY KEY (customer_id, metric_date, campaign_id)
);

CREATE TABLE IF NOT EXISTS public.google_ads_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text REFERENCES public.google_ads_accounts(customer_id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
  records_synced integer NOT NULL DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS google_ads_campaign_metrics_customer_date_idx
  ON public.google_ads_campaign_metrics(customer_id, metric_date DESC);

ALTER TABLE public.google_ads_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_ads_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_ads_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_ads_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view Google Ads accounts" ON public.google_ads_accounts
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Google Ads daily metrics" ON public.google_ads_daily_metrics
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Google Ads campaign metrics" ON public.google_ads_campaign_metrics
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Google Ads sync runs" ON public.google_ads_sync_runs
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT ALL ON public.google_ads_accounts, public.google_ads_daily_metrics,
  public.google_ads_campaign_metrics, public.google_ads_sync_runs TO service_role;
