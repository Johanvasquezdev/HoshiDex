import { Pokemon, Region, PokemonType } from "./models";

export async function seedMaintenanceCatalog() {
  await Region.bulkCreate(
    [
      { id: "kanto", name: "Kanto" },
      { id: "johto", name: "Johto" },
      { id: "hoenn", name: "Hoenn" },
      { id: "sinnoh", name: "Sinnoh" },
      { id: "unova", name: "Unova" },
      { id: "kalos", name: "Kalos" },
      { id: "alola", name: "Alola" },
      { id: "galar", name: "Galar" },
      { id: "paldea", name: "Paldea" },
    ],
    { updateOnDuplicate: ["name"] },
  );

  await PokemonType.bulkCreate(
    [
      { id: "grass", name: "Grass" },
      { id: "poison", name: "Poison" },
      { id: "fire", name: "Fire" },
      { id: "flying", name: "Flying" },
      { id: "water", name: "Water" },
      { id: "dark", name: "Dark" },
      { id: "electric", name: "Electric" },
      { id: "psychic", name: "Psychic" },
      { id: "dragon", name: "Dragon" },
    ],
    { updateOnDuplicate: ["name"] },
  );

  await Pokemon.bulkCreate(
    [
      {
        id: "bulbasaur",
        name: "Bulbasaur",
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        region_id: "kanto",
        primary_type_id: "grass",
        secondary_type_id: "poison",
      },
      {
        id: "charizard",
        name: "Charizard",
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        region_id: "kanto",
        primary_type_id: "fire",
        secondary_type_id: "flying",
      },
      {
        id: "greninja",
        name: "Greninja",
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
        region_id: "kalos",
        primary_type_id: "water",
        secondary_type_id: "dark",
      },
    ],
    { updateOnDuplicate: ["name", "image_url", "region_id", "primary_type_id", "secondary_type_id"] },
  );
}
