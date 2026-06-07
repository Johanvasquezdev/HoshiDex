import { AppShell } from "@/app/components/AppShell";
import { TaxonomyFormPage } from "@/app/components/maintenance/TaxonomyFormPage";

export default function NewRegionPage() {
  return (
    <AppShell>
      <TaxonomyFormPage entity="regiones" mode="create" />
    </AppShell>
  );
}

