import { Router } from "express";
import { Pokemon } from "../models";
import { sendError, sendNotFound } from "../utils/http";

type PokemonBody = {
  id?: string;
  name?: string;
  imageUrl?: string;
  regionId?: string;
  primaryTypeId?: string;
  secondaryTypeId?: string;
};

function toApiPokemon(row: Pokemon) {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    regionId: row.region_id,
    primaryTypeId: row.primary_type_id,
    secondaryTypeId: row.secondary_type_id ?? "",
  };
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
}

function toDbPokemon(body: PokemonBody, fallbackId?: string) {
  return {
    id: requireString(body.id ?? fallbackId, "id"),
    name: requireString(body.name, "name"),
    image_url: requireString(body.imageUrl, "imageUrl"),
    region_id: requireString(body.regionId, "regionId"),
    primary_type_id: requireString(body.primaryTypeId, "primaryTypeId"),
    secondary_type_id: body.secondaryTypeId?.trim() || null,
  };
}

export const pokemonRouter = Router();

pokemonRouter.get("/", async (_request, response) => {
  try {
    const rows = await Pokemon.findAll({ order: [["name", "ASC"]] });
    response.json(rows.map(toApiPokemon));
  } catch (error) {
    sendError(response, error);
  }
});

pokemonRouter.post("/", async (request, response) => {
  try {
    const created = await Pokemon.create(toDbPokemon(request.body as PokemonBody));
    response.status(201).json(toApiPokemon(created));
  } catch (error) {
    sendError(response, error);
  }
});

pokemonRouter.put("/:id", async (request, response) => {
  try {
    const row = await Pokemon.findByPk(request.params.id);
    if (!row) return sendNotFound(response, "Pokemon");

    await row.update(toDbPokemon(request.body as PokemonBody, request.params.id));
    response.json(toApiPokemon(row));
  } catch (error) {
    sendError(response, error);
  }
});

pokemonRouter.delete("/:id", async (request, response) => {
  try {
    const deleted = await Pokemon.destroy({ where: { id: request.params.id } });
    if (!deleted) return sendNotFound(response, "Pokemon");

    response.status(204).send();
  } catch (error) {
    sendError(response, error);
  }
});
