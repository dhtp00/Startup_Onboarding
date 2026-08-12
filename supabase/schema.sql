create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('coach','startup')),
  name text not null,
  company_id bigint unique
);

create table if not exists public.companies (
  id bigint primary key,
  representative text not null,
  login_email text unique not null,
  invitation_key text unique not null,
  invitation_key_used boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles add constraint profiles_company_fk foreign key (company_id) references public.companies(id) on delete set null;

create table if not exists public.program_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  board text not null check (board in ('program','integrated')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_coach() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'coach');
$$;

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.program_config enable row level security;
alter table public.notices enable row level security;

create policy "profiles_self_or_coach_read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_coach());
create policy "profiles_coach_update" on public.profiles for update to authenticated using (public.is_coach()) with check (public.is_coach());

create policy "companies_scoped_read" on public.companies for select to authenticated using (
  public.is_coach() or id = (select company_id from public.profiles where profiles.id = auth.uid())
);
create policy "companies_scoped_update" on public.companies for update to authenticated using (
  public.is_coach() or id = (select company_id from public.profiles where profiles.id = auth.uid())
) with check (
  public.is_coach() or id = (select company_id from public.profiles where profiles.id = auth.uid())
);
create policy "companies_coach_insert" on public.companies for insert to authenticated with check (public.is_coach());
create policy "companies_coach_delete" on public.companies for delete to authenticated using (public.is_coach());

create policy "config_authenticated_read" on public.program_config for select to authenticated using (true);
create policy "config_coach_write" on public.program_config for all to authenticated using (public.is_coach()) with check (public.is_coach());

create policy "notices_authenticated_read" on public.notices for select to authenticated using (true);
create policy "notices_coach_write" on public.notices for all to authenticated using (public.is_coach()) with check (public.is_coach());

revoke all on public.profiles, public.companies, public.program_config, public.notices from anon;
grant select on public.profiles, public.companies, public.program_config, public.notices to authenticated;
grant insert, update, delete on public.profiles, public.companies, public.program_config, public.notices to authenticated;

insert into public.program_config(key, value) values
  ('coach_name', '"전담코치"'::jsonb),
  ('edu_names', '{"hr":"1차 교육","accounting":"2차 교육","law":"3차 교육"}'::jsonb)
on conflict (key) do nothing;
