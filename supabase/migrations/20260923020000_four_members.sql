create table if not exists public.trip_members (
  trip_id text not null default 'nordic-2026',
  user_id uuid not null references auth.users(id) on delete cascade,
  member_id text not null check (member_id in ('wyw', 'yyy', 'yh', 'lqw')),
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id),
  unique (trip_id, member_id)
);

alter table public.trip_members enable row level security;
drop policy if exists "members read own membership" on public.trip_members;
create policy "members read own membership" on public.trip_members
for select to authenticated using (user_id = auth.uid());

insert into public.trip_members (trip_id, user_id, member_id)
select 'nordic-2026', id,
  case email
    when 'wyw@miao.miao' then 'wyw'
    when 'yyy@miao.miao' then 'yyy'
    when 'yh@miao.miao' then 'yh'
    when 'lqw@miao.miao' then 'lqw'
  end
from auth.users
where email in ('wyw@miao.miao', 'yyy@miao.miao', 'yh@miao.miao', 'lqw@miao.miao')
on conflict (trip_id, user_id) do update set member_id = excluded.member_id;

drop policy if exists "trip members read rows" on public.shared_rows;
drop policy if exists "trip members insert rows" on public.shared_rows;
drop policy if exists "trip members update rows" on public.shared_rows;
drop policy if exists "trip members delete rows" on public.shared_rows;
create policy "trip members read rows" on public.shared_rows for select to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_rows.trip_id and m.user_id = auth.uid()));
create policy "trip members insert rows" on public.shared_rows for insert to authenticated
with check (updated_by = auth.uid() and exists (select 1 from public.trip_members m where m.trip_id = shared_rows.trip_id and m.user_id = auth.uid()));
create policy "trip members update rows" on public.shared_rows for update to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_rows.trip_id and m.user_id = auth.uid()))
with check (updated_by = auth.uid() and exists (select 1 from public.trip_members m where m.trip_id = shared_rows.trip_id and m.user_id = auth.uid()));
create policy "trip members delete rows" on public.shared_rows for delete to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_rows.trip_id and m.user_id = auth.uid()));

drop policy if exists "trip members read settings" on public.shared_settings;
drop policy if exists "trip members insert settings" on public.shared_settings;
drop policy if exists "trip members update settings" on public.shared_settings;
drop policy if exists "trip members delete settings" on public.shared_settings;
create policy "trip members read settings" on public.shared_settings for select to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_settings.trip_id and m.user_id = auth.uid()));
create policy "trip members insert settings" on public.shared_settings for insert to authenticated
with check (updated_by = auth.uid() and exists (select 1 from public.trip_members m where m.trip_id = shared_settings.trip_id and m.user_id = auth.uid()));
create policy "trip members update settings" on public.shared_settings for update to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_settings.trip_id and m.user_id = auth.uid()))
with check (updated_by = auth.uid() and exists (select 1 from public.trip_members m where m.trip_id = shared_settings.trip_id and m.user_id = auth.uid()));
create policy "trip members delete settings" on public.shared_settings for delete to authenticated
using (exists (select 1 from public.trip_members m where m.trip_id = shared_settings.trip_id and m.user_id = auth.uid()));

drop policy if exists "trip members read voucher files" on storage.objects;
drop policy if exists "trip members upload voucher files" on storage.objects;
drop policy if exists "trip members update voucher files" on storage.objects;
drop policy if exists "trip members delete voucher files" on storage.objects;
create policy "trip members read voucher files" on storage.objects for select to authenticated
using (bucket_id = 'tripguide-vouchers' and exists (select 1 from public.trip_members m where m.trip_id = (storage.foldername(name))[1] and m.user_id = auth.uid()));
create policy "trip members upload voucher files" on storage.objects for insert to authenticated
with check (bucket_id = 'tripguide-vouchers' and exists (select 1 from public.trip_members m where m.trip_id = (storage.foldername(name))[1] and m.user_id = auth.uid()));
create policy "trip members update voucher files" on storage.objects for update to authenticated
using (bucket_id = 'tripguide-vouchers' and exists (select 1 from public.trip_members m where m.trip_id = (storage.foldername(name))[1] and m.user_id = auth.uid()));
create policy "trip members delete voucher files" on storage.objects for delete to authenticated
using (bucket_id = 'tripguide-vouchers' and exists (select 1 from public.trip_members m where m.trip_id = (storage.foldername(name))[1] and m.user_id = auth.uid()));
