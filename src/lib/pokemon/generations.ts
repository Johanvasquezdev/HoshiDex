import type { GenerationInfo } from "./types";

export const GENERATIONS: GenerationInfo[] = [
  { id: "kanto", label: "Gen 1: Kanto", generation: 1, region: "Kanto", range: [1, 151] },
  { id: "johto", label: "Gen 2: Johto", generation: 2, region: "Johto", range: [152, 251] },
  { id: "hoenn", label: "Gen 3: Hoenn", generation: 3, region: "Hoenn", range: [252, 386] },
  { id: "sinnoh", label: "Gen 4: Sinnoh", generation: 4, region: "Sinnoh", range: [387, 493] },
  { id: "unova", label: "Gen 5: Unova", generation: 5, region: "Unova", range: [494, 649] },
  { id: "kalos", label: "Gen 6: Kalos", generation: 6, region: "Kalos", range: [650, 721] },
  { id: "alola", label: "Gen 7: Alola", generation: 7, region: "Alola", range: [722, 809] },
  { id: "galar", label: "Gen 8: Galar", generation: 8, region: "Galar", range: [810, 905] },
  { id: "paldea", label: "Gen 9: Paldea", generation: 9, region: "Paldea", range: [906, 1025] },
];

export const ALL_GENERATION_FILTER = {
  id: "all",
  label: "All Regions",
  generation: 0,
  region: "National",
  range: [1, 1025] as [number, number],
};

export const SPECIAL_FORMS_FILTER = {
  id: "forms",
  label: "Regional Forms & Megas",
  generation: 0,
  region: "Special",
  range: [10000, 20000] as [number, number],
};

export const GENERATION_FILTERS = [
  ALL_GENERATION_FILTER,
  ...GENERATIONS,
  SPECIAL_FORMS_FILTER,
];

export function getGenerationForPokemonId(id: number): GenerationInfo | null {
  if (id >= SPECIAL_FORMS_FILTER.range[0]) return SPECIAL_FORMS_FILTER;
  return GENERATIONS.find((generation) => {
    return id >= generation.range[0] && id <= generation.range[1];
  }) ?? null;
}

export function getGenerationFilter(id: string) {
  return GENERATION_FILTERS.find((generation) => generation.id === id) ?? ALL_GENERATION_FILTER;
}
