export type StatKey =
  | "hp"
  | "attack"
  | "defense"
  | "specialAttack"
  | "specialDefense"
  | "speed";

export type AdvancedFilters = {
  types: string[];
  ability: string;
  minHp: number | null;
  maxHp: number | null;
  minAttack: number | null;
  maxAttack: number | null;
  minDefense: number | null;
  maxDefense: number | null;
  minSpecialAttack: number | null;
  maxSpecialAttack: number | null;
  minSpecialDefense: number | null;
  maxSpecialDefense: number | null;
  minSpeed: number | null;
  maxSpeed: number | null;
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  legendary: boolean;
  mythical: boolean;
  baby: boolean;
};

export type FilterablePokemon = {
  types: string[];
  abilityNames?: string[];
  baseStats?: Record<StatKey, number>;
  heightM?: number;
  weightKg?: number;
  speciesFlags?: {
    legendary: boolean;
    mythical: boolean;
    baby: boolean;
  };
};

export type ActiveFilterChip = {
  id: string;
  label: string;
};

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  types: [],
  ability: "",
  minHp: null,
  maxHp: null,
  minAttack: null,
  maxAttack: null,
  minDefense: null,
  maxDefense: null,
  minSpecialAttack: null,
  maxSpecialAttack: null,
  minSpecialDefense: null,
  maxSpecialDefense: null,
  minSpeed: null,
  maxSpeed: null,
  minHeight: null,
  maxHeight: null,
  minWeight: null,
  maxWeight: null,
  legendary: false,
  mythical: false,
  baby: false,
};

const RANGE_FILTERS: Array<{
  minKey: keyof AdvancedFilters;
  maxKey: keyof AdvancedFilters;
  statKey?: StatKey;
  bodyKey?: "height" | "weight";
  label: string;
}> = [
  { minKey: "minHp", maxKey: "maxHp", statKey: "hp", label: "HP" },
  { minKey: "minAttack", maxKey: "maxAttack", statKey: "attack", label: "Attack" },
  { minKey: "minDefense", maxKey: "maxDefense", statKey: "defense", label: "Defense" },
  {
    minKey: "minSpecialAttack",
    maxKey: "maxSpecialAttack",
    statKey: "specialAttack",
    label: "Sp. Attack",
  },
  {
    minKey: "minSpecialDefense",
    maxKey: "maxSpecialDefense",
    statKey: "specialDefense",
    label: "Sp. Defense",
  },
  { minKey: "minSpeed", maxKey: "maxSpeed", statKey: "speed", label: "Speed" },
  { minKey: "minHeight", maxKey: "maxHeight", bodyKey: "height", label: "Height" },
  { minKey: "minWeight", maxKey: "maxWeight", bodyKey: "weight", label: "Weight" },
];

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function getNumber(value: AdvancedFilters[keyof AdvancedFilters]) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function matchesRange(value: number | undefined, min: number | null, max: number | null) {
  if (min === null && max === null) return true;
  if (typeof value !== "number") return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

export function advancedFiltersToSearchParams(filters: AdvancedFilters) {
  const params = new URLSearchParams();

  if (filters.types.length > 0) params.set("types", filters.types.join(","));
  if (filters.ability.trim()) params.set("ability", filters.ability.trim());

  RANGE_FILTERS.forEach(({ minKey, maxKey }) => {
    const min = getNumber(filters[minKey]);
    const max = getNumber(filters[maxKey]);
    if (min !== null) params.set(String(minKey), String(min));
    if (max !== null) params.set(String(maxKey), String(max));
  });

  if (filters.legendary) params.set("legendary", "true");
  if (filters.mythical) params.set("mythical", "true");
  if (filters.baby) params.set("baby", "true");

  return params;
}

export function parseAdvancedFilters(searchParams: URLSearchParams): AdvancedFilters {
  const numberParam = (key: keyof AdvancedFilters) => {
    const value = searchParams.get(String(key));
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    ...DEFAULT_ADVANCED_FILTERS,
    types: (searchParams.get("types") ?? "")
      .split(",")
      .map((type) => type.trim().toLowerCase())
      .filter(Boolean),
    ability: searchParams.get("ability") ?? "",
    minHp: numberParam("minHp"),
    maxHp: numberParam("maxHp"),
    minAttack: numberParam("minAttack"),
    maxAttack: numberParam("maxAttack"),
    minDefense: numberParam("minDefense"),
    maxDefense: numberParam("maxDefense"),
    minSpecialAttack: numberParam("minSpecialAttack"),
    maxSpecialAttack: numberParam("maxSpecialAttack"),
    minSpecialDefense: numberParam("minSpecialDefense"),
    maxSpecialDefense: numberParam("maxSpecialDefense"),
    minSpeed: numberParam("minSpeed"),
    maxSpeed: numberParam("maxSpeed"),
    minHeight: numberParam("minHeight"),
    maxHeight: numberParam("maxHeight"),
    minWeight: numberParam("minWeight"),
    maxWeight: numberParam("maxWeight"),
    legendary: searchParams.get("legendary") === "true",
    mythical: searchParams.get("mythical") === "true",
    baby: searchParams.get("baby") === "true",
  };
}

export function hasActiveAdvancedFilters(filters: AdvancedFilters) {
  return getActiveFilterChips(filters).length > 0;
}

export function matchesAdvancedFilters(pokemon: FilterablePokemon, filters: AdvancedFilters) {
  if (
    filters.types.length > 0 &&
    !filters.types.every((type) => pokemon.types.includes(type))
  ) {
    return false;
  }

  const ability = filters.ability.trim().toLowerCase();
  if (
    ability &&
    !pokemon.abilityNames?.some((pokemonAbility) => pokemonAbility.toLowerCase().includes(ability))
  ) {
    return false;
  }

  for (const range of RANGE_FILTERS) {
    const value = range.statKey
      ? pokemon.baseStats?.[range.statKey]
      : range.bodyKey
        ? pokemon[range.bodyKey === "height" ? "heightM" : "weightKg"]
        : undefined;
    if (
      !matchesRange(
        value,
        getNumber(filters[range.minKey]),
        getNumber(filters[range.maxKey]),
      )
    ) {
      return false;
    }
  }

  if (filters.legendary && !pokemon.speciesFlags?.legendary) return false;
  if (filters.mythical && !pokemon.speciesFlags?.mythical) return false;
  if (filters.baby && !pokemon.speciesFlags?.baby) return false;

  return true;
}

export function getActiveFilterChips(filters: AdvancedFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  filters.types.forEach((type) => chips.push({ id: `type:${type}`, label: `Type: ${type}` }));
  if (filters.ability.trim()) {
    chips.push({ id: "ability", label: `Ability: ${filters.ability.trim()}` });
  }

  if (filters.legendary) chips.push({ id: "legendary", label: "Legendary" });
  if (filters.mythical) chips.push({ id: "mythical", label: "Mythical" });
  if (filters.baby) chips.push({ id: "baby", label: "Baby" });

  RANGE_FILTERS.forEach(({ minKey, maxKey, label }) => {
    const min = getNumber(filters[minKey]);
    const max = getNumber(filters[maxKey]);
    if (min !== null) chips.push({ id: String(minKey), label: `${label} >= ${min}` });
    if (max !== null) chips.push({ id: String(maxKey), label: `${label} <= ${max}` });
  });

  return chips;
}
