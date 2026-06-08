import { Router } from "express";
import { PokemonMediaAsset } from "../models";
import { sendError, sendNotFound } from "../utils/http";

export const mediaAssetRouter = Router();

mediaAssetRouter.get("/", async (request, response) => {
  try {
    const pokemonId = typeof request.query.pokemonId === "string" ? request.query.pokemonId : undefined;
    const rows = await PokemonMediaAsset.findAll({
      where: pokemonId ? { pokemon_id: pokemonId } : undefined,
      order: [["created_at", "DESC"]],
    });

    response.json(rows);
  } catch (error) {
    sendError(response, error);
  }
});

mediaAssetRouter.post("/", async (request, response) => {
  try {
    const created = await PokemonMediaAsset.create({
      pokemon_id: request.body.pokemonId,
      ability_name: request.body.abilityName ?? null,
      game: request.body.game ?? null,
      generation: request.body.generation ?? null,
      kind: request.body.kind,
      url: request.body.url,
      source_url: request.body.sourceUrl ?? null,
    });

    response.status(201).json(created);
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
