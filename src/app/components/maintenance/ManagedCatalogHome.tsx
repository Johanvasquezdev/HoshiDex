"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function ManagedCatalogHome() {
  const store = useMaintenanceStore();
  const [name, setName] = useState("");
  const [regionId, setRegionId] = useState("all");
  const [typeId, setTypeId] = useState("all");

  const filteredPokemon = useMemo(() => {
    return store.pokemon.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(name.trim().toLowerCase());
      const matchesRegion = regionId === "all" || pokemon.regionId === regionId;
      const matchesType =
        typeId === "all" ||
        pokemon.primaryTypeId === typeId ||
        pokemon.secondaryTypeId === typeId;
      return matchesName && matchesRegion && matchesType;
    });
  }, [name, regionId, store.pokemon, typeId]);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              System Catalog
            </h2>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              Backend-ready list of Pokemon created in the system, with region and type filters.
            </p>
            <p className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              {store.backendEnabled
                ? "Connected to Express API"
                : "Local demo store"}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="relative">
              <span className="sr-only">Search managed pokemon</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by region</span>
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={regionId}
                onChange={(event) => setRegionId(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-[#111827] dark:text-white"
              >
                <option value="all">All regions</option>
                {store.regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative">
              <span className="sr-only">Filter by type</span>
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={typeId}
                onChange={(event) => setTypeId(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-[#111827] dark:text-white"
              >
                <option value="all">All types</option>
                {store.types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredPokemon.map((pokemon) => (
            <article
              key={pokemon.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className="h-20 w-20 rounded-2xl object-contain"
              />
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-slate-900 dark:text-white">
                  {pokemon.name}
                </h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {store.regionsById[pokemon.regionId]?.name ?? "No region"}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-red-600 dark:text-red-300">
                  {store.typesById[pokemon.primaryTypeId]?.name ?? "Type"} /{" "}
                  {store.typesById[pokemon.secondaryTypeId]?.name ?? "Type"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
