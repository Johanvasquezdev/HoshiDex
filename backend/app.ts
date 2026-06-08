import cors from "cors";
import express from "express";
import { assertDatabaseConnection, sequelize } from "./config/database";
import { env } from "./config/env";
import "./models";
import { seedMaintenanceCatalog } from "./seed";
import { mediaAssetRouter } from "./routes/media-assets";
import { pokemonRouter } from "./routes/pokemones";
import { regionRouter, typeRouter } from "./routes/taxonomy";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.get("/api/health", async (_request, response) => {
  try {
    await assertDatabaseConnection();
    response.json({ ok: true, database: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    response.status(503).json({ ok: false, error: message });
  }
});

app.use("/api/pokemones", pokemonRouter);
app.use("/api/regiones", regionRouter);
app.use("/api/tipos", typeRouter);
app.use("/api/media-assets", mediaAssetRouter);

export async function prepareBackend() {
  await assertDatabaseConnection();

  if (env.syncDatabase) {
    await sequelize.sync({ alter: true });
  }

  if (env.seedDatabase) {
    await seedMaintenanceCatalog();
  }
}
