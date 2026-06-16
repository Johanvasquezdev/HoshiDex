import type { MaintenanceState } from "./types";

export const initialMaintenanceState: MaintenanceState = {
  regions: [
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
  types: [
    { id: "grass", name: "Grass" },
    { id: "poison", name: "Poison" },
    { id: "fire", name: "Fire" },
    { id: "flying", name: "Flying" },
    { id: "water", name: "Water" },
    { id: "dark", name: "Dark" },
    { id: "electric", name: "Electric" },
    { id: "psychic", name: "Psychic" },
    { id: "dragon", name: "Dragon" },
    { id: "ground", name: "Ground" },
  ],
  pokemon: [
    {
      id: "bulbasaur",
      name: "Bulbasaur",
      imageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      regionId: "kanto",
      primaryTypeId: "grass",
      secondaryTypeId: "poison",
    },
    {
      id: "charizard",
      name: "Charizard",
      imageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      regionId: "kanto",
      primaryTypeId: "fire",
      secondaryTypeId: "flying",
    },
    {
      id: "greninja",
      name: "Greninja",
      imageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
      regionId: "kalos",
      primaryTypeId: "water",
      secondaryTypeId: "dark",
    },
    {
      id: "zygarde",
      name: "Zygarde",
      imageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png",
      regionId: "kalos",
      primaryTypeId: "dragon",
      secondaryTypeId: "ground",
    },
  ],
  mediaAssets: [],
};
