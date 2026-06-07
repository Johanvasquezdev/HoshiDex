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

export type MaintenanceState = {
  regions: MaintenanceRegion[];
  types: MaintenanceType[];
  pokemon: MaintenancePokemon[];
};

export type PokemonFormValues = Omit<MaintenancePokemon, "id">;

