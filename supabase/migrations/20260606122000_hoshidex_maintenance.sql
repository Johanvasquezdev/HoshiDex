create table if not exists public.regiones (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tipos (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.pokemones (
  id text primary key,
  name text not null,
  image_url text not null,
  region_id text not null references public.regiones(id) on update cascade on delete restrict,
  primary_type_id text not null references public.tipos(id) on update cascade on delete restrict,
  secondary_type_id text references public.tipos(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pokemon_media_assets (
  id uuid primary key default gen_random_uuid(),
  pokemon_id text not null references public.pokemones(id) on update cascade on delete cascade,
  ability_name text,
  game text,
  generation integer,
  kind text not null check (kind in ('model', 'video')),
  url text not null,
  source_url text,
  created_at timestamptz not null default now()
);

alter table public.regiones enable row level security;
alter table public.tipos enable row level security;
alter table public.pokemones enable row level security;
alter table public.pokemon_media_assets enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.regiones to anon, authenticated;
grant select, insert, update, delete on public.tipos to anon, authenticated;
grant select, insert, update, delete on public.pokemones to anon, authenticated;
grant select, insert, update, delete on public.pokemon_media_assets to anon, authenticated;

drop policy if exists "Prototype read regiones" on public.regiones;
drop policy if exists "Prototype write regiones" on public.regiones;
drop policy if exists "Prototype read tipos" on public.tipos;
drop policy if exists "Prototype write tipos" on public.tipos;
drop policy if exists "Prototype read pokemones" on public.pokemones;
drop policy if exists "Prototype write pokemones" on public.pokemones;
drop policy if exists "Prototype read pokemon media assets" on public.pokemon_media_assets;
drop policy if exists "Prototype write pokemon media assets" on public.pokemon_media_assets;

create policy "Prototype read regiones"
  on public.regiones for select
  to anon, authenticated
  using (true);

create policy "Prototype write regiones"
  on public.regiones for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "Prototype read tipos"
  on public.tipos for select
  to anon, authenticated
  using (true);

create policy "Prototype write tipos"
  on public.tipos for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "Prototype read pokemones"
  on public.pokemones for select
  to anon, authenticated
  using (true);

create policy "Prototype write pokemones"
  on public.pokemones for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "Prototype read pokemon media assets"
  on public.pokemon_media_assets for select
  to anon, authenticated
  using (true);

create policy "Prototype write pokemon media assets"
  on public.pokemon_media_assets for all
  to anon, authenticated
  using (true)
  with check (true);

insert into public.regiones (id, name) values
  ('kanto', 'Kanto'),
  ('johto', 'Johto'),
  ('hoenn', 'Hoenn'),
  ('sinnoh', 'Sinnoh'),
  ('unova', 'Unova'),
  ('kalos', 'Kalos'),
  ('alola', 'Alola'),
  ('galar', 'Galar'),
  ('paldea', 'Paldea')
on conflict (id) do update set name = excluded.name;

insert into public.tipos (id, name) values
  ('grass', 'Grass'),
  ('poison', 'Poison'),
  ('fire', 'Fire'),
  ('flying', 'Flying'),
  ('water', 'Water'),
  ('dark', 'Dark'),
  ('electric', 'Electric'),
  ('psychic', 'Psychic'),
  ('dragon', 'Dragon')
on conflict (id) do update set name = excluded.name;

insert into public.pokemones (
  id,
  name,
  image_url,
  region_id,
  primary_type_id,
  secondary_type_id
) values
  (
    'bulbasaur',
    'Bulbasaur',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    'kanto',
    'grass',
    'poison'
  ),
  (
    'charizard',
    'Charizard',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    'kanto',
    'fire',
    'flying'
  ),
  (
    'greninja',
    'Greninja',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png',
    'kalos',
    'water',
    'dark'
  )
on conflict (id) do update set
  name = excluded.name,
  image_url = excluded.image_url,
  region_id = excluded.region_id,
  primary_type_id = excluded.primary_type_id,
  secondary_type_id = excluded.secondary_type_id,
  updated_at = now();
