import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";

export class Pokemon extends Model<InferAttributes<Pokemon>, InferCreationAttributes<Pokemon>> {
  declare id: string;
  declare name: string;
  declare image_url: string;
  declare region_id: string;
  declare primary_type_id: string;
  declare secondary_type_id: string | null;
}

Pokemon.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    primary_type_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    secondary_type_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "pokemones",
    schema: "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);
