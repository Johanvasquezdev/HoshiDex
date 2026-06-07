import { getPokemonDetail } from "@/lib/pokemon";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ idOrName: string }> },
) {
  const { idOrName } = await params;
  const data = await getPokemonDetail(idOrName);

  return Response.json(data);
}
