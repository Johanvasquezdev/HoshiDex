import { Sequelize } from "sequelize";
import { env, requireDatabaseUrl } from "./env";

export const sequelize = new Sequelize(requireDatabaseUrl(), {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: env.nodeEnv === "development" ? console.log : false,
});

export async function assertDatabaseConnection() {
  await sequelize.authenticate();
}
