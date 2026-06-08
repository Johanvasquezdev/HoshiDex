import { describe, expect, it } from "vitest";
import {
  DEFAULT_ADVANCED_FILTERS,
  advancedFiltersToSearchParams,
  getActiveFilterChips,
  matchesAdvancedFilters,
  type FilterablePokemon,
} from "../advanced-filters";

const pokemon = (overrides: Partial<FilterablePokemon> = {}): FilterablePokemon => ({
  types: ["grass", "dark"],
  abilityNames: ["overgrow", "protean"],
  baseStats: {
    hp: 76,
    attack: 110,
    defense: 70,
    specialAttack: 81,
    specialDefense: 70,
    speed: 123,
  },
  heightM: 1.5,
  weightKg: 31.2,
  speciesFlags: { legendary: false, mythical: false, baby: false },
  ...overrides,
});

describe("advanced filters", () => {
  it("serializes only active filters", () => {
    const params = advancedFiltersToSearchParams({
      ...DEFAULT_ADVANCED_FILTERS,
      types: ["grass", "fire"],
      ability: "protean",
      minSpeed: 90,
    });

    expect(params.get("types")).toBe("grass,fire");
    expect(params.get("ability")).toBe("protean");
    expect(params.get("minSpeed")).toBe("90");
    expect(params.has("maxSpeed")).toBe(false);
  });

  it("matches type, ability, stats, and body ranges", () => {
    expect(
      matchesAdvancedFilters(pokemon(), {
        ...DEFAULT_ADVANCED_FILTERS,
        types: ["grass"],
        ability: "prot",
        minSpeed: 120,
        maxWeight: 40,
      }),
    ).toBe(true);

    expect(
      matchesAdvancedFilters(pokemon(), {
        ...DEFAULT_ADVANCED_FILTERS,
        types: ["water"],
      }),
    ).toBe(false);
  });

  it("creates active filter chips", () => {
    expect(
      getActiveFilterChips({
        ...DEFAULT_ADVANCED_FILTERS,
        types: ["grass"],
        legendary: true,
        minAttack: 100,
      }).map((chip) => chip.label),
    ).toEqual(["Type: grass", "Legendary", "Attack >= 100"]);
  });
});
