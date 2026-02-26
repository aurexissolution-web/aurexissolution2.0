create table if not exists public.services (
  id text primary key,
  title text not null,
  icon text not null,
  description text not null,
  features text[] not null default '{}',
  price text not null
);

create table if not exists public.service_details (
  id text primary key references public.services(id) on delete cascade,
  tagline text not null,
  long_description text not null,
  benefits jsonb[] default '{}',
  process jsonb[] default '{}',
  technologies text[] default '{}',
  hero_content jsonb,
  challenge_content jsonb,
  cta_content jsonb,
  faq_items jsonb[]
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text not null,
  company text not null,
  content text not null,
  rating int not null
);

create table if not exists public.pricing_tiers (
  id text primary key,
  name text not null,
  price text not null,
  note text,
  features text[] not null default '{}',
  recommended boolean default false
);

create table if not exists public.faqs (
  id text primary key,
  q text not null,
  a text not null
);

create table if not exists public.site_settings (
  key text primary key,
  data jsonb not null
);

create table if not exists public.pricing_pages (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  summary text not null,
  category text not null check (category in ('ai','web','cloud','data','ecommerce','automation')),
  tech text[] not null default '{}',
  duration_days int not null default 0,
  link text,
  image text,
  showcase_images text[] default '{}',
  featured boolean default false,
  "order" int
);

create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text not null,
  author text not null,
  image_url text,
  status text not null check (status in ('draft','published')),
  tags text[] default '{}',
  generated_from text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.service_details enable row level security;
alter table public.testimonials enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.pricing_pages enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;

create policy "Public read" on public.services for select using (true);
create policy "Public read" on public.service_details for select using (true);
create policy "Public read" on public.testimonials for select using (true);
create policy "Public read" on public.pricing_tiers for select using (true);
create policy "Public read" on public.faqs for select using (true);
create policy "Public read" on public.site_settings for select using (true);
create policy "Public read" on public.pricing_pages for select using (true);
create policy "Public read" on public.projects for select using (true);
create policy "Public read" on public.blog_posts for select using (true);

create policy "Authenticated write" on public.services for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.service_details for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.testimonials for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.pricing_tiers for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.faqs for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.site_settings for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.pricing_pages for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.projects for all to authenticated using (true) with check (true);
create policy "Authenticated write" on public.blog_posts for all to authenticated using (true) with check (true);
