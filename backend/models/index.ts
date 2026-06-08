import { Pokemon } from "./Pokemon";
import { PokemonMediaAsset } from "./PokemonMediaAsset";
import { Region } from "./Region";
import { PokemonType } from "./Type";

Region.hasMany(Pokemon, {
  foreignKey: "region_id",
  as: "pokemon",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Pokemon.belongsTo(Region, {
  foreignKey: "region_id",
  as: "region",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

PokemonType.hasMany(Pokemon, {
  foreignKey: "primary_type_id",
  as: "primaryPokemon",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

PokemonType.hasMany(Pokemon, {
  foreignKey: "secondary_type_id",
  as: "secondaryPokemon",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Pokemon.belongsTo(PokemonType, {
  foreignKey: "primary_type_id",
  as: "primaryType",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Pokemon.belongsTo(PokemonType, {
  foreignKey: "secondary_type_id",
  as: "secondaryType",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Pokemon.hasMany(PokemonMediaAsset, {
  foreignKey: "pokemon_id",
  as: "mediaAssets",
});

PokemonMediaAsset.belongsTo(Pokemon, {
  foreignKey: "pokemon_id",
  as: "pokemon",
});

export { Pokemon, PokemonMediaAsset, Region, PokemonType };
