-- Adds columns needed for full bidirectional GHL sync:
--   1. Extra attribution fields not yet captured (utm_content, utm_term, landing_page,
--      referrer, visitor_id, device_type, browser, os).
--   2. GHL linkage + pipeline sync-back (ghl_contact_id, ghl_opportunity_id,
--      pipeline_stage, opportunity_status, opportunity_value, close_date).
alter table public.leads
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_page text,
  add column if not exists referrer text,
  add column if not exists visitor_id text,
  add column if not exists device_type text,
  add column if not exists browser text,
  add column if not exists os text,
  add column if not exists ghl_contact_id text,
  add column if not exists ghl_opportunity_id text,
  add column if not exists pipeline_stage text,
  add column if not exists opportunity_status text,
  add column if not exists opportunity_value numeric,
  add column if not exists close_date timestamptz,
  add column if not exists ghl_synced_at timestamptz;

create index if not exists leads_ghl_contact_id_idx on public.leads (ghl_contact_id);
create index if not exists leads_ghl_opportunity_id_idx on public.leads (ghl_opportunity_id);
