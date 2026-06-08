import { Router } from "express";
import type { ModelStatic } from "sequelize";
import { Region, PokemonType } from "../models";
import { sendError, sendNotFound } from "../utils/http";

type TaxonomyModel = typeof Region | typeof PokemonType;

function taxonomyRouter(model: TaxonomyModel, label: string) {
  const router = Router();

  router.get("/", async (_request, response) => {
    try {
      const rows = await model.findAll({ attributes: ["id", "name"], order: [["name", "ASC"]] });
      response.json(rows);
    } catch (error) {
      sendError(response, error);
    }
  });

  router.post("/", async (request, response) => {
    try {
      const created = await (model as ModelStatic<any>).create({
        id: request.body.id,
        name: request.body.name,
      });
      response.status(201).json(created);
    } catch (error) {
      sendError(response, error);
    }
  });

  router.put("/:id", async (request, response) => {
    try {
      const row = await model.findByPk(request.params.id);
      if (!row) return sendNotFound(response, label);

      await row.update({ name: request.body.name });
      response.json(row);
    } catch (error) {
      sendError(response, error);
    }
  });

  router.delete("/:id", async (request, response) => {
    try {
      const deleted = await model.destroy({ where: { id: request.params.id } });
      if (!deleted) return sendNotFound(response, label);

      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  return router;
}

export const regionRouter = taxonomyRouter(Region, "Region");
export const typeRouter = taxonomyRouter(PokemonType, "Type");
