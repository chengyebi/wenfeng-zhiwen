create extension if not exists pgcrypto;

create table if not exists public.writing_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  content text not null,
  char_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sample_features (
  id uuid primary key default gen_random_uuid(),
  sample_id uuid not null references public.writing_samples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  engine_version text not null,
  features_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  engine_version text not null,
  sample_count integer not null default 0,
  total_char_count integer not null default 0,
  reliability_level text not null,
  profile_json jsonb not null,
  summary_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, engine_version)
);

create index if not exists writing_samples_user_created_idx on public.writing_samples(user_id, created_at desc);
create index if not exists sample_features_user_idx on public.sample_features(user_id);
create index if not exists style_profiles_user_idx on public.style_profiles(user_id);

alter table public.writing_samples enable row level security;
alter table public.sample_features enable row level security;
alter table public.style_profiles enable row level security;

drop policy if exists "writing_samples_select_own" on public.writing_samples;
create policy "writing_samples_select_own" on public.writing_samples
  for select using (auth.uid() = user_id);

drop policy if exists "writing_samples_insert_own" on public.writing_samples;
create policy "writing_samples_insert_own" on public.writing_samples
  for insert with check (auth.uid() = user_id);

drop policy if exists "writing_samples_update_own" on public.writing_samples;
create policy "writing_samples_update_own" on public.writing_samples
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "writing_samples_delete_own" on public.writing_samples;
create policy "writing_samples_delete_own" on public.writing_samples
  for delete using (auth.uid() = user_id);

drop policy if exists "sample_features_select_own" on public.sample_features;
create policy "sample_features_select_own" on public.sample_features
  for select using (auth.uid() = user_id);

drop policy if exists "sample_features_insert_own" on public.sample_features;
create policy "sample_features_insert_own" on public.sample_features
  for insert with check (auth.uid() = user_id);

drop policy if exists "sample_features_update_own" on public.sample_features;
create policy "sample_features_update_own" on public.sample_features
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sample_features_delete_own" on public.sample_features;
create policy "sample_features_delete_own" on public.sample_features
  for delete using (auth.uid() = user_id);

drop policy if exists "style_profiles_select_own" on public.style_profiles;
create policy "style_profiles_select_own" on public.style_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "style_profiles_insert_own" on public.style_profiles;
create policy "style_profiles_insert_own" on public.style_profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "style_profiles_update_own" on public.style_profiles;
create policy "style_profiles_update_own" on public.style_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "style_profiles_delete_own" on public.style_profiles;
create policy "style_profiles_delete_own" on public.style_profiles
  for delete using (auth.uid() = user_id);
