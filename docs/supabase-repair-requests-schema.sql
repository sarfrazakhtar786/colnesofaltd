-- Repair requests for Colne Sofa LTD.
-- Run this in Supabase SQL Editor to enable saving repair requests in the admin inbox.

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

alter table public.repair_requests enable row level security;

drop policy if exists "Anyone can submit repair requests" on public.repair_requests;
create policy "Anyone can submit repair requests"
on public.repair_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can manage repair requests" on public.repair_requests;
create policy "Authenticated users can manage repair requests"
on public.repair_requests
for all
to authenticated
using (true)
with check (true);
