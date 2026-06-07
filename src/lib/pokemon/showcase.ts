import type { PokemonAbility } from "./types";

export type AbilityMediaAsset = {
  id: string;
  abilityName: string;
  label: string;
  kind: "video" | "model" | "placeholder";
  game: string;
  generationLabel: string;
  url: string | null;
  description: string;
};

export type AbilityMediaShowcase = {
  pokemonName: string;
  mainType: string;
  assets: AbilityMediaAsset[];
  hasRealMedia: boolean;
};

export function buildAbilityMediaShowcase(_input: {
  pokemonName: string;
  mainType: string;
  generationLabel: string;
  abilities: PokemonAbility[];
  modelUrl: string | null;
  videoUrl: string | null;
}): AbilityMediaShowcase {
  const input = _input;
  const realUrl = input.videoUrl ?? input.modelUrl;
  const kind = input.videoUrl ? "video" : input.modelUrl ? "model" : "placeholder";

  return {
    pokemonName: input.pokemonName,
    mainType: input.mainType,
    hasRealMedia: Boolean(realUrl),
    assets: input.abilities.map((ability) => ({
      id: `${input.pokemonName.toLowerCase()}-${ability.name}`,
      abilityName: ability.name,
      label: ability.displayName,
      kind,
      game: "Main series",
      generationLabel: input.generationLabel,
      url: realUrl,
      description:
        ability.effect ??
        `${ability.displayName} showcase slot for ${input.pokemonName}. Add a video or model URL when backend media is available.`,
    })),
  };
}
