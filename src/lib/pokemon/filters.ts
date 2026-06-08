import { GENERATIONS, getGenerationFilter } from "./generations";
import { extractIdFromUrl } from "./pokeapi-client";
import type { NamedApiResource, PokemonSummary } from "./types";

export type PokemonVariantFilter = "all" | "shiny" | "regional" | "mega" | "forms";
export type PokemonSortMode = "regional-mix" | "dex" | "name" | "region";

const SPECIAL_ONLY_VARIANTS: PokemonVariantFilter[] = ["regional", "mega", "forms"];

const REGIONAL_FORM_MARKERS = [
  "alola",
  "galar",
  "hisui",
  "paldea",
  "totem",
  "starter",
  "original-cap",
  "hoenn-cap",
  "sinnoh-cap",
  "unova-cap",
  "kalos-cap",
  "alola-cap",
  "partner-cap",
  "world-cap",
];

export function filterPokemonResource(
  resource: NamedApiResource,
  filter: PokemonVariantFilter,
) {
  const id = extractIdFromUrl(resource.url);
  if (filter === "all" || filter === "shiny") return true;
  if (filter === "forms") return id >= 10000;
  if (filter === "mega") return resource.name.includes("-mega");
  if (filter === "regional") {
    return id >= 10000 && REGIONAL_FORM_MARKERS.some((marker) => resource.name.includes(marker));
  }
  return true;
}

export function isSpecialOnlyVariant(filter: PokemonVariantFilter) {
  return SPECIAL_ONLY_VARIANTS.includes(filter);
}

export function getCompatibleVariantFilter(
  generationId: string,
  filter: PokemonVariantFilter,
): PokemonVariantFilter {
  if (generationId !== "all" && generationId !== "forms" && isSpecialOnlyVariant(filter)) {
    return "all";
  }

  return filter;
}

export function getCompatibleGenerationFilter(generationId: string, filter: PokemonVariantFilter) {
  if (generationId !== "forms" && isSpecialOnlyVariant(filter)) {
    return "forms";
  }

  return generationId;
}

export function getCompatibleListFilters(generationId: string, filter: PokemonVariantFilter) {
  const compatibleGeneration =
    generationId === "all" && isSpecialOnlyVariant(filter) ? "forms" : generationId;

  return {
    generation: compatibleGeneration,
    variant: getCompatibleVariantFilter(compatibleGeneration, filter),
  };
}

export function filterPokemonSummary(summary: PokemonSummary, filter: PokemonVariantFilter) {
  if (filter === "shiny") return Boolean(summary.media.shiny);
  return true;
}

export function sortPokemonResources(resources: NamedApiResource[], sort: PokemonSortMode) {
  if (sort === "regional-mix") return sortByRegionalMix(resources);

  return [...resources].sort((left, right) => {
    if (sort === "name") return left.name.localeCompare(right.name);
    if (sort === "region") {
      const leftRegion = getGenerationFilterForResource(left.url)?.region ?? "";
      const rightRegion = getGenerationFilterForResource(right.url)?.region ?? "";
      return (
        leftRegion.localeCompare(rightRegion) ||
        extractIdFromUrl(left.url) - extractIdFromUrl(right.url)
      );
    }
    return extractIdFromUrl(left.url) - extractIdFromUrl(right.url);
  });
}

function sortByRegionalMix(resources: NamedApiResource[]) {
  const sortedByDex = sortPokemonResources(resources, "dex");
  const buckets = new Map<string, NamedApiResource[]>();
  const order = [...GENERATIONS.map((generation) => generation.id), "forms"];

  for (const resource of sortedByDex) {
    const id = extractIdFromUrl(resource.url);
    const bucketId = id >= 10000 ? "forms" : getRegionFilterIdForDexNumber(id);
    buckets.set(bucketId, [...(buckets.get(bucketId) ?? []), resource]);
  }

  const mixed: NamedApiResource[] = [];
  let cursor = 0;

  while (mixed.length < sortedByDex.length) {
    for (const bucketId of order) {
      const resource = buckets.get(bucketId)?.[cursor];
      if (resource) mixed.push(resource);
    }
    cursor += 1;
  }

  return mixed;
}

function getGenerationFilterForResource(url: string) {
  const id = extractIdFromUrl(url);
  return getGenerationFilter(id >= 10000 ? "forms" : getRegionFilterIdForDexNumber(id));
}

function getRegionFilterIdForDexNumber(id: number) {
  if (id <= 151) return "kanto";
  if (id <= 251) return "johto";
  if (id <= 386) return "hoenn";
  if (id <= 493) return "sinnoh";
  if (id <= 649) return "unova";
  if (id <= 721) return "kalos";
  if (id <= 809) return "alola";
  if (id <= 905) return "galar";
  return "paldea";
}
