import { AppShell } from "@/app/components/AppShell";
import { TaxonomyFormPage } from "@/app/components/maintenance/TaxonomyFormPage";

export default async function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <TaxonomyFormPage entity="regiones" mode="edit" itemId={id} />
    </AppShell>
  );
}

