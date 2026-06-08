import type { PokemonSummary } from "./types";

export const MAX_COMPARE_POKEMON = 4;

export function isPokemonCompared(selected: PokemonSummary[], pokemonId: number) {
  return selected.some((pokemon) => pokemon.id === pokemonId);
}

export function toggleComparedPokemon(
  selected: PokemonSummary[],
  pokemon: PokemonSummary,
) {
  if (isPokemonCompared(selected, pokemon.id)) {
    return selected.filter((item) => item.id !== pokemon.id);
  }

  if (selected.length >= MAX_COMPARE_POKEMON) return selected;
  return [...selected, pokemon];
}
