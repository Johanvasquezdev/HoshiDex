import type { MaintenancePokemon, MaintenanceRegion, MaintenanceState, MaintenanceType } from "./types";
import { hasSupabaseConfig, supabase } from "../supabase/client";

type Entity = "pokemon" | "regions" | "types";
type EntityMap = {
  pokemon: MaintenancePokemon;
  regions: MaintenanceRegion;
  types: MaintenanceType;
};

const ENDPOINTS: Record<Entity, string> = {
  pokemon: "pokemones",
  regions: "regiones",
  types: "tipos",
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

  await throwIfSupabaseError(pokemonResult.error);
  await throwIfSupabaseError(regionsResult.error);
  await throwIfSupabaseError(typesResult.error);

  return {
    pokemon: ((pokemonResult.data ?? []) as SupabasePokemonRow[]).map(toPokemon),
    regions: (regionsResult.data ?? []) as MaintenanceRegion[],
    types: (typesResult.data ?? []) as MaintenanceType[],
  };
}

export async function fetchMaintenanceState(): Promise<MaintenanceState> {
  if (hasSupabaseConfig()) return fetchSupabaseMaintenanceState();

  const [pokemon, regions, types] = await Promise.all([
    request<MaintenancePokemon[]>(endpoint("pokemon")),
    request<MaintenanceRegion[]>(endpoint("regions")),
    request<MaintenanceType[]>(endpoint("types")),
  ]);

  return { pokemon, regions, types };
}

export async function createMaintenanceEntity<E extends Entity>(
  entity: E,
  value: EntityMap[E] | Omit<EntityMap[E], "id">,
) {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const table = ENDPOINTS[entity];
    const row = entity === "pokemon" ? toPokemonRow(value as MaintenancePokemon) : value;
    const { data, error } = await (client.from(table) as any).insert(row).select().single();

    await throwIfSupabaseError(error);
    return entity === "pokemon" ? toPokemon(data as SupabasePokemonRow) : (data as EntityMap[E]);
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
    const table = ENDPOINTS[entity];
    const row = entity === "pokemon" ? toPokemonRow(value as MaintenancePokemon) : value;
    const { data, error } = await (client.from(table) as any)
      .update(row)
      .eq("id", id)
      .select()
      .single();

    await throwIfSupabaseError(error);
    return entity === "pokemon" ? toPokemon(data as SupabasePokemonRow) : (data as EntityMap[E]);
  }

  return request<EntityMap[E]>(endpoint(entity, id), {
    method: "PUT",
    body: JSON.stringify(value),
  });
}

export async function deleteMaintenanceEntity(entity: Entity, id: string) {
  if (hasSupabaseConfig()) {
    const client = assertSupabase();
    const { error } = await (client.from(ENDPOINTS[entity]) as any).delete().eq("id", id);
    await throwIfSupabaseError(error);
    return;
  }

  await request<void>(endpoint(entity, id), { method: "DELETE" });
}
