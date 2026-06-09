export type NamedApiResource = {
  name: string;
  url: string;
};

export type GenerationInfo = {
  id: string;
  label: string;
  generation: number;
  region: string;
  range: [number, number];
};

export type PokemonMediaInput = {
  frontDefault: string | null;
  frontShiny: string | null;
  officialArtwork: string | null;
  officialShiny: string | null;
  animated: string | null;
  home: string | null;
};

export type PokemonMedia = {
  primary: string | null;
  shiny: string | null;
  animated: string | null;
  modelUrl: string | null;
  videoUrl: string | null;
  fallback: string;
};

export type PokemonShowcaseMediaAsset = {
  id: string;
  pokemonId: string;
  abilityName: string;
  game: string;
  generation: number | null;
  kind: "model" | "video";
  url: string;
  sourceUrl: string;
};

export type PokemonBaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type PokemonSpeciesFlags = {
  legendary: boolean;
  mythical: boolean;
  baby: boolean;
};

export type PokemonSummary = {
  id: number;
  name: string;
  displayName: string;
  types: string[];
  generation: GenerationInfo | null;
  media: PokemonMedia;
  isRegionalOrSpecial: boolean;
  baseStats?: PokemonBaseStats;
  abilityNames?: string[];
  heightM?: number;
  weightKg?: number;
  speciesFlags?: PokemonSpeciesFlags;
  loadError?: string;
};

export type PokemonListResponse = {
  items: PokemonSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonAbility = {
  name: string;
  displayName: string;
  isHidden: boolean;
  effect: string | null;
};

export type PokemonVariety = {
  name: string;
  displayName: string;
  idOrName: string;
  isDefault: boolean;
  sprite: string;
};

export type EvolutionNode = {
  name: string;
  displayName: string;
  idOrName: string;
  children: EvolutionNode[];
};

export type PokemonDetail = PokemonSummary & {
  heightM: number;
  weightKg: number;
  speciesName: string;
  genus: string | null;
  description: string;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  mediaAssets: PokemonShowcaseMediaAsset[];
  varieties: PokemonVariety[];
  evolution: EvolutionNode | null;
};

export type RawPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: NamedApiResource }[];
  species: NamedApiResource;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
        front_shiny?: string | null;
      };
      showdown?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      home?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  stats: { base_stat: number; stat: NamedApiResource }[];
  abilities: { ability: NamedApiResource; is_hidden: boolean }[];
};

export type RawPokemonSpecies = {
  name: string;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  genera: { genus: string; language: NamedApiResource }[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedApiResource;
    version: NamedApiResource;
  }[];
  varieties: {
    is_default: boolean;
    pokemon: NamedApiResource;
  }[];
  evolution_chain: { url: string };
};

export type RawAbility = {
  name: string;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedApiResource;
  }[];
};

export type RawEvolutionChain = {
  chain: RawEvolutionChainNode;
};

export type RawEvolutionChainNode = {
  species: NamedApiResource;
  evolves_to: RawEvolutionChainNode[];
};
