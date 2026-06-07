"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { animate, stagger } from "animejs";
import { Filter, Search } from "lucide-react";
import { GENERATION_FILTERS } from "@/lib/pokemon/generations";
import {
  getCompatibleGenerationFilter,
  getCompatibleVariantFilter,
  type PokemonVariantFilter,
} from "@/lib/pokemon/filters";
import type { PokemonListResponse } from "@/lib/pokemon/types";
import { PokemonCard } from "./PokemonCard";

const PAGE_SIZE = 30;

async function fetchPokemonList(params: {
  search: string;
  generation: string;
  sort: string;
  variant: string;
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
  const response = await fetch(`/api/pokemon?${searchParams.toString()}`);
  if (!response.ok) throw new Error("Failed to load Pokémon");
  return response.json() as Promise<PokemonListResponse>;
}

export function PokedexClient({ initialData }: { initialData: PokemonListResponse }) {
  const [search, setSearch] = useState("");
  const [generation, setGeneration] = useState("all");
  const [sort, setSort] = useState("dex");
  const [variant, setVariant] = useState<PokemonVariantFilter>("all");
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [search, generation, sort, variant]);

  const query = useQuery({
    queryKey: ["pokemon-list", search, generation, sort, variant, visibleLimit],
    queryFn: () =>
      fetchPokemonList({
        search,
        generation,
        sort,
        variant,
        limit: visibleLimit,
        offset: 0,
      }),
    initialData:
      search === "" &&
      generation === "all" &&
      sort === "dex" &&
      variant === "all" &&
      visibleLimit === PAGE_SIZE
        ? initialData
        : undefined,
  });

  const data = query.data ?? initialData;
  const canLoadMore = data.items.length < data.total;

  useEffect(() => {
    if (data.items.length > 0 && gridRef.current) {
      animate(".pokemon-card-animate", {
        translateY: [16, 0],
        opacity: [0, 1],
        delay: stagger(28, { start: 80 }),
        easing: "easeOutQuad",
        duration: 500,
      });
    }
  }, [data.items.length]);

  const statusText = useMemo(() => {
    if (query.isFetching) return "Updating encyclopedia...";
    return `${data.total.toLocaleString()} entries`;
  }, [data.total, query.isFetching]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            HoshiDex
          </h1>
          <p className="max-w-xl text-base font-medium leading-7 text-slate-600 dark:text-slate-300">
            Search every generation, regional form, shiny-ready sprite set, and encyclopedia dossier.
          </p>
          <p className="mt-2 text-sm font-bold text-slate-400 dark:text-slate-500">{statusText}</p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search Pokémon</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Pokémon..."
              className="block w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500 dark:shadow-black/20 dark:focus:border-red-400 dark:focus:ring-red-400/60"
            />
          </label>
          <label className="relative w-full sm:w-56">
            <span className="sr-only">Filter by generation</span>
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select
              value={generation}
              onChange={(event) => {
                const nextGeneration = event.target.value;
                setGeneration(nextGeneration);
                setVariant((current) => getCompatibleVariantFilter(nextGeneration, current));
              }}
              className="block w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:shadow-black/20 dark:focus:border-red-400 dark:focus:ring-red-400/60"
            >
              {GENERATION_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative w-full sm:w-48">
            <span className="sr-only">Sort Pokemon</span>
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="block w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:shadow-black/20 dark:focus:border-red-400 dark:focus:ring-red-400/60"
            >
              <option value="dex">National Dex</option>
              <option value="name">Name A-Z</option>
              <option value="region">Region</option>
            </select>
          </label>
          <label className="relative w-full sm:w-52">
            <span className="sr-only">Filter by form or media</span>
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select
              value={variant}
              onChange={(event) => {
                const nextVariant = event.target.value as PokemonVariantFilter;
                setVariant(nextVariant);
                setGeneration((current) => getCompatibleGenerationFilter(current, nextVariant));
              }}
              className="block w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:shadow-black/20 dark:focus:border-red-400 dark:focus:ring-red-400/60"
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

      {query.isError ? (
        <div className="rounded-[2rem] border border-red-100 bg-red-50 px-6 py-16 text-center dark:border-red-400/20 dark:bg-red-950/20">
          <h2 className="text-lg font-black text-red-900 dark:text-red-200">The HoshiDex signal dropped</h2>
          <p className="mt-2 text-red-700 dark:text-red-300">Refresh or try a narrower search.</p>
        </div>
      ) : (
        <>
          <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-card-animate opacity-0">
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
          {data.items.length === 0 && (
            <div className="py-16 text-center">
              <h2 className="text-lg font-black text-slate-700 dark:text-slate-200">No Pokémon found</h2>
              <p className="text-slate-500 dark:text-slate-400">Try a different name or generation.</p>
            </div>
          )}
          {canLoadMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleLimit((current) => current + PAGE_SIZE)}
                className="rounded-full bg-red-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-1 hover:bg-red-700 dark:bg-red-500 dark:shadow-red-950/40 dark:hover:bg-red-400"
              >
                Load More Pokémon
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
