import { AppShell } from "./components/AppShell";
import { ManagedCatalogHome } from "./components/maintenance/ManagedCatalogHome";
import { PokedexClient } from "./components/PokedexClient";
import { getPokemonList } from "@/lib/pokemon";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialData = await getPokemonList({ limit: 30, offset: 0 });

  return (
    <AppShell>
      <ManagedCatalogHome />
      <PokedexClient initialData={initialData} />
    </AppShell>
  );
}
