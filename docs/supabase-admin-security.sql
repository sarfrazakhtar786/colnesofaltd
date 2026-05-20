-- Stronger admin security for Colne Sofa LTD.
-- Run this in Supabase SQL Editor after confirming the admin email below is correct.
-- Current admin email used by the project: owaisituk11@gmail.com

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
create policy "Admins can read their own admin row"
on public.admin_users
for select
to authenticated
using (
  user_id = auth.uid()
  or email = auth.jwt() ->> 'email'
);

-- Seed the known admin account. If this returns 0 inserted rows, confirm the user exists in Authentication.
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'owaisituk11@gmail.com'
on conflict (user_id) do update set email = excluded.email;

-- Helper condition used inline below:
-- exists (select 1 from public.admin_users where user_id = auth.uid())

-- Sofas/products: keep public reads, restrict writes to admins.
alter table public.sofas enable row level security;

drop policy if exists "Only logged in users can manage sofas" on public.sofas;
drop policy if exists "Admins can manage sofas" on public.sofas;
create policy "Admins can manage sofas"
on public.sofas
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Site settings: keep public reads, restrict writes to admins.
alter table public.site_settings enable row level security;

drop policy if exists "Only logged in users can manage site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Submissions: anyone can insert; only admins can read/update/delete.
alter table public.contact_submissions enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists "Authenticated users can manage contact messages" on public.contact_submissions;
drop policy if exists "Admins can manage contact messages" on public.contact_submissions;
create policy "Admins can manage contact messages"
on public.contact_submissions
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Authenticated users can manage quote requests" on public.quote_requests;
drop policy if exists "Admins can manage quote requests" on public.quote_requests;
create policy "Admins can manage quote requests"
on public.quote_requests
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Storage: public can view site images; only admins can upload/update/delete.
drop policy if exists "Authenticated users can upload site images" on storage.objects;
drop policy if exists "Authenticated users can update site images" on storage.objects;
drop policy if exists "Authenticated users can delete site images" on storage.objects;

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
)
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);
