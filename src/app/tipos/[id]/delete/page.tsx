import { AppShell } from "@/app/components/AppShell";
import { TaxonomyDeletePage } from "@/app/components/maintenance/TaxonomyDeletePage";

export default async function DeleteTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <TaxonomyDeletePage entity="tipos" itemId={id} />
    </AppShell>
  );
}

