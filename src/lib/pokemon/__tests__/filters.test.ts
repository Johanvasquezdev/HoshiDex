import { describe, expect, it } from "vitest";
import {
  filterPokemonResource,
  getCompatibleGenerationFilter,
  getCompatibleListFilters,
  getCompatibleVariantFilter,
  sortPokemonResources,
  type PokemonVariantFilter,
} from "../filters";
import type { NamedApiResource } from "../types";

const resource = (name: string, id: number): NamedApiResource => ({
  name,
  url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
});

describe("pokemon filters", () => {
  it("filters regional, mega, and special-form resources from PokeAPI list entries", () => {
    const normal = resource("charizard", 6);
    const mega = resource("charizard-mega-x", 10034);
    const alolan = resource("rattata-alola", 10091);

    expect(filterPokemonResource(normal, "forms")).toBe(false);
    expect(filterPokemonResource(mega, "forms")).toBe(true);
    expect(filterPokemonResource(mega, "mega")).toBe(true);
    expect(filterPokemonResource(alolan, "regional")).toBe(true);
  });

  it("keeps all resources for shiny filter because shiny availability is resolved after detail fetch", () => {
    const filters: PokemonVariantFilter[] = ["all", "shiny"];

    expect(filters.map((filter) => filterPokemonResource(resource("pikachu", 25), filter))).toEqual([
      true,
      true,
    ]);
  });

  it("resets special-only variant filters when a normal generation is selected", () => {
    expect(getCompatibleVariantFilter("paldea", "forms")).toBe("all");
    expect(getCompatibleVariantFilter("paldea", "regional")).toBe("all");
    expect(getCompatibleVariantFilter("paldea", "mega")).toBe("all");
    expect(getCompatibleVariantFilter("paldea", "shiny")).toBe("shiny");
    expect(getCompatibleVariantFilter("forms", "regional")).toBe("regional");
    expect(getCompatibleGenerationFilter("paldea", "regional")).toBe("forms");
    expect(getCompatibleGenerationFilter("all", "regional")).toBe("forms");
    expect(getCompatibleGenerationFilter("paldea", "shiny")).toBe("paldea");
    expect(getCompatibleListFilters("all", "regional")).toEqual({
      generation: "forms",
      variant: "regional",
    });
    expect(getCompatibleListFilters("paldea", "regional")).toEqual({
      generation: "paldea",
      variant: "all",
    });
  });

  it("sorts resources by name and dex number", () => {
    const entries = [resource("charizard", 6), resource("bulbasaur", 1)];

    expect(sortPokemonResources(entries, "name").map((entry) => entry.name)).toEqual([
      "bulbasaur",
      "charizard",
    ]);
    expect(sortPokemonResources(entries, "dex").map((entry) => entry.name)).toEqual([
      "bulbasaur",
      "charizard",
    ]);
  });
});
