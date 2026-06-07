import { AppShell } from "@/app/components/AppShell";
import { PokemonFormPage } from "@/app/components/maintenance/PokemonFormPage";

export default async function EditPokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <PokemonFormPage mode="edit" pokemonId={id} />
    </AppShell>
  );
}

