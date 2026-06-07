import { AppShell } from "../components/AppShell";
import { TaxonomyMaintenancePage } from "../components/maintenance/TaxonomyMaintenancePage";

export default function RegionesPage() {
  return (
    <AppShell>
      <TaxonomyMaintenancePage entity="regiones" />
    </AppShell>
  );
}

