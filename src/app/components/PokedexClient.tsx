"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { animate, stagger } from "animejs";
import { Filter, Search, Sparkles } from "lucide-react";
import {
  DEFAULT_ADVANCED_FILTERS,
  advancedFiltersToSearchParams,
  getActiveFilterChips,
  type AdvancedFilters,
} from "@/lib/pokemon/advanced-filters";
import { toggleComparedPokemon, isPokemonCompared } from "@/lib/pokemon/compare";
import { GENERATION_FILTERS } from "@/lib/pokemon/generations";
import {
  getCompatibleGenerationFilter,
  getCompatibleVariantFilter,
  type PokemonVariantFilter,
} from "@/lib/pokemon/filters";
import type { PokemonListResponse, PokemonSummary } from "@/lib/pokemon/types";
import { AdvancedFilterPanel } from "./AdvancedFilterPanel";
import { CompareTray } from "./CompareTray";
import { PokemonCard } from "./PokemonCard";

const PAGE_SIZE = 30;

async function fetchPokemonList(params: {
  search: string;
  generation: string;
  sort: string;
  variant: string;
  advancedFilters: AdvancedFilters;
  limit: number;
  offset: number;
}) {
  const searchParams = new URLSearchParams({
    search: params.search,
    generation: params.generation,
    sort: params.sort,
    variant: params.variant,
    limit: String(params.limit),
    offset: String(params.offset),
  });

  advancedFiltersToSearchParams(params.advancedFilters).forEach((value, key) => {
    searchParams.set(key, value);
  });

  const response = await fetch(`/api/pokemon?${searchParams.toString()}`);
  if (!response.ok) throw new Error("Failed to load Pokemon");
  return response.json() as Promise<PokemonListResponse>;
}

export function PokedexClient({ initialData }: { initialData: PokemonListResponse }) {
  const [search, setSearch] = useState("");
  const [generation, setGeneration] = useState("all");
  const [sort, setSort] = useState("dex");
  const [variant, setVariant] = useState<PokemonVariantFilter>("all");
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_ADVANCED_FILTERS);
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);
  const [compared, setCompared] = useState<PokemonSummary[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const advancedFilterSignature = useMemo(
    () => advancedFiltersToSearchParams(advancedFilters).toString(),
    [advancedFilters],
  );

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [search, generation, sort, variant, advancedFilterSignature]);

  const query = useQuery({
    queryKey: ["pokemon-list", search, generation, sort, variant, visibleLimit, advancedFilterSignature],
    queryFn: () =>
      fetchPokemonList({
        search,
        generation,
        sort,
        variant,
        advancedFilters,
        limit: visibleLimit,
        offset: 0,
      }),
    initialData:
      search === "" &&
      generation === "all" &&
      sort === "dex" &&
      variant === "all" &&
      advancedFilterSignature === "" &&
      visibleLimit === PAGE_SIZE
        ? initialData
        : undefined,
  });

  const data = query.data ?? initialData;
  const canLoadMore = data.items.length < data.total;
  const activeFilterCount = getActiveFilterChips(advancedFilters).length;

  useEffect(() => {
    if (data.items.length > 0 && gridRef.current) {
      animate(".pokemon-card-animate", {
        translateY: [16, 0],
        opacity: [0, 1],
        delay: stagger(24, { start: 60 }),
        easing: "easeOutQuad",
        duration: 420,
      });
    }
  }, [data.items.length]);

  const statusText = useMemo(() => {
    if (query.isFetching) return "Scanner recalibrating...";
    return `${data.total.toLocaleString()} scan matches`;
  }, [data.total, query.isFetching]);

  function toggleCompare(pokemon: PokemonSummary) {
    setCompared((current) => toggleComparedPokemon(current, pokemon));
  }

  function removeComparedPokemon(id: number) {
    setCompared((current) => current.filter((pokemon) => pokemon.id !== id));
  }

  return (
    <section className="px-3 py-6 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-red-900/30 bg-red-700 p-3 shadow-2xl shadow-red-950/25 dark:border-red-400/20 dark:bg-red-950">
        <div className="rounded-[1.5rem] bg-[#060912] p-3 shadow-inner shadow-black/50">
          <div className="grid gap-4 xl:grid-cols-[210px_minmax(0,1fr)_340px]">
            <aside className="rounded-[1.4rem] border border-white/10 bg-[#101827] p-4 text-white">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-200/40 bg-sky-400/20 shadow-lg shadow-sky-950/40">
                  <span className="h-6 w-6 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.95)]" />
                </span>
                <div>
                  <h1 className="text-xl font-black">HoshiDex</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    Hybrid console
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {GENERATION_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setGeneration(filter.id);
                      setVariant((current) => getCompatibleVariantFilter(filter.id, current));
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-xs font-black transition ${
                      generation === filter.id
                        ? "border-red-200/60 bg-red-500 text-white shadow-lg shadow-red-950/30"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{filter.region}</span>
                    <span className="text-[10px] opacity-70">
                      {filter.generation ? `G${filter.generation}` : filter.id === "forms" ? "SP" : "ALL"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                  Living Dex
                </p>
                <p className="mt-2 text-lg font-black text-white">417 / 1025</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-[41%] rounded-full bg-emerald-400" />
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-[#101827] p-4 text-white shadow-xl shadow-black/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-300">
                      Encyclopedia scanner
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                      {generation === "all"
                        ? "National research index"
                        : `${GENERATION_FILTERS.find((item) => item.id === generation)?.region ?? "Special"} dossier`}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                      Filter, inspect, and compare Pokemon in a device-style console built for every generation.
                    </p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      {statusText} {activeFilterCount > 0 ? `• ${activeFilterCount} filters active` : ""}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:w-[620px]">
                    <label className="relative sm:col-span-3">
                      <span className="sr-only">Search Pokemon</span>
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search Pokemon..."
                        className="block w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-red-300/60 focus:ring-2 focus:ring-red-400/30"
                      />
                    </label>
                    <label className="relative">
                      <span className="sr-only">Sort Pokemon</span>
                      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="block w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-[#111827] py-2.5 pl-9 pr-3 text-xs font-black text-slate-100 outline-none focus:border-red-300/60"
                      >
                        <option value="dex">National Dex</option>
                        <option value="name">Name A-Z</option>
                        <option value="region">Region</option>
                      </select>
                    </label>
                    <label className="relative sm:col-span-2">
                      <span className="sr-only">Filter by form or media</span>
                      <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <select
                        value={variant}
                        onChange={(event) => {
                          const nextVariant = event.target.value as PokemonVariantFilter;
                          setVariant(nextVariant);
                          setGeneration((current) => getCompatibleGenerationFilter(current, nextVariant));
                        }}
                        className="block w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-[#111827] py-2.5 pl-9 pr-3 text-xs font-black text-slate-100 outline-none focus:border-red-300/60"
                      >
                        <option value="all">All Forms</option>
                        <option value="shiny">Shiny Available</option>
                        <option value="regional">Regional Only</option>
                        <option value="mega">Mega Only</option>
                        <option value="forms">All Special Forms</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {query.isError ? (
                <div className="rounded-[1.4rem] border border-red-300/30 bg-red-950/50 px-6 py-16 text-center text-white">
                  <h2 className="text-lg font-black">The HoshiDex signal dropped</h2>
                  <p className="mt-2 text-red-100">Refresh or try a narrower scan.</p>
                </div>
              ) : (
                <>
                  <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                  >
                    {data.items.map((pokemon) => (
                      <div key={pokemon.id} className="pokemon-card-animate opacity-0">
                        <PokemonCard
                          pokemon={pokemon}
                          isCompared={isPokemonCompared(compared, pokemon.id)}
                          onToggleCompare={toggleCompare}
                        />
                      </div>
                    ))}
                  </div>

                  {data.items.length === 0 && (
                    <div className="rounded-[1.4rem] border border-white/10 bg-[#101827] py-16 text-center text-white">
                      <h2 className="text-lg font-black">No scan matches</h2>
                      <p className="mt-2 text-slate-400">Clear filters or try another region.</p>
                      <button
                        type="button"
                        onClick={() => setAdvancedFilters(DEFAULT_ADVANCED_FILTERS)}
                        className="mt-5 rounded-full bg-red-600 px-5 py-2 text-xs font-black text-white"
                      >
                        Clear advanced filters
                      </button>
                    </div>
                  )}

                  {canLoadMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleLimit((current) => current + PAGE_SIZE)}
                        className="rounded-full bg-red-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-1 hover:bg-red-500"
                      >
                        Load more Pokemon
                      </button>
                    </div>
                  )}
                </>
              )}

              <CompareTray
                selected={compared}
                onRemove={removeComparedPokemon}
                onClear={() => setCompared([])}
              />
            </div>

            <AdvancedFilterPanel filters={advancedFilters} onChange={setAdvancedFilters} />
          </div>
        </div>
      </div>
    </section>
  );
}
