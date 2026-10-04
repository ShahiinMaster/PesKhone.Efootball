-- eFootball Cup Online / Supabase schema
create table if not exists public.cups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  capacity integer not null check (capacity in (4,8,16,32)),
  fee text default 'رایگان',
  prize text default '-',
  starts_at timestamptz,
  host_name text,
  status text default 'open' check (status in ('open','full','running','finished')),
  created_at timestamptz default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  cup_id uuid not null references public.cups(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(cup_id,name)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  cup_id uuid not null references public.cups(id) on delete cascade,
  round integer not null default 1,
  position integer not null,
  player_a text,
  player_b text,
  score_a integer,
  score_b integer,
  winner text,
  created_at timestamptz default now()
);

alter table public.cups enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;

create policy "public read cups" on public.cups for select using (true);
create policy "owners insert cups" on public.cups for insert with check (auth.uid()=owner_id);
create policy "owners update cups" on public.cups for update using (auth.uid()=owner_id);
create policy "public read players" on public.players for select using (true);
create policy "public register players" on public.players for insert with check (true);
create policy "public read matches" on public.matches for select using (true);
create policy "owners manage matches" on public.matches for all using (
  exists(select 1 from public.cups c where c.id=cup_id and c.owner_id=auth.uid())
);
