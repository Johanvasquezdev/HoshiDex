"use client";

import Link from "next/link";
import { Box, Clapperboard, Edit3, Plus, Trash2 } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function MediaAssetsMaintenancePage() {
  const store = useMaintenanceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            Media Assets
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Attach model and video URLs to Pokemon ability showcases.
          </p>
        </div>
        <Link
          href="/media-assets/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
        >
          <Plus className="h-4 w-4" />
          Create Asset
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20">
        <div className="grid grid-cols-[1fr_0.8fr_1fr_0.7fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <span>Pokemon</span>
          <span>Kind</span>
          <span>Ability</span>
          <span>Game</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {store.mediaAssets.length === 0 && (
            <div className="px-5 py-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              No media assets yet. Add a GLB/GLTF model URL or video URL to unlock real showcase media.
            </div>
          )}
          {store.mediaAssets.map((asset) => {
            const pokemon = store.pokemon.find((item) => item.id === asset.pokemonId);
            return (
              <div
                key={asset.id}
                className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-[1fr_0.8fr_1fr_0.7fr_auto] md:items-center"
              >
                <div className="min-w-0">
                  <div className="font-black text-slate-900 dark:text-white">
                    {pokemon?.name ?? asset.pokemonId}
                  </div>
                  <a
                    href={asset.url}
                    className="block truncate text-xs font-semibold text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
                  >
                    {asset.url}
                  </a>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {asset.kind === "model" ? <Box className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />}
                  {asset.kind}
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {asset.abilityName || "All abilities"}
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {asset.game || "Unspecified"}
                  {asset.generation ? ` / Gen ${asset.generation}` : ""}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/media-assets/${asset.id}/edit`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                    aria-label={`Edit media asset for ${pokemon?.name ?? asset.pokemonId}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/media-assets/${asset.id}/delete`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                    aria-label={`Delete media asset for ${pokemon?.name ?? asset.pokemonId}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
