import type { PokemonAbility, PokemonShowcaseMediaAsset } from "./types";

export type AbilityMediaAsset = {
  id: string;
  abilityName: string;
  label: string;
  kind: "video" | "model" | "placeholder";
  game: string;
  generationLabel: string;
  url: string | null;
  sourceUrl: string | null;
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
  mediaAssets?: PokemonShowcaseMediaAsset[];
}): AbilityMediaShowcase {
  const input = _input;
  const fallbackAssets: PokemonShowcaseMediaAsset[] = [
    ...(input.videoUrl
      ? [
          {
            id: `${input.pokemonName.toLowerCase()}-legacy-video`,
            pokemonId: input.pokemonName.toLowerCase(),
            abilityName: "",
            game: "Main series",
            generation: null,
            kind: "video" as const,
            url: input.videoUrl,
            sourceUrl: "",
          },
        ]
      : []),
    ...(input.modelUrl
      ? [
          {
            id: `${input.pokemonName.toLowerCase()}-legacy-model`,
            pokemonId: input.pokemonName.toLowerCase(),
            abilityName: "",
            game: "Main series",
            generation: null,
            kind: "model" as const,
            url: input.modelUrl,
            sourceUrl: "",
          },
        ]
      : []),
  ];
  const realAssets = input.mediaAssets?.length ? input.mediaAssets : fallbackAssets;
  const abilityByName = new Map(input.abilities.map((ability) => [ability.name, ability]));

  const mappedRealAssets = realAssets.map((asset) => {
    const ability = asset.abilityName ? abilityByName.get(asset.abilityName) : undefined;
    const labelBase = ability?.displayName ?? (asset.abilityName ? asset.abilityName : input.pokemonName);

    return {
      id: asset.id,
      abilityName: asset.abilityName,
      label: `${labelBase} ${asset.kind === "video" ? "video" : "model"}`,
      kind: asset.kind,
      game: asset.game || "Main series",
      generationLabel: asset.generation ? `Generation ${asset.generation}` : input.generationLabel,
      url: asset.url,
      sourceUrl: asset.sourceUrl || null,
      description:
        ability?.effect ??
        `${asset.kind === "video" ? "Video" : "3D model"} asset for ${labelBase}.`,
    };
  });

  const coveredAbilityNames = new Set(realAssets.map((asset) => asset.abilityName).filter(Boolean));
  const placeholderAssets = input.abilities
    .filter((ability) => !coveredAbilityNames.has(ability.name))
    .map((ability) => ({
      id: `${input.pokemonName.toLowerCase()}-${ability.name}-placeholder`,
      abilityName: ability.name,
      label: ability.displayName,
      kind: "placeholder" as const,
      game: "Main series",
      generationLabel: input.generationLabel,
      url: null,
      sourceUrl: null,
      description:
        ability.effect ??
        `${ability.displayName} showcase slot for ${input.pokemonName}. Add a video or model URL when backend media is available.`,
    }));

  return {
    pokemonName: input.pokemonName,
    mainType: input.mainType,
    hasRealMedia: mappedRealAssets.length > 0,
    assets: [...mappedRealAssets, ...placeholderAssets],
  };
}
