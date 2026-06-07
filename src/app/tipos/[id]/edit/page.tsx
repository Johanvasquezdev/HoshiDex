import { AppShell } from "@/app/components/AppShell";
import { TaxonomyFormPage } from "@/app/components/maintenance/TaxonomyFormPage";

export default async function EditTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <TaxonomyFormPage entity="tipos" mode="edit" itemId={id} />
    </AppShell>
  );
}

