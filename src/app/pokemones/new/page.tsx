import { AppShell } from "@/app/components/AppShell";
import { PokemonFormPage } from "@/app/components/maintenance/PokemonFormPage";

export default function NewPokemonPage() {
  return (
    <AppShell>
      <PokemonFormPage mode="create" />
    </AppShell>
  );
}

