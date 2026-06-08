import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";

export class PokemonType extends Model<InferAttributes<PokemonType>, InferCreationAttributes<PokemonType>> {
  declare id: string;
  declare name: string;
}

PokemonType.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "tipos",
    schema: "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);
