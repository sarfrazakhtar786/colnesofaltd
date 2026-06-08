-- Contact, quote, and repair submissions for Colne Sofa LTD.
-- Run this in Supabase SQL Editor before relying on the admin Requests inbox.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Quoted', 'Closed')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  product_model text not null,
  fabric text,
  dimensions text,
  city text,
  timeline text,
  details text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Quoted', 'Closed')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.repair_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  product_type text not null,
  issue_type text not null,
  preferred_timeline text,
  photo_url text,
  details text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Quoted', 'Closed')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.contact_submissions enable row level security;
alter table public.quote_requests enable row level security;
alter table public.repair_requests enable row level security;

create policy "Anyone can submit contact messages"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can manage contact messages"
on public.contact_submissions
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can submit quote requests"
on public.quote_requests
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can manage quote requests"
on public.quote_requests
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can submit repair requests"
on public.repair_requests
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can manage repair requests"
on public.repair_requests
for all
to authenticated
using (true)
with check (true);
