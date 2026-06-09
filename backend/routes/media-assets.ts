import { Router } from "express";
import { PokemonMediaAsset } from "../models";
import { sendError, sendNotFound } from "../utils/http";

export const mediaAssetRouter = Router();

type MediaAssetBody = {
  pokemonId?: string;
  abilityName?: string;
  game?: string;
  generation?: number | string | null;
  kind?: "model" | "video";
  url?: string;
  sourceUrl?: string;
};

function toApiMediaAsset(row: PokemonMediaAsset) {
  return {
    id: row.id,
    pokemonId: row.pokemon_id,
    abilityName: row.ability_name ?? "",
    game: row.game ?? "",
    generation: row.generation,
    kind: row.kind,
    url: row.url,
    sourceUrl: row.source_url ?? "",
  };
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
}

function toNullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toNullableGeneration(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error("generation must be a positive integer");
  }

  return parsed;
}

function toDbMediaAsset(body: MediaAssetBody) {
  if (body.kind !== "model" && body.kind !== "video") {
    throw new Error("kind must be model or video");
  }

  return {
    pokemon_id: requireString(body.pokemonId, "pokemonId"),
    ability_name: toNullableText(body.abilityName),
    game: toNullableText(body.game),
    generation: toNullableGeneration(body.generation),
    kind: body.kind,
    url: requireString(body.url, "url"),
    source_url: toNullableText(body.sourceUrl),
  };
}

mediaAssetRouter.get("/", async (request, response) => {
  try {
    const pokemonId = typeof request.query.pokemonId === "string" ? request.query.pokemonId : undefined;
    const rows = await PokemonMediaAsset.findAll({
      where: pokemonId ? { pokemon_id: pokemonId } : undefined,
      order: [["created_at", "DESC"]],
    });

    response.json(rows.map(toApiMediaAsset));
  } catch (error) {
    sendError(response, error);
  }
});

mediaAssetRouter.post("/", async (request, response) => {
  try {
    const created = await PokemonMediaAsset.create(toDbMediaAsset(request.body as MediaAssetBody));

    response.status(201).json(toApiMediaAsset(created));
  } catch (error) {
    sendError(response, error);
  }
});

mediaAssetRouter.put("/:id", async (request, response) => {
  try {
    const row = await PokemonMediaAsset.findByPk(request.params.id);
    if (!row) return sendNotFound(response, "Media asset");

    await row.update(toDbMediaAsset(request.body as MediaAssetBody));
    response.json(toApiMediaAsset(row));
  } catch (error) {
    sendError(response, error);
  }
});

mediaAssetRouter.delete("/:id", async (request, response) => {
  try {
    const deleted = await PokemonMediaAsset.destroy({ where: { id: request.params.id } });
    if (!deleted) return sendNotFound(response, "Media asset");

    response.status(204).send();
  } catch (error) {
    sendError(response, error);
  }
});
