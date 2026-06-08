import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";

export class Region extends Model<InferAttributes<Region>, InferCreationAttributes<Region>> {
  declare id: string;
  declare name: string;
}

Region.init(
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
    tableName: "regiones",
    schema: "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);
