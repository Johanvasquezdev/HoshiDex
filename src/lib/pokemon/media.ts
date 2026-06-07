import type { PokemonMedia, PokemonMediaInput } from "./types";

export const POKEBALL_FALLBACK =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

export function inferOfficialArtworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function inferDefaultSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function resolvePokemonMedia(input: PokemonMediaInput): PokemonMedia {
  const primary = input.officialArtwork ?? input.home ?? input.frontDefault ?? null;
  const shiny = input.officialShiny ?? input.frontShiny ?? null;

  return {
    primary,
    shiny,
    animated: input.animated,
    modelUrl: null,
    videoUrl: null,
    fallback: POKEBALL_FALLBACK,
  };
}
