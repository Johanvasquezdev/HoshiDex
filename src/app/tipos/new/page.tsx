import { AppShell } from "@/app/components/AppShell";
import { TaxonomyFormPage } from "@/app/components/maintenance/TaxonomyFormPage";

export default function NewTypePage() {
  return (
    <AppShell>
      <TaxonomyFormPage entity="tipos" mode="create" />
    </AppShell>
  );
}

