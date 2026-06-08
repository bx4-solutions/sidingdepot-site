-- Projects table for Before/After slideshow videos hosted on Mux
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  city            text not null,
  service         text not null check (service in ('siding','painting','windows','roofing','gutters','decks','doors')),
  mux_asset_id    text,
  mux_playback_id text,
  thumbnail_url   text,
  before_label    text default 'Before',
  after_label     text default 'After',
  tags            text[] default '{}',
  featured        boolean default false,
  published       boolean default true,
  sort_order      integer default 0,
  created_at      timestamptz default now()
);

create index if not exists projects_service_idx  on public.projects(service);
create index if not exists projects_city_idx     on public.projects(city);
create index if not exists projects_featured_idx on public.projects(featured) where featured = true;

alter table public.projects enable row level security;

create policy "projects_public_read"
  on public.projects for select
  using (published = true);
