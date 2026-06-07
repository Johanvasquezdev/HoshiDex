"use client";

import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function PokemonMaintenancePage() {
  const store = useMaintenanceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            Pokemones
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Maintenance list with create, edit, and delete actions.
          </p>
        </div>
        <Link
          href="/pokemones/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
        >
          <Plus className="h-4 w-4" />
          Create Pokemon
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <span>Pokemon</span>
          <span>Region</span>
          <span>Types</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {store.pokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="h-16 w-16 rounded-2xl bg-slate-50 object-contain dark:bg-white/5"
                />
                <span className="font-black text-slate-900 dark:text-white">{pokemon.name}</span>
              </div>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {store.regionsById[pokemon.regionId]?.name ?? "No region"}
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {store.typesById[pokemon.primaryTypeId]?.name ?? "Type"} /{" "}
                {store.typesById[pokemon.secondaryTypeId]?.name ?? "Type"}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/pokemones/${pokemon.id}/edit`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                  aria-label={`Edit ${pokemon.name}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <Link
                  href={`/pokemones/${pokemon.id}/delete`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                  aria-label={`Delete ${pokemon.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

