import {
  DEFAULT_ADVANCED_FILTERS,
  hasActiveAdvancedFilters,
  matchesAdvancedFilters,
  type AdvancedFilters,
} from "./advanced-filters";
import { getGenerationFilter } from "./generations";
import {
  filterPokemonResource,
  filterPokemonSummary,
  getCompatibleListFilters,
  sortPokemonResources,
  type PokemonSortMode,
  type PokemonVariantFilter,
} from "./filters";
import { extractIdFromUrl, pokeApiFetch } from "./pokeapi-client";
import {
  normalizeAbility,
  createUnavailablePokemonSummary,
  normalizeEvolutionNode,
  normalizePokemonDetail,
  normalizePokemonSummary,
} from "./normalizers";
import type {
  NamedApiResource,
  PokemonDetail,
  PokemonListResponse,
  RawAbility,
  RawEvolutionChain,
  RawPokemon,
  RawPokemonSpecies,
} from "./types";

type RawListResponse = {
  results: NamedApiResource[];
};

export async function getPokemonList(options?: {
  search?: string;
  generation?: string;
  sort?: string;
  variant?: string;
  limit?: number;
  offset?: number;
  advancedFilters?: AdvancedFilters;
}): Promise<PokemonListResponse> {
  const search = options?.search?.trim().toLowerCase() ?? "";
  const requestedVariant = (options?.variant ?? "all") as PokemonVariantFilter;
  const filters = getCompatibleListFilters(options?.generation ?? "all", requestedVariant);
  const generation = getGenerationFilter(filters.generation);
  const sort = (options?.sort ?? "dex") as PokemonSortMode;
  const variant = filters.variant;
  const limit = options?.limit ?? 60;
  const offset = options?.offset ?? 0;
  const advancedFilters = options?.advancedFilters ?? DEFAULT_ADVANCED_FILTERS;
  const hasAdvancedFilters = hasActiveAdvancedFilters(advancedFilters);

  const list = await pokeApiFetch<RawListResponse>("/pokemon?limit=1500");
  const filtered = sortPokemonResources(
    list.results
    .filter((item) => {
      const id = extractIdFromUrl(item.url);
      const matchesSearch = !search || item.name.includes(search);
      const matchesGeneration = id >= generation.range[0] && id <= generation.range[1];
      return matchesSearch && matchesGeneration && filterPokemonResource(item, variant);
    }),
    sort,
  );

  const candidateLimit = hasAdvancedFilters ? Math.min(limit * 4, 120) : limit;
  const page = filtered.slice(offset, offset + candidateLimit);
  const items = (await Promise.all(
    page.map(async (item) => {
      try {
        return normalizePokemonSummary(await pokeApiFetch<RawPokemon>(item.url));
      } catch {
        return createUnavailablePokemonSummary(item);
      }
    }),
  ))
    .filter((summary) => filterPokemonSummary(summary, variant))
    .filter((summary) => matchesAdvancedFilters(summary, advancedFilters))
    .slice(0, limit);

  return {
    items,
    total: variant === "shiny" || hasAdvancedFilters ? items.length : filtered.length,
    limit,
    offset,
  };
}

export async function getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
  const pokemon = await pokeApiFetch<RawPokemon>(`/pokemon/${idOrName}`);
  const species = await pokeApiFetch<RawPokemonSpecies>(pokemon.species.url);

  const [abilities, evolutionChain] = await Promise.all([
    Promise.all(
      pokemon.abilities.map(async (abilitySlot) => {
        try {
          const ability = await pokeApiFetch<RawAbility>(abilitySlot.ability.url);
          return normalizeAbility(ability, abilitySlot.ability.name, abilitySlot.is_hidden);
        } catch {
          return normalizeAbility(null, abilitySlot.ability.name, abilitySlot.is_hidden);
        }
      }),
    ),
    pokeApiFetch<RawEvolutionChain>(species.evolution_chain.url)
      .then((chain) => normalizeEvolutionNode(chain.chain))
      .catch(() => null),
  ]);

  return normalizePokemonDetail(pokemon, species, abilities, evolutionChain);
}

export * from "./generations";
export * from "./filters";
export * from "./media";
export * from "./normalizers";
export * from "./showcase";
export * from "./types";
