-- Read model for the internal Meta Ads dashboard. The Marketing API token is
-- deliberately kept server-side; this schema is read-only for administrators.
CREATE TABLE public.meta_ads_accounts (
  account_id text PRIMARY KEY,
  display_name text NOT NULL,
  currency_code text NOT NULL DEFAULT 'USD',
  time_zone text,
  account_status text,
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meta_ads_campaign_metrics (
  account_id text NOT NULL REFERENCES public.meta_ads_accounts(account_id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  campaign_id text NOT NULL,
  campaign_name text NOT NULL,
  campaign_status text,
  objective text,
  impressions bigint NOT NULL DEFAULT 0,
  reach bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  inline_link_clicks bigint NOT NULL DEFAULT 0,
  spend numeric(14,2) NOT NULL DEFAULT 0,
  leads numeric NOT NULL DEFAULT 0,
  PRIMARY KEY (account_id, metric_date, campaign_id)
);

CREATE TABLE public.meta_ads_adset_metrics (
  account_id text NOT NULL REFERENCES public.meta_ads_accounts(account_id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  adset_id text NOT NULL,
  adset_name text NOT NULL,
  adset_status text,
  campaign_id text NOT NULL,
  campaign_name text NOT NULL,
  impressions bigint NOT NULL DEFAULT 0,
  reach bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  inline_link_clicks bigint NOT NULL DEFAULT 0,
  spend numeric(14,2) NOT NULL DEFAULT 0,
  leads numeric NOT NULL DEFAULT 0,
  PRIMARY KEY (account_id, metric_date, adset_id)
);

CREATE TABLE public.meta_ads_ad_metrics (
  account_id text NOT NULL REFERENCES public.meta_ads_accounts(account_id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  ad_id text NOT NULL,
  ad_name text NOT NULL,
  ad_status text,
  campaign_id text NOT NULL,
  campaign_name text NOT NULL,
  adset_id text NOT NULL,
  adset_name text NOT NULL,
  creative_id text,
  impressions bigint NOT NULL DEFAULT 0,
  reach bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  inline_link_clicks bigint NOT NULL DEFAULT 0,
  spend numeric(14,2) NOT NULL DEFAULT 0,
  leads numeric NOT NULL DEFAULT 0,
  PRIMARY KEY (account_id, metric_date, ad_id)
);

CREATE TABLE public.meta_ads_creatives (
  account_id text NOT NULL REFERENCES public.meta_ads_accounts(account_id) ON DELETE CASCADE,
  creative_id text NOT NULL,
  ad_id text NOT NULL,
  creative_name text,
  thumbnail_url text,
  image_url text,
  title text,
  body text,
  call_to_action_type text,
  link_url text,
  video_id text,
  raw_creative jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, creative_id, ad_id)
);

CREATE TABLE public.meta_ads_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id text REFERENCES public.meta_ads_accounts(account_id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
  records_synced integer NOT NULL DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX meta_ads_campaign_metrics_account_date_idx ON public.meta_ads_campaign_metrics(account_id, metric_date DESC);
CREATE INDEX meta_ads_adset_metrics_account_date_idx ON public.meta_ads_adset_metrics(account_id, metric_date DESC);
CREATE INDEX meta_ads_ad_metrics_account_date_idx ON public.meta_ads_ad_metrics(account_id, metric_date DESC);
CREATE INDEX meta_ads_ad_metrics_creative_idx ON public.meta_ads_ad_metrics(account_id, creative_id);

ALTER TABLE public.meta_ads_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_adset_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_ad_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view Meta Ads accounts" ON public.meta_ads_accounts FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Meta Ads campaign metrics" ON public.meta_ads_campaign_metrics FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Meta Ads adset metrics" ON public.meta_ads_adset_metrics FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Meta Ads ad metrics" ON public.meta_ads_ad_metrics FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Meta Ads creatives" ON public.meta_ads_creatives FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view Meta Ads sync runs" ON public.meta_ads_sync_runs FOR SELECT TO authenticated USING (public.is_admin());

GRANT ALL ON public.meta_ads_accounts, public.meta_ads_campaign_metrics, public.meta_ads_adset_metrics,
  public.meta_ads_ad_metrics, public.meta_ads_creatives, public.meta_ads_sync_runs TO service_role;
