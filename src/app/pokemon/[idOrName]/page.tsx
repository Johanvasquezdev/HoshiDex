import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/AppShell";
import { PokemonDetailClient } from "@/app/components/PokemonDetailClient";
import { PokeApiError } from "@/lib/pokemon/pokeapi-client";
import { getPokemonDetail } from "@/lib/pokemon";

export const dynamic = "force-dynamic";

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ idOrName: string }>;
}) {
  const { idOrName } = await params;

  try {
    const pokemon = await getPokemonDetail(idOrName);
    return (
      <AppShell>
        <PokemonDetailClient pokemon={pokemon} />
      </AppShell>
    );
  } catch (error) {
    if (error instanceof PokeApiError && error.status === 404) notFound();
    throw error;
  }
}
