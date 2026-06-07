import { AppShell } from "../components/AppShell";
import { TaxonomyMaintenancePage } from "../components/maintenance/TaxonomyMaintenancePage";

export default function TiposPage() {
  return (
    <AppShell>
      <TaxonomyMaintenancePage entity="tipos" />
    </AppShell>
  );
}

