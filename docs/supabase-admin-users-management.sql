-- Admin Users Management migration for Colne Sofa LTD.
-- Run this after docs/supabase-admin-security.sql.
-- It lets existing admins manage an email whitelist from /admin/users.

alter table public.admin_users
  drop constraint if exists admin_users_pkey;

alter table public.admin_users
  add column if not exists id uuid default gen_random_uuid();

update public.admin_users
set id = gen_random_uuid()
where id is null;

alter table public.admin_users
  alter column id set not null;

alter table public.admin_users
  alter column user_id drop not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_users_pkey'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_pkey primary key (id);
  end if;
end
$$;

create unique index if not exists admin_users_user_id_key
on public.admin_users (user_id)
where user_id is not null;

create unique index if not exists admin_users_email_key
on public.admin_users (lower(email));

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      or lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.current_user_is_admin());

drop policy if exists "Admins can insert admin users" on public.admin_users;
create policy "Admins can insert admin users"
on public.admin_users
for insert
to authenticated
with check (public.current_user_is_admin());

drop policy if exists "Admins can update admin users" on public.admin_users;
create policy "Admins can update admin users"
on public.admin_users
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can delete admin users" on public.admin_users;
create policy "Admins can delete admin users"
on public.admin_users
for delete
to authenticated
using (public.current_user_is_admin());

-- Re-apply admin checks through the helper function, avoiding duplicated policy logic.
drop policy if exists "Admins can manage sofas" on public.sofas;
create policy "Admins can manage sofas"
on public.sofas
for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can manage contact messages" on public.contact_submissions;
create policy "Admins can manage contact messages"
on public.contact_submissions
for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can manage quote requests" on public.quote_requests;
create policy "Admins can manage quote requests"
on public.quote_requests
for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and public.current_user_is_admin()
);

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-images'
  and public.current_user_is_admin()
)
with check (
  bucket_id = 'site-images'
  and public.current_user_is_admin()
);

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-images'
  and public.current_user_is_admin()
);
