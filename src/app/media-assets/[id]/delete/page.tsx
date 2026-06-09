import { AppShell } from "@/app/components/AppShell";
import { MediaAssetDeletePage } from "@/app/components/maintenance/MediaAssetDeletePage";

export default async function DeleteMediaAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <MediaAssetDeletePage assetId={id} />
    </AppShell>
  );
}
