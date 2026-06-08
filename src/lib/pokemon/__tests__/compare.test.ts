import { describe, expect, it } from "vitest";
import { toggleComparedPokemon } from "../compare";
import type { PokemonSummary } from "../types";

const summary = (id: number): PokemonSummary => ({
  id,
  name: `pokemon-${id}`,
  displayName: `Pokemon ${id}`,
  types: ["normal"],
  generation: null,
  media: {
    primary: null,
    shiny: null,
    animated: null,
    modelUrl: null,
    videoUrl: null,
    fallback: "",
  },
  isRegionalOrSpecial: false,
});

describe("compare selection", () => {
  it("adds and removes selected pokemon", () => {
    const one = toggleComparedPokemon([], summary(1));

    expect(one.map((pokemon) => pokemon.id)).toEqual([1]);
    expect(toggleComparedPokemon(one, summary(1))).toEqual([]);
  });

  it("caps compare selection at four pokemon", () => {
    const selected = [summary(1), summary(2), summary(3), summary(4)];

    expect(toggleComparedPokemon(selected, summary(5)).map((pokemon) => pokemon.id)).toEqual([
      1,
      2,
      3,
      4,
    ]);
  });
});
