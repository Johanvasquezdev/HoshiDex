import { AppShell } from "@/app/components/AppShell";
import { MediaAssetFormPage } from "@/app/components/maintenance/MediaAssetFormPage";

export default async function EditMediaAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <MediaAssetFormPage mode="edit" assetId={id} />
    </AppShell>
  );
}
