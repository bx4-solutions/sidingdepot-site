-- Align the persisted lead schema with the live site → GHL sync contract.
-- All additions are nullable so historical leads remain intact.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS visitor_id text,
  ADD COLUMN IF NOT EXISTS device_type text,
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS ghl_contact_id text,
  ADD COLUMN IF NOT EXISTS ghl_opportunity_id text,
  ADD COLUMN IF NOT EXISTS ghl_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS opportunity_status text,
  ADD COLUMN IF NOT EXISTS pipeline_stage text,
  ADD COLUMN IF NOT EXISTS opportunity_value numeric,
  ADD COLUMN IF NOT EXISTS close_date timestamptz;

CREATE INDEX IF NOT EXISTS leads_ghl_opportunity_id_idx
  ON public.leads(ghl_opportunity_id)
  WHERE ghl_opportunity_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS leads_utm_campaign_created_at_idx
  ON public.leads(utm_campaign, created_at DESC)
  WHERE utm_campaign IS NOT NULL;
