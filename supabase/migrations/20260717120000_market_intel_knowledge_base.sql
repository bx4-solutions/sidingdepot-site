-- Market Intelligence knowledge base for AI agents.
-- Additive: lives in its own `market_intel` schema, touches no site tables.
-- Fed daily from GHL closings + Cobb County cadastre. Agents read it to size
-- offers per neighborhood and allocate marketing spend.

create schema if not exists market_intel;

-- ── Neighborhoods: the target market, counted lot-by-lot from the county ──────
create table if not exists market_intel.neighborhoods (
  subdivision            text primary key,
  county                 text not null default 'Cobb',
  homes_1980_1995        integer not null,
  median_sqft            integer,
  median_bldg_value      integer,
  median_year            integer,
  est_ticket             integer,      -- size-adjusted, from $/square model
  est_market_value       bigint,       -- homes x building value
  revenue_potential_3pct integer,      -- homes x 3% x est_ticket
  deals                  integer not null default 0,   -- CRM addresses matched here
  won                    integer not null default 0,
  updated_at             timestamptz not null default now()
);

-- ── City performance: close rate + ticket, the "where to invest" table ───────
create table if not exists market_intel.city_performance (
  city           text primary key,
  deals          integer not null,
  won            integer not null,
  lost           integer not null,
  close_rate     integer,      -- percent
  ticket_median  integer,
  ticket_mean    integer,
  updated_at     timestamptz not null default now()
);

-- ── Price by job size: the offer-sizing model ($/square by house size) ───────
create table if not exists market_intel.price_by_size (
  size_band_squares text primary key,   -- '1-10','11-20','21-30','30+'
  n                 integer not null,
  ticket_median     integer,
  price_per_square  integer,
  updated_at        timestamptz not null default now()
);

-- ── Competitor coverage: which competitor sells which service in which city ──
create table if not exists market_intel.competitor_coverage (
  competitor text not null,
  city       text not null,
  service    text not null,
  updated_at timestamptz not null default now(),
  primary key (competitor, city, service)
);

-- ── Channel mix: where real customers actually come from ─────────────────────
create table if not exists market_intel.channel_mix (
  source     text primary key,
  deals      integer not null,
  updated_at timestamptz not null default now()
);

-- ── Siding material: close rate + ticket by what's on the wall today ─────────
create table if not exists market_intel.siding_material (
  current_material text primary key,
  won              integer not null,
  lost             integer not null,
  close_rate       integer,
  ticket_mean      integer,
  updated_at       timestamptz not null default now()
);

-- ── Refresh log: audit trail of the daily rebuild ────────────────────────────
create table if not exists market_intel.refresh_log (
  id          bigint generated always as identity primary key,
  ran_at      timestamptz not null default now(),
  source      text,          -- 'daily-cron' | 'manual' | 'seed'
  rows_total  integer,
  status      text,          -- 'ok' | 'error'
  notes       text
);

-- ── Agent brief: the synthesized read for AI agents (one row per neighborhood)─
-- Ranks neighborhoods by opportunity = untouched target homes x est ticket.
create or replace view market_intel.agent_brief as
select
  n.subdivision,
  n.county,
  n.homes_1980_1995                          as target_homes,
  n.median_year                              as typical_year,
  n.median_sqft                              as typical_sqft,
  n.est_ticket,
  n.revenue_potential_3pct,
  n.deals                                    as deals_so_far,
  case when n.deals = 0 then 'untapped'
       when n.deals <= 2 then 'lightly-touched'
       else 'active' end                     as coverage,
  round(n.homes_1980_1995 * n.est_ticket / 1000.0) as market_k
from market_intel.neighborhoods n
order by (case when n.deals = 0 then 1 else 0 end) desc,
         n.homes_1980_1995 * n.est_ticket desc;

comment on schema market_intel is
  'AI-agent knowledge base: neighborhood targeting, pricing, competitor coverage. Refreshed daily from GHL + Cobb cadastre. See view market_intel.agent_brief.';
