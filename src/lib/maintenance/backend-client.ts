import type {
  MaintenanceMediaAsset,
  MaintenancePokemon,
  MaintenanceRegion,
  MaintenanceState,
  MaintenanceType,
} from "./types";
import { hasSupabaseConfig, supabase } from "../supabase/client";

type Entity = "pokemon" | "regions" | "types" | "mediaAssets";
type EntityMap = {
  pokemon: MaintenancePokemon;
  regions: MaintenanceRegion;
  types: MaintenanceType;
  mediaAssets: MaintenanceMediaAsset;
};

const ENDPOINTS: Record<Entity, string> = {
  pokemon: "pokemones",
  regions: "regiones",
  types: "tipos",
  mediaAssets: "media-assets",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_POKEDEX_BACKEND_URL?.replace(/\/$/, "") ?? "";

export function hasMaintenanceBackend() {
  return hasSupabaseConfig() || Boolean(BACKEND_URL);
}

function endpoint(entity: Entity, id?: string) {
  return `${BACKEND_URL}/api/${ENDPOINTS[entity]}${id ? `/${encodeURIComponent(id)}` : ""}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

type SupabasePokemonRow = {
  id: string;
  name: string;
  image_url: string;
  region_id: string;
  primary_type_id: string;
  secondary_type_id: string | null;
};

type SupabaseMediaAssetRow = {
  id: string;
  pokemon_id: string;
  ability_name: string | null;
  game: string | null;
  generation: number | null;
  kind: "model" | "video";
  url: string;
  source_url: string | null;
};

function assertSupabase() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

function toPokemon(row: SupabasePokemonRow): MaintenancePokemon {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    regionId: row.region_id,
    primaryTypeId: row.primary_type_id,
    secondaryTypeId: row.secondary_type_id ?? "",
  };
}

function toPokemonRow(value: MaintenancePokemon | Omit<MaintenancePokemon, "id">) {
  return {
    ...("id" in value ? { id: value.id } : {}),
    name: value.name,
    image_url: value.imageUrl,
    region_id: value.regionId,
    primary_type_id: value.primaryTypeId,
    secondary_type_id: value.secondaryTypeId || null,
  };
}

function toMediaAsset(row: SupabaseMediaAssetRow): MaintenanceMediaAsset {
  return {
    id: row.id,
    pokemonId: row.pokemon_id,
    abilityName: row.ability_name ?? "",
    game: row.game ?? "",
    generation: row.generation,
    kind: row.kind,
    url: row.url,
    sourceUrl: row.source_url ?? "",
  };
}

function toMediaAssetRow(value: MaintenanceMediaAsset | Omit<MaintenanceMediaAsset, "id">) {
  return {
    ...("id" in value ? { id: value.id } : {}),
    pokemon_id: value.pokemonId,
    ability_name: value.abilityName.trim() || null,
    game: value.game.trim() || null,
    generation: value.generation,
    kind: value.kind,
    url: value.url,
    source_url: value.sourceUrl.trim() || null,
  };
}

async function throwIfSupabaseError(error: { message: string } | null) {
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
}

async function fetchSupabaseMaintenanceState(): Promise<MaintenanceState> {
  const client = assertSupabase();
  const [pokemonResult, regionsResult, typesResult] = await Promise.all([
    client.from("pokemones").select("*").order("name"),
    client.from("regiones").select("id,name").order("name"),
    client.from("tipos").select("id,name").order("name"),
  ]);
  const mediaAssetsResult = await client
    .from("pokemon_media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  await throwIfSupabaseError(pokemonResult.error);
  await throwIfSupabaseError(regionsResult.error);
  await throwIfSupabaseError(typesResult.error);
  await throwIfSupabaseError(mediaAssetsResult.error);

  return {
    pokemon: ((pokemonResult.data ?? []) as SupabasePokemonRow[]).map(toPokemon),
    regions: (regionsResult.data ?? []) as MaintenanceRegion[],
    types: (typesResult.data ?? []) as MaintenanceType[],
    mediaAssets: ((mediaAssetsResult.data ?? []) as SupabaseMediaAssetRow[]).map(toMediaAsset),
  };
}

export async function fetchMaintenanceState(): Promise<MaintenanceState> {
  if (hasSupabaseConfig()) return fetchSupabaseMaintenanceState();

  const [pokemon, regions, types, mediaAssets] = await Promise.all([
    request<MaintenancePokemon[]>(endpoint("pokemon")),
    request<MaintenanceRegion[]>(endpoint("regions")),
    request<MaintenanceType[]>(endpoint("types")),
    request<MaintenanceMediaAsset[]>(endpoint("mediaAssets")),
  ]);

  return { pokemon, regions, types, mediaAssets };
}

export async function createMaintenanceEntity<E extends Entity>(
  entity: E,
  value: EntityMap[E] | Omit<EntityMap[E], "id">,
) {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const table = entity === "mediaAssets" ? "pokemon_media_assets" : ENDPOINTS[entity];
    const row =
      entity === "pokemon"
        ? toPokemonRow(value as unknown as MaintenancePokemon)
        : entity === "mediaAssets"
          ? toMediaAssetRow(value as unknown as MaintenanceMediaAsset)
          : value;
    const { data, error } = await (client.from(table) as any).insert(row).select().single();

    await throwIfSupabaseError(error);
    if (entity === "pokemon") return toPokemon(data as SupabasePokemonRow) as EntityMap[E];
    if (entity === "mediaAssets") return toMediaAsset(data as SupabaseMediaAssetRow) as EntityMap[E];
    return data as EntityMap[E];
  }

  return request<EntityMap[E]>(endpoint(entity), {
    method: "POST",
    body: JSON.stringify(value),
  });
}

export async function updateMaintenanceEntity<E extends Entity>(
  entity: E,
  id: string,
  value: Omit<EntityMap[E], "id">,
) {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const table = entity === "mediaAssets" ? "pokemon_media_assets" : ENDPOINTS[entity];
    const row =
      entity === "pokemon"
        ? toPokemonRow(value as unknown as MaintenancePokemon)
        : entity === "mediaAssets"
          ? toMediaAssetRow(value as unknown as MaintenanceMediaAsset)
          : value;
    const { data, error } = await (client.from(table) as any)
      .update(row)
      .eq("id", id)
      .select()
      .single();

    await throwIfSupabaseError(error);
    if (entity === "pokemon") return toPokemon(data as SupabasePokemonRow) as EntityMap[E];
    if (entity === "mediaAssets") return toMediaAsset(data as SupabaseMediaAssetRow) as EntityMap[E];
    return data as EntityMap[E];
  }

  return request<EntityMap[E]>(endpoint(entity, id), {
    method: "PUT",
    body: JSON.stringify(value),
  });
}

export async function deleteMaintenanceEntity(entity: Entity, id: string) {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const table = entity === "mediaAssets" ? "pokemon_media_assets" : ENDPOINTS[entity];
    const { error } = await (client.from(table) as any).delete().eq("id", id);
    await throwIfSupabaseError(error);
    return;
  }

  await request<void>(endpoint(entity, id), { method: "DELETE" });
}

export async function fetchMediaAssetsForPokemon(pokemonId: string): Promise<MaintenanceMediaAsset[]> {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const { data, error } = await client
      .from("pokemon_media_assets")
      .select("*")
      .eq("pokemon_id", pokemonId)
      .order("created_at", { ascending: false });

    await throwIfSupabaseError(error);
    return ((data ?? []) as SupabaseMediaAssetRow[]).map(toMediaAsset);
  }

  if (!BACKEND_URL) return [];

  return request<MaintenanceMediaAsset[]>(
    `${endpoint("mediaAssets")}?pokemonId=${encodeURIComponent(pokemonId)}`,
  );
}
