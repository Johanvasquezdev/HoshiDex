import { describe, expect, it } from "vitest";
import { buildAbilityMediaShowcase } from "../showcase";
import type { PokemonAbility } from "../types";

const abilities: PokemonAbility[] = [
  {
    name: "blaze",
    displayName: "Blaze",
    isHidden: false,
    effect: "Powers up Fire-type moves.",
  },
  {
    name: "solar-power",
    displayName: "Solar Power",
    isHidden: true,
    effect: null,
  },
];

describe("buildAbilityMediaShowcase", () => {
  it("prefers persisted media assets over placeholders", () => {
    const showcase = buildAbilityMediaShowcase({
      pokemonName: "Charizard",
      mainType: "fire",
      generationLabel: "Generation I",
      abilities,
      modelUrl: null,
      videoUrl: null,
      mediaAssets: [
        {
          id: "charizard-blaze-video",
          pokemonId: "charizard",
          abilityName: "blaze",
          game: "Pokemon Stadium",
          generation: 1,
          kind: "video",
          url: "https://example.com/blaze.mp4",
          sourceUrl: "https://example.com/source",
        },
      ],
    });

    expect(showcase.hasRealMedia).toBe(true);
    expect(showcase.assets[0]).toMatchObject({
      id: "charizard-blaze-video",
      abilityName: "blaze",
      kind: "video",
      url: "https://example.com/blaze.mp4",
      game: "Pokemon Stadium",
      generationLabel: "Generation 1",
      sourceUrl: "https://example.com/source",
    });
    expect(showcase.assets).toContainEqual(
      expect.objectContaining({
        abilityName: "solar-power",
        kind: "placeholder",
      }),
    );
  });

  it("falls back to legacy flat media URLs", () => {
    const showcase = buildAbilityMediaShowcase({
      pokemonName: "Bulbasaur",
      mainType: "grass",
      generationLabel: "Generation I",
      abilities: abilities.slice(0, 1),
      modelUrl: "https://example.com/bulbasaur.glb",
      videoUrl: null,
    });

    expect(showcase.hasRealMedia).toBe(true);
    expect(showcase.assets[0]).toMatchObject({
      kind: "model",
      url: "https://example.com/bulbasaur.glb",
    });
  });
});
