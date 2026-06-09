import { getGenerationForPokemonId } from "./generations";
import { POKEBALL_FALLBACK, inferDefaultSpriteUrl, resolvePokemonMedia } from "./media";
import type {
  EvolutionNode,
  PokemonBaseStats,
  PokemonAbility,
  PokemonDetail,
  PokemonShowcaseMediaAsset,
  PokemonSummary,
  RawAbility,
  RawEvolutionChainNode,
  RawPokemon,
  RawPokemonSpecies,
} from "./types";

function extractIdFromResourceUrl(url: string): number {
  const id = url.split("/").filter(Boolean).pop();
  return id ? Number(id) : 0;
}

function normalizeStatName(name: string): keyof PokemonBaseStats | null {
  if (name === "hp") return "hp";
  if (name === "attack") return "attack";
  if (name === "defense") return "defense";
  if (name === "special-attack") return "specialAttack";
  if (name === "special-defense") return "specialDefense";
  if (name === "speed") return "speed";
  return null;
}

function normalizeBaseStats(raw: RawPokemon): PokemonBaseStats {
  const stats: PokemonBaseStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  raw.stats.forEach((stat) => {
    const key = normalizeStatName(stat.stat.name);
    if (key) stats[key] = stat.base_stat;
  });

  return stats;
}

export function createUnavailablePokemonSummary(resource: {
  name: string;
  url: string;
}): PokemonSummary {
  const id = extractIdFromResourceUrl(resource.url);

  return {
    id,
    name: resource.name,
    displayName: formatPokemonName(resource.name),
    types: ["unknown"],
    generation: getGenerationForPokemonId(id),
    media: {
      primary: null,
      shiny: null,
      animated: null,
      modelUrl: null,
      videoUrl: null,
      fallback: POKEBALL_FALLBACK,
    },
    isRegionalOrSpecial: id >= 10000,
    speciesFlags: { legendary: false, mythical: false, baby: false },
    loadError: "This pokemon is temporarily unavailable.",
  };
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizePokemonSummary(raw: RawPokemon): PokemonSummary {
  return {
    id: raw.id,
    name: raw.name,
    displayName: formatPokemonName(raw.name),
    types: raw.types.map((typeSlot) => typeSlot.type.name),
    generation: getGenerationForPokemonId(raw.id),
    media: resolvePokemonMedia({
      frontDefault: raw.sprites.front_default,
      frontShiny: raw.sprites.front_shiny,
      officialArtwork: raw.sprites.other?.["official-artwork"]?.front_default ?? null,
      officialShiny: raw.sprites.other?.["official-artwork"]?.front_shiny ?? null,
      animated: raw.sprites.other?.showdown?.front_default ?? null,
      home: raw.sprites.other?.home?.front_default ?? null,
    }),
    isRegionalOrSpecial: raw.id >= 10000,
    baseStats: normalizeBaseStats(raw),
    abilityNames: raw.abilities.map((abilitySlot) => abilitySlot.ability.name),
    heightM: raw.height / 10,
    weightKg: raw.weight / 10,
    speciesFlags: { legendary: false, mythical: false, baby: false },
  };
}

export function normalizeAbility(
  rawAbility: RawAbility | null,
  fallbackName: string,
  isHidden: boolean,
): PokemonAbility {
  const englishEffect = rawAbility?.effect_entries.find(
    (entry) => entry.language.name === "en",
  );

  return {
    name: fallbackName,
    displayName: formatPokemonName(fallbackName),
    isHidden,
    effect: englishEffect?.short_effect ?? englishEffect?.effect ?? null,
  };
}

export function normalizeEvolutionNode(node: RawEvolutionChainNode): EvolutionNode {
  return {
    name: node.species.name,
    displayName: formatPokemonName(node.species.name),
    idOrName: node.species.name,
    children: node.evolves_to.map(normalizeEvolutionNode),
  };
}

export function normalizePokemonDetail(
  raw: RawPokemon,
  species: RawPokemonSpecies,
  abilities: PokemonAbility[],
  evolution: EvolutionNode | null,
  mediaAssets: PokemonShowcaseMediaAsset[] = [],
): PokemonDetail {
  const summary = normalizePokemonSummary(raw);
  const flavor = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  );
  const genus = species.genera.find((entry) => entry.language.name === "en");

  return {
    ...summary,
    heightM: raw.height / 10,
    weightKg: raw.weight / 10,
    speciesName: species.name,
    genus: genus?.genus ?? null,
    description:
      flavor?.flavor_text.replace(/\f/g, " ").replace(/\s+/g, " ").trim() ??
      "No encyclopedia description is available yet.",
    stats: raw.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
    abilities,
    mediaAssets,
    speciesFlags: {
      legendary: species.is_legendary,
      mythical: species.is_mythical,
      baby: species.is_baby,
    },
    varieties: species.varieties.map((variety) => {
      const idOrName = variety.pokemon.url.split("/").filter(Boolean).pop() ?? variety.pokemon.name;
      const numericId = Number(idOrName);
      return {
        name: variety.pokemon.name,
        displayName: formatPokemonName(variety.pokemon.name),
        idOrName,
        isDefault: variety.is_default,
        sprite: Number.isFinite(numericId)
          ? inferDefaultSpriteUrl(numericId)
          : summary.media.fallback,
      };
    }),
    evolution,
  };
}
