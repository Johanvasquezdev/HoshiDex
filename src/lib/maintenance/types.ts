export type MaintenanceRegion = {
  id: string;
  name: string;
};

export type MaintenanceType = {
  id: string;
  name: string;
};

export type MaintenancePokemon = {
  id: string;
  name: string;
  imageUrl: string;
  regionId: string;
  primaryTypeId: string;
  secondaryTypeId: string;
};

export type MaintenanceMediaAssetKind = "model" | "video";

export type MaintenanceMediaAsset = {
  id: string;
  pokemonId: string;
  abilityName: string;
  game: string;
  generation: number | null;
  kind: MaintenanceMediaAssetKind;
  url: string;
  sourceUrl: string;
};

export type MaintenanceState = {
  regions: MaintenanceRegion[];
  types: MaintenanceType[];
  pokemon: MaintenancePokemon[];
  mediaAssets: MaintenanceMediaAsset[];
};

export type PokemonFormValues = Omit<MaintenancePokemon, "id">;
export type MediaAssetFormValues = Omit<MaintenanceMediaAsset, "id">;
