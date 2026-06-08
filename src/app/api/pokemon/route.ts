import { getPokemonList } from "@/lib/pokemon";
import { parseAdvancedFilters } from "@/lib/pokemon/advanced-filters";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const generation = searchParams.get("generation") ?? "all";
  const sort = searchParams.get("sort") ?? "dex";
  const variant = searchParams.get("variant") ?? "all";
  const limit = Number(searchParams.get("limit") ?? "60");
  const offset = Number(searchParams.get("offset") ?? "0");
  const advancedFilters = parseAdvancedFilters(searchParams);

  const data = await getPokemonList({
    search,
    generation,
    sort,
    variant,
    advancedFilters,
    limit: Number.isFinite(limit) ? limit : 60,
    offset: Number.isFinite(offset) ? offset : 0,
  });

  return Response.json(data);
}
