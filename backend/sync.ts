import { sequelize } from "./config/database";
import { assertDatabaseConnection } from "./config/database";
import "./models";
import { Pokemon, PokemonMediaAsset, PokemonType, Region } from "./models";
import { seedMaintenanceCatalog } from "./seed";

async function alignDatabaseConstraints() {
  await sequelize.query(`
    do $$
    declare
      constraint_name text;
    begin
      for constraint_name in
        select conname
        from pg_constraint
        where conrelid = 'public.pokemones'::regclass
          and conname ~ '^pokemones_(region_id|primary_type_id|secondary_type_id)_fkey'
      loop
        execute format('alter table public.pokemones drop constraint %I', constraint_name);
      end loop;

      for constraint_name in
        select conname
        from pg_constraint
        where conrelid = 'public.pokemon_media_assets'::regclass
          and conname ~ '^pokemon_media_assets_pokemon_id_fkey'
      loop
        execute format('alter table public.pokemon_media_assets drop constraint %I', constraint_name);
      end loop;
    end $$;

    alter table public.pokemones
      add constraint pokemones_region_id_fkey
        foreign key (region_id)
        references public.regiones(id)
        on update cascade
        on delete restrict,
      add constraint pokemones_primary_type_id_fkey
        foreign key (primary_type_id)
        references public.tipos(id)
        on update cascade
        on delete restrict,
      add constraint pokemones_secondary_type_id_fkey
        foreign key (secondary_type_id)
        references public.tipos(id)
        on update cascade
        on delete set null;

    alter table public.pokemon_media_assets
      alter column id set default gen_random_uuid(),
      drop constraint if exists pokemon_media_assets_kind_check,
      add constraint pokemon_media_assets_pokemon_id_fkey
        foreign key (pokemon_id)
        references public.pokemones(id)
        on update cascade
        on delete cascade,
      add constraint pokemon_media_assets_kind_check
        check (kind in ('model', 'video'));
  `);
}

async function syncBackend() {
  await assertDatabaseConnection();
  await sequelize.sync({ alter: true });
  await alignDatabaseConstraints();
  await seedMaintenanceCatalog();

  const [regions, types, pokemon, mediaAssets] = await Promise.all([
    Region.count(),
    PokemonType.count(),
    Pokemon.count(),
    PokemonMediaAsset.count(),
  ]);

  console.log("Sequelize sync complete");
  console.log(`regions=${regions}`);
  console.log(`types=${types}`);
  console.log(`pokemon=${pokemon}`);
  console.log(`mediaAssets=${mediaAssets}`);
}

syncBackend()
  .catch((error) => {
    console.error("Sequelize sync failed");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
