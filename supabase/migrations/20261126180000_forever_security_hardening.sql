-- Forever security hardening
-- Generated from a read-only audit of the connected Supabase project.
-- Apply only to the matching project; this migration is also applied directly
-- to the connected project as part of the current maintenance task.

begin;

-- ---------------------------------------------------------------------------
-- 1. Shared profiles table: enable RLS and prevent client-side privilege edits.
--    Users may read and edit only their own profile. is_admin/is_banned/ban_reason
--    are intentionally not writable by client roles.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
drop policy if exists "Users can manage own profiles" on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, username, settings) on table public.profiles to authenticated;
grant update (username, settings) on table public.profiles to authenticated;

-- The auth trigger can still invoke this function; direct RPC execution is not needed.
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Forever profile rows: public-to-signed-in profile discovery remains,
--    but users cannot grant themselves roles or change ban state.
-- ---------------------------------------------------------------------------
drop policy if exists profiles_insert on public.forever_profiles;
drop policy if exists profiles_select on public.forever_profiles;
drop policy if exists profiles_select_all on public.forever_profiles;
drop policy if exists profiles_update_own on public.forever_profiles;

create policy forever_profiles_select_authenticated on public.forever_profiles
  for select to authenticated using (true);

create policy forever_profiles_insert_own on public.forever_profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

create policy forever_profiles_update_own on public.forever_profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on table public.forever_profiles from public, anon, authenticated;
grant select on table public.forever_profiles to authenticated;
grant insert (id, username) on table public.forever_profiles to authenticated;
grant update (username, last_seen, display_name, bio, avatar_emoji, status_text, hide_online)
  on table public.forever_profiles to authenticated;

-- Admin ban operations are performed through this narrowly-scoped function.
create or replace function public.forever_admin_set_ban(
  target_user_id uuid,
  should_ban boolean,
  reason text default null,
  ban_until timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null or not exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin is true
  ) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  if should_ban and coalesce(btrim(reason), '') = '' then
    raise exception 'ban reason is required' using errcode = '22023';
  end if;

  update public.forever_profiles
  set is_banned = should_ban,
      ban_reason = case when should_ban then nullif(btrim(reason), '') else null end,
      banned_until = case when should_ban then ban_until else null end
  where id = target_user_id;

  if not found then
    raise exception 'profile not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.forever_admin_set_ban(uuid, boolean, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.forever_admin_set_ban(uuid, boolean, text, timestamptz)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Restrict every Forever table to authenticated sessions. Policies below
--    retain the current product behaviour while enforcing ownership/membership.
-- ---------------------------------------------------------------------------
revoke all on table
  public.forever_profiles,
  public.forever_contacts,
  public.forever_messages,
  public.forever_channels,
  public.forever_channel_members,
  public.forever_channel_messages,
  public.forever_groups,
  public.forever_group_members,
  public.forever_group_messages,
  public.forever_reactions
from public, anon, authenticated;

grant select on public.forever_profiles to authenticated;
grant insert (id, username) on public.forever_profiles to authenticated;
grant update (username, last_seen, display_name, bio, avatar_emoji, status_text, hide_online)
  on public.forever_profiles to authenticated;

grant select, insert, update (status) on public.forever_contacts to authenticated;
grant select, insert on public.forever_messages to authenticated;

grant select, insert, update, delete on public.forever_channels to authenticated;
grant select, insert, delete on public.forever_channel_members to authenticated;
grant select, insert, delete on public.forever_channel_messages to authenticated;

grant select, insert, update, delete on public.forever_groups to authenticated;
grant select, insert, delete on public.forever_group_members to authenticated;
grant select, insert on public.forever_group_messages to authenticated;
grant select, insert, delete on public.forever_reactions to authenticated;

-- Profiles
drop policy if exists forever_profiles_select_authenticated on public.forever_profiles;
drop policy if exists forever_profiles_insert_own on public.forever_profiles;
drop policy if exists forever_profiles_update_own on public.forever_profiles;
create policy forever_profiles_select_authenticated on public.forever_profiles
  for select to authenticated using (true);
create policy forever_profiles_insert_own on public.forever_profiles
  for insert to authenticated with check (id = (select auth.uid()));
create policy forever_profiles_update_own on public.forever_profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Direct messages
drop policy if exists messages_select on public.forever_messages;
drop policy if exists messages_insert on public.forever_messages;
create policy messages_select on public.forever_messages
  for select to authenticated
  using ((select auth.uid()) = sender_id or (select auth.uid()) = receiver_id);
create policy messages_insert on public.forever_messages
  for insert to authenticated
  with check ((select auth.uid()) = sender_id);

-- Contacts: participants may see and respond; endpoint IDs are not client-updatable.
drop policy if exists contacts_select on public.forever_contacts;
drop policy if exists contacts_insert on public.forever_contacts;
drop policy if exists contacts_update on public.forever_contacts;
create policy contacts_select on public.forever_contacts
  for select to authenticated
  using ((select auth.uid()) = user_id or (select auth.uid()) = contact_id);
create policy contacts_insert on public.forever_contacts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy contacts_update on public.forever_contacts
  for update to authenticated
  using ((select auth.uid()) = user_id or (select auth.uid()) = contact_id)
  with check ((select auth.uid()) = user_id or (select auth.uid()) = contact_id);

-- Channels: all signed-in users can discover/read public channels.
drop policy if exists channels_select on public.forever_channels;
drop policy if exists channels_insert on public.forever_channels;
drop policy if exists channels_update_own on public.forever_channels;
drop policy if exists channels_delete on public.forever_channels;
create policy channels_select on public.forever_channels
  for select to authenticated using (true);
create policy channels_insert on public.forever_channels
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy channels_update_own on public.forever_channels
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy channels_delete on public.forever_channels
  for delete to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_admin is true
    )
  );

-- Channel membership and messages.
drop policy if exists cm_select on public.forever_channel_members;
drop policy if exists cm_insert on public.forever_channel_members;
drop policy if exists cm_delete on public.forever_channel_members;
drop policy if exists cm_delete_any on public.forever_channel_members;
create policy cm_select on public.forever_channel_members
  for select to authenticated using (true);
create policy cm_insert on public.forever_channel_members
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy cm_delete on public.forever_channel_members
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_admin is true
    )
  );

drop policy if exists cmsg_select on public.forever_channel_messages;
drop policy if exists cmsg_insert on public.forever_channel_messages;
drop policy if exists cmsg_delete on public.forever_channel_messages;
create policy cmsg_select on public.forever_channel_messages
  for select to authenticated using (true);
create policy cmsg_insert on public.forever_channel_messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and (
      exists (
        select 1 from public.forever_channel_members cm
        where cm.channel_id = forever_channel_messages.channel_id
          and cm.user_id = (select auth.uid())
      )
      or exists (
        select 1 from public.forever_channels ch
        where ch.id = forever_channel_messages.channel_id
          and ch.owner_id = (select auth.uid())
      )
    )
  );
create policy cmsg_delete on public.forever_channel_messages
  for delete to authenticated
  using (
    sender_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.is_admin is true
    )
  );

-- Groups
alter table public.forever_groups enable row level security;
alter table public.forever_group_members enable row level security;
alter table public.forever_group_messages enable row level security;
alter table public.forever_reactions enable row level security;

drop policy if exists forever_groups_select on public.forever_groups;
drop policy if exists forever_groups_insert on public.forever_groups;
drop policy if exists forever_groups_update on public.forever_groups;
drop policy if exists forever_groups_delete on public.forever_groups;
create policy forever_groups_select on public.forever_groups
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.forever_group_members gm
      where gm.group_id = forever_groups.id and gm.user_id = (select auth.uid())
    )
  );
create policy forever_groups_insert on public.forever_groups
  for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy forever_groups_update on public.forever_groups
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy forever_groups_delete on public.forever_groups
  for delete to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists forever_group_members_select on public.forever_group_members;
drop policy if exists forever_group_members_insert on public.forever_group_members;
drop policy if exists forever_group_members_delete on public.forever_group_members;
create policy forever_group_members_select on public.forever_group_members
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.forever_groups g
      where g.id = forever_group_members.group_id and g.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.forever_group_members gm
      where gm.group_id = forever_group_members.group_id and gm.user_id = (select auth.uid())
    )
  );
create policy forever_group_members_insert on public.forever_group_members
  for insert to authenticated
  with check (
    exists (
      select 1 from public.forever_groups g
      where g.id = forever_group_members.group_id and g.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.forever_group_members gm
      where gm.group_id = forever_group_members.group_id and gm.user_id = (select auth.uid())
    )
  );
create policy forever_group_members_delete on public.forever_group_members
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.forever_groups g
      where g.id = forever_group_members.group_id and g.owner_id = (select auth.uid())
    )
  );

drop policy if exists forever_group_messages_select on public.forever_group_messages;
drop policy if exists forever_group_messages_insert on public.forever_group_messages;
create policy forever_group_messages_select on public.forever_group_messages
  for select to authenticated
  using (
    exists (
      select 1 from public.forever_groups g
      where g.id = forever_group_messages.group_id and g.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.forever_group_members gm
      where gm.group_id = forever_group_messages.group_id and gm.user_id = (select auth.uid())
    )
  );
create policy forever_group_messages_insert on public.forever_group_messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and (
      exists (
        select 1 from public.forever_groups g
        where g.id = forever_group_messages.group_id and g.owner_id = (select auth.uid())
      )
      or exists (
        select 1 from public.forever_group_members gm
        where gm.group_id = forever_group_messages.group_id and gm.user_id = (select auth.uid())
      )
    )
  );

-- Reactions are visible only to participants who can read the referenced message.
drop policy if exists forever_reactions_select on public.forever_reactions;
drop policy if exists forever_reactions_insert on public.forever_reactions;
drop policy if exists forever_reactions_delete on public.forever_reactions;
create policy forever_reactions_select on public.forever_reactions
  for select to authenticated
  using (
    (
      message_type = 'dm'
      and exists (
        select 1 from public.forever_messages m
        where m.id = forever_reactions.message_id
          and ((select auth.uid()) = m.sender_id or (select auth.uid()) = m.receiver_id)
      )
    )
    or
    (
      message_type = 'group'
      and exists (
        select 1 from public.forever_group_messages gm
        where gm.id = forever_reactions.message_id
          and (
            exists (
              select 1 from public.forever_groups g
              where g.id = gm.group_id and g.owner_id = (select auth.uid())
            )
            or exists (
              select 1 from public.forever_group_members mem
              where mem.group_id = gm.group_id and mem.user_id = (select auth.uid())
            )
          )
      )
    )
  );
create policy forever_reactions_insert on public.forever_reactions
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      (
        message_type = 'dm'
        and exists (
          select 1 from public.forever_messages m
          where m.id = forever_reactions.message_id
            and ((select auth.uid()) = m.sender_id or (select auth.uid()) = m.receiver_id)
        )
      )
      or
      (
        message_type = 'group'
        and exists (
          select 1 from public.forever_group_messages gm
          where gm.id = forever_reactions.message_id
            and (
              exists (
                select 1 from public.forever_groups g
                where g.id = gm.group_id and g.owner_id = (select auth.uid())
              )
              or exists (
                select 1 from public.forever_group_members mem
                where mem.group_id = gm.group_id and mem.user_id = (select auth.uid())
              )
            )
        )
      )
    )
  );
create policy forever_reactions_delete on public.forever_reactions
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- Helpful indexes for the group/reaction membership checks.
create index if not exists forever_group_members_user_id_idx
  on public.forever_group_members (user_id);
create index if not exists forever_group_messages_group_id_idx
  on public.forever_group_messages (group_id);
create index if not exists forever_group_messages_sender_id_idx
  on public.forever_group_messages (sender_id);
create index if not exists forever_reactions_user_id_idx
  on public.forever_reactions (user_id);

grant usage, select on sequence
  public.forever_groups_id_seq,
  public.forever_group_members_id_seq,
  public.forever_group_messages_id_seq,
  public.forever_reactions_id_seq
to authenticated;

commit;
