"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createMaintenanceEntity,
  deleteMaintenanceEntity,
  fetchMaintenanceState,
  hasMaintenanceBackend,
  updateMaintenanceEntity,
} from "./backend-client";
import { initialMaintenanceState } from "./seed";
import type {
  MaintenanceMediaAsset,
  MaintenancePokemon,
  MaintenanceRegion,
  MaintenanceState,
  MaintenanceType,
  MediaAssetFormValues,
  PokemonFormValues,
} from "./types";

const STORAGE_KEY = "hoshidex-maintenance-v1";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createId(value: string, existingIds: string[]) {
  const base = slugify(value) || "entry";
  let id = base;
  let index = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  return id;
}

function readState(): MaintenanceState {
  if (typeof window === "undefined") return initialMaintenanceState;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialMaintenanceState;

  try {
    const parsed = JSON.parse(stored) as MaintenanceState;
    return {
      regions: parsed.regions?.length ? parsed.regions : initialMaintenanceState.regions,
      types: parsed.types?.length ? parsed.types : initialMaintenanceState.types,
      pokemon: parsed.pokemon ?? initialMaintenanceState.pokemon,
      mediaAssets: parsed.mediaAssets ?? initialMaintenanceState.mediaAssets,
    };
  } catch {
    return initialMaintenanceState;
  }
}

export function useMaintenanceStore() {
  const [state, setState] = useState<MaintenanceState>(initialMaintenanceState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasMaintenanceBackend()) {
      setState(readState());
      setReady(true);
      return;
    }

    fetchMaintenanceState()
      .then(setState)
      .catch(() => setState(readState()))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || hasMaintenanceBackend()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  function syncBackend(task: () => Promise<unknown>) {
    if (!hasMaintenanceBackend()) return;
    task().catch(() => {
      // Keep the optimistic UI responsive; a future toast system can surface this failure.
    });
  }

  const regionsById = useMemo(
    () => Object.fromEntries(state.regions.map((region) => [region.id, region])),
    [state.regions],
  );
  const typesById = useMemo(
    () => Object.fromEntries(state.types.map((type) => [type.id, type])),
    [state.types],
  );

  return {
    ...state,
    ready,
    backendEnabled: hasMaintenanceBackend(),
    regionsById,
    typesById,
    createRegion(name: string) {
      const region = { id: createId(name, state.regions.map((item) => item.id)), name };
      setState((current) => ({
        ...current,
        regions: [...current.regions, region],
      }));
      syncBackend(() => createMaintenanceEntity("regions", region));
    },
    updateRegion(id: string, name: string) {
      setState((current) => ({
        ...current,
        regions: current.regions.map((region) =>
          region.id === id ? { ...region, name } : region,
        ),
      }));
      syncBackend(() => updateMaintenanceEntity("regions", id, { name }));
    },
    deleteRegion(id: string) {
      setState((current) => ({
        ...current,
        regions: current.regions.filter((region) => region.id !== id),
        pokemon: current.pokemon.filter((pokemon) => pokemon.regionId !== id),
      }));
      syncBackend(() => deleteMaintenanceEntity("regions", id));
    },
    createType(name: string) {
      const type = { id: createId(name, state.types.map((item) => item.id)), name };
      setState((current) => ({
        ...current,
        types: [...current.types, type],
      }));
      syncBackend(() => createMaintenanceEntity("types", type));
    },
    updateType(id: string, name: string) {
      setState((current) => ({
        ...current,
        types: current.types.map((type) => (type.id === id ? { ...type, name } : type)),
      }));
      syncBackend(() => updateMaintenanceEntity("types", id, { name }));
    },
    deleteType(id: string) {
      setState((current) => ({
        ...current,
        types: current.types.filter((type) => type.id !== id),
        pokemon: current.pokemon.filter(
          (pokemon) => pokemon.primaryTypeId !== id && pokemon.secondaryTypeId !== id,
        ),
      }));
      syncBackend(() => deleteMaintenanceEntity("types", id));
    },
    createPokemon(values: PokemonFormValues) {
      const pokemon = {
        ...values,
        id: createId(values.name, state.pokemon.map((item) => item.id)),
      };
      setState((current) => ({
        ...current,
        pokemon: [...current.pokemon, pokemon],
      }));
      syncBackend(() => createMaintenanceEntity("pokemon", pokemon));
    },
    updatePokemon(id: string, values: PokemonFormValues) {
      setState((current) => ({
        ...current,
        pokemon: current.pokemon.map((pokemon) =>
          pokemon.id === id ? { ...pokemon, ...values } : pokemon,
        ),
      }));
      syncBackend(() => updateMaintenanceEntity("pokemon", id, values));
    },
    deletePokemon(id: string) {
      setState((current) => ({
        ...current,
        pokemon: current.pokemon.filter((pokemon) => pokemon.id !== id),
        mediaAssets: current.mediaAssets.filter((asset) => asset.pokemonId !== id),
      }));
      syncBackend(() => deleteMaintenanceEntity("pokemon", id));
    },
    createMediaAsset(values: MediaAssetFormValues) {
      const mediaAsset = {
        ...values,
        id: createId(
          `${values.pokemonId}-${values.kind}-${values.abilityName || values.game || "asset"}`,
          state.mediaAssets.map((item) => item.id),
        ),
      };
      setState((current) => ({
        ...current,
        mediaAssets: [mediaAsset, ...current.mediaAssets],
      }));
      syncBackend(() => createMaintenanceEntity("mediaAssets", mediaAsset));
    },
    updateMediaAsset(id: string, values: MediaAssetFormValues) {
      setState((current) => ({
        ...current,
        mediaAssets: current.mediaAssets.map((asset) =>
          asset.id === id ? { ...asset, ...values } : asset,
        ),
      }));
      syncBackend(() => updateMaintenanceEntity("mediaAssets", id, values));
    },
    deleteMediaAsset(id: string) {
      setState((current) => ({
        ...current,
        mediaAssets: current.mediaAssets.filter((asset) => asset.id !== id),
      }));
      syncBackend(() => deleteMaintenanceEntity("mediaAssets", id));
    },
  };
}

export type MaintenanceStore = ReturnType<typeof useMaintenanceStore>;
export type {
  MaintenanceMediaAsset,
  MaintenancePokemon,
  MaintenanceRegion,
  MaintenanceType,
  MediaAssetFormValues,
  PokemonFormValues,
};
