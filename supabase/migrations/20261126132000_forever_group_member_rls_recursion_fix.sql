-- Fix recursive RLS evaluation when inserting a group membership row.
-- Keep membership and ownership checks behind SECURITY DEFINER helpers in
-- the private schema, so policies do not recursively query protected tables.

begin;

create or replace function private.forever_is_group_owner(
  p_group_id bigint,
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $function$
  select exists (
    select 1
    from public.forever_groups g
    where g.id = p_group_id
      and g.owner_id = p_user_id
  );
$function$;

revoke all on function private.forever_is_group_owner(bigint, uuid)
  from public, anon, authenticated;
grant execute on function private.forever_is_group_owner(bigint, uuid)
  to authenticated;

drop policy if exists forever_group_members_insert
  on public.forever_group_members;

create policy forever_group_members_insert
  on public.forever_group_members
  for insert to authenticated
  with check (
    private.forever_is_group_owner(
      forever_group_members.group_id,
      (select auth.uid())
    )
    or private.forever_is_group_member(
      forever_group_members.group_id,
      (select auth.uid())
    )
  );

commit;
