-- Last admin guard for Colne Sofa LTD.
-- Run this after docs/supabase-admin-users-management.sql.
-- It prevents deleting the final remaining admin row, even if someone bypasses the UI.

create or replace function public.prevent_last_admin_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.admin_users) <= 1 then
    raise exception 'Cannot remove the last admin user.';
  end if;

  return old;
end;
$$;

drop trigger if exists prevent_last_admin_delete_trigger on public.admin_users;

create trigger prevent_last_admin_delete_trigger
before delete on public.admin_users
for each row
execute function public.prevent_last_admin_delete();
