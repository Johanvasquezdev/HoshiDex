"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function MediaAssetDeletePage({ assetId }: { assetId: string }) {
  const router = useRouter();
  const store = useMaintenanceStore();
  const asset = store.mediaAssets.find((item) => item.id === assetId);
  const pokemon = store.pokemon.find((item) => item.id === asset?.pokemonId);

  function confirmDelete() {
    store.deleteMediaAsset(assetId);
    router.push("/media-assets");
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-2xl place-items-center px-4 py-10 sm:px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">
          Are you sure you want to delete this media asset?
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {pokemon?.name ?? "This Pokemon"} will lose this {asset?.kind ?? "media"} showcase asset.
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/media-assets"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
