import { describe, expect, it } from "vitest";
import { getGenerationForPokemonId } from "../generations";
import { resolvePokemonMedia } from "../media";
import { buildAbilityMediaShowcase } from "../showcase";
import { createUnavailablePokemonSummary, formatPokemonName } from "../normalizers";

describe("pokemon normalizers", () => {
  it("formats hyphenated pokemon names for display", () => {
    expect(formatPokemonName("mr-mime")).toBe("Mr Mime");
    expect(formatPokemonName("nidoran-f")).toBe("Nidoran F");
  });

  it("finds the current generation for a national dex id", () => {
    expect(getGenerationForPokemonId(1)?.region).toBe("Kanto");
    expect(getGenerationForPokemonId(906)?.region).toBe("Paldea");
  });

  it("resolves official artwork before sprite fallback", () => {
    const media = resolvePokemonMedia({
      frontDefault: "/sprite.png",
      frontShiny: "/shiny.png",
      officialArtwork: "/official.png",
      officialShiny: null,
      animated: null,
      home: null,
    });

    expect(media.primary).toBe("/official.png");
    expect(media.shiny).toBe("/shiny.png");
  });

  it("creates a displayable fallback when a pokemon detail request fails", () => {
    const summary = createUnavailablePokemonSummary({
      name: "charizard",
      url: "https://pokeapi.co/api/v2/pokemon/6/",
    });

    expect(summary.id).toBe(6);
    expect(summary.displayName).toBe("Charizard");
    expect(summary.generation?.region).toBe("Kanto");
    expect(summary.loadError).toContain("unavailable");
  });

  it("builds placeholder media slots for future model and ability video assets", () => {
    const showcase = buildAbilityMediaShowcase({
      pokemonName: "Charizard",
      mainType: "fire",
      generationLabel: "Gen 1: Kanto",
      abilities: [
        { name: "blaze", displayName: "Blaze", isHidden: false, effect: "Powers up Fire moves." },
      ],
      modelUrl: null,
      videoUrl: null,
    });

    expect(showcase.assets).toHaveLength(1);
    expect(showcase.assets[0]).toMatchObject({
      abilityName: "blaze",
      kind: "placeholder",
      game: "Main series",
      generationLabel: "Gen 1: Kanto",
    });
    expect(showcase.hasRealMedia).toBe(false);
  });
});
