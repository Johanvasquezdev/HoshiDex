import { AppShell } from "@/app/components/AppShell";
import { MediaAssetFormPage } from "@/app/components/maintenance/MediaAssetFormPage";

export default function NewMediaAssetPage() {
  return (
    <AppShell>
      <MediaAssetFormPage mode="create" />
    </AppShell>
  );
}
