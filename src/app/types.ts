export interface PokemonListResult {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  species: { name: string; url: string };
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny?: string;
      };
      showdown: {
        front_default: string;
        front_shiny: string;
      };
      home: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  weight: number;
  height: number;
  abilities: { ability: { name: string }, is_hidden: boolean }[];
}

export interface PokemonSpecies {
  name: string;
  flavor_text_entries: { flavor_text: string, language: { name: string } }[];
  color: { name: string };
  varieties: {
    is_default: boolean;
    pokemon: { name: string; url: string };
  }[];
}
