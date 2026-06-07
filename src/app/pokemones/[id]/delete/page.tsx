import { AppShell } from "@/app/components/AppShell";
import { PokemonDeletePage } from "@/app/components/maintenance/PokemonDeletePage";

export default async function DeletePokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <PokemonDeletePage pokemonId={id} />
    </AppShell>
  );
}

