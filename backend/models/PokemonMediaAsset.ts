import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";

export class PokemonMediaAsset extends Model<
  InferAttributes<PokemonMediaAsset>,
  InferCreationAttributes<PokemonMediaAsset>
> {
  declare id: CreationOptional<string>;
  declare pokemon_id: string;
  declare ability_name: string | null;
  declare game: string | null;
  declare generation: number | null;
  declare kind: "model" | "video";
  declare url: string;
  declare source_url: string | null;
}

PokemonMediaAsset.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    pokemon_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ability_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    game: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    generation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kind: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [["model", "video"]],
      },
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    source_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "pokemon_media_assets",
    schema: "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);
