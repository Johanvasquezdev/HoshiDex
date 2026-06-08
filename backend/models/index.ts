import { Pokemon } from "./Pokemon";
import { PokemonMediaAsset } from "./PokemonMediaAsset";
import { Region } from "./Region";
import { PokemonType } from "./Type";

Region.hasMany(Pokemon, {
  foreignKey: "region_id",
  as: "pokemon",
});

Pokemon.belongsTo(Region, {
  foreignKey: "region_id",
  as: "region",
});

PokemonType.hasMany(Pokemon, {
  foreignKey: "primary_type_id",
  as: "primaryPokemon",
});

PokemonType.hasMany(Pokemon, {
  foreignKey: "secondary_type_id",
  as: "secondaryPokemon",
});

Pokemon.belongsTo(PokemonType, {
  foreignKey: "primary_type_id",
  as: "primaryType",
});

Pokemon.belongsTo(PokemonType, {
  foreignKey: "secondary_type_id",
  as: "secondaryType",
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
