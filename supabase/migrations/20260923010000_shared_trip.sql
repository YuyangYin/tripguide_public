create table if not exists public.shared_rows (
  trip_id text not null default 'nordic-2026',
  table_name text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (trip_id, table_name, id)
);

create table if not exists public.shared_settings (
  trip_id text not null default 'nordic-2026',
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (trip_id, key)
);

alter table public.shared_rows enable row level security;
alter table public.shared_settings enable row level security;

drop policy if exists "trip members read rows" on public.shared_rows;
drop policy if exists "trip members insert rows" on public.shared_rows;
drop policy if exists "trip members update rows" on public.shared_rows;
drop policy if exists "trip members delete rows" on public.shared_rows;
create policy "trip members read rows" on public.shared_rows for select to authenticated using (trip_id = 'nordic-2026');
create policy "trip members insert rows" on public.shared_rows for insert to authenticated with check (trip_id = 'nordic-2026' and updated_by = auth.uid());
create policy "trip members update rows" on public.shared_rows for update to authenticated using (trip_id = 'nordic-2026') with check (trip_id = 'nordic-2026' and updated_by = auth.uid());
create policy "trip members delete rows" on public.shared_rows for delete to authenticated using (trip_id = 'nordic-2026');

drop policy if exists "trip members read settings" on public.shared_settings;
drop policy if exists "trip members insert settings" on public.shared_settings;
drop policy if exists "trip members update settings" on public.shared_settings;
drop policy if exists "trip members delete settings" on public.shared_settings;
create policy "trip members read settings" on public.shared_settings for select to authenticated using (trip_id = 'nordic-2026');
create policy "trip members insert settings" on public.shared_settings for insert to authenticated with check (trip_id = 'nordic-2026' and updated_by = auth.uid());
create policy "trip members update settings" on public.shared_settings for update to authenticated using (trip_id = 'nordic-2026') with check (trip_id = 'nordic-2026' and updated_by = auth.uid());
create policy "trip members delete settings" on public.shared_settings for delete to authenticated using (trip_id = 'nordic-2026');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tripguide-vouchers', 'tripguide-vouchers', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic','application/pdf','text/plain'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "trip members read voucher files" on storage.objects;
drop policy if exists "trip members upload voucher files" on storage.objects;
drop policy if exists "trip members update voucher files" on storage.objects;
drop policy if exists "trip members delete voucher files" on storage.objects;
create policy "trip members read voucher files" on storage.objects for select to authenticated using (bucket_id = 'tripguide-vouchers' and (storage.foldername(name))[1] = 'nordic-2026');
create policy "trip members upload voucher files" on storage.objects for insert to authenticated with check (bucket_id = 'tripguide-vouchers' and (storage.foldername(name))[1] = 'nordic-2026');
create policy "trip members update voucher files" on storage.objects for update to authenticated using (bucket_id = 'tripguide-vouchers' and (storage.foldername(name))[1] = 'nordic-2026');
create policy "trip members delete voucher files" on storage.objects for delete to authenticated using (bucket_id = 'tripguide-vouchers' and (storage.foldername(name))[1] = 'nordic-2026');

do $$ begin alter publication supabase_realtime add table public.shared_rows; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.shared_settings; exception when duplicate_object then null; end $$;
