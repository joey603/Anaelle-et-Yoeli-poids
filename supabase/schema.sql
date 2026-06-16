-- Exécuter ce script dans Supabase : SQL Editor → New query → Run

create table if not exists profiles (
  id text primary key,
  name text not null,
  initial_weight numeric not null default 0,
  goal_weight numeric not null default 0,
  color text not null check (color in ('rose', 'teal'))
);

create table if not exists weight_entries (
  id uuid primary key,
  profile_id text not null references profiles(id) on delete cascade,
  date date not null,
  weight numeric not null,
  change numeric,
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value text not null
);

insert into profiles (id, name, initial_weight, goal_weight, color) values
  ('yoeli', 'Yoeli', 0, 0, 'teal'),
  ('anaelle', 'Anaelle', 0, 0, 'rose')
on conflict (id) do update set name = excluded.name;

insert into app_settings (key, value) values ('active_profile_id', 'yoeli')
on conflict (key) do nothing;

alter table profiles enable row level security;
alter table weight_entries enable row level security;
alter table app_settings enable row level security;

drop policy if exists "anon_all_profiles" on profiles;
drop policy if exists "anon_all_entries" on weight_entries;
drop policy if exists "anon_all_settings" on app_settings;

create policy "anon_all_profiles" on profiles for all using (true) with check (true);
create policy "anon_all_entries" on weight_entries for all using (true) with check (true);
create policy "anon_all_settings" on app_settings for all using (true) with check (true);

alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table weight_entries;
alter publication supabase_realtime add table app_settings;
