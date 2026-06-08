import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.BACKEND_PORT ?? process.env.PORT ?? 4000),
  syncDatabase: process.env.SEQUELIZE_SYNC === "true",
  seedDatabase: process.env.SEQUELIZE_SEED === "true",
  corsOrigin: process.env.BACKEND_CORS_ORIGIN ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173",
};

export function requireDatabaseUrl() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL or SUPABASE_DATABASE_URL is required for the Sequelize backend.");
  }

  return env.databaseUrl;
}
