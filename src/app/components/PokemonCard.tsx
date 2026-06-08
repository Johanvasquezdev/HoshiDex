"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus, WifiOff } from "lucide-react";
import type { PokemonSummary } from "@/lib/pokemon/types";
import { typeColors } from "./type-styles";

export function PokemonCard({
  pokemon,
  isCompared = false,
  onToggleCompare,
}: {
  pokemon: PokemonSummary;
  isCompared?: boolean;
  onToggleCompare?: (pokemon: PokemonSummary) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mainType = pokemon.types[0] ?? "normal";
  const background = typeColors[mainType] ?? "bg-gray-400";
  const image =
    hovered && pokemon.media.animated
      ? pokemon.media.animated
      : pokemon.media.primary ?? pokemon.media.fallback;

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="block">
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative flex h-[180px] flex-col justify-between overflow-hidden rounded-[2rem] p-5 text-white shadow-sm ring-1 ring-black/0 transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:shadow-black/30 dark:ring-white/10 ${background}`}
      >
        <div className="absolute right-0 top-0 -mr-6 -mt-6 opacity-20 transition-transform duration-700 group-hover:rotate-45">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 0 0-7.9 7h4.96a3 3 0 0 1 5.88 0h4.96A8 8 0 0 0 12 4zm0 16a8 8 0 0 0 7.9-7h-4.96a3 3 0 0 1-5.88 0H4.1A8 8 0 0 0 12 20zm0-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </div>
        <div className="absolute right-5 top-4 text-sm font-black tracking-wider opacity-30">
          #{pokemon.id.toString().padStart(3, "0")}
        </div>
        {onToggleCompare && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleCompare(pokemon);
            }}
            className={`absolute bottom-4 left-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white shadow-lg backdrop-blur-md transition hover:scale-105 ${
              isCompared ? "bg-emerald-500" : "bg-black/25 hover:bg-black/40"
            }`}
            aria-label={`${isCompared ? "Remove" : "Add"} ${pokemon.displayName} ${isCompared ? "from" : "to"} compare`}
          >
            {isCompared ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
        {pokemon.loadError && (
          <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur-md">
            <WifiOff className="h-3 w-3" />
            Offline
          </div>
        )}
        <div className="relative z-10">
          <h2 className="mb-3 truncate text-xl font-black drop-shadow-sm">
            {pokemon.displayName}
          </h2>
          <div className="flex flex-col items-start gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold capitalize shadow-sm backdrop-blur-md"
              >
                {type}
              </span>
            ))}
          </div>
          {pokemon.loadError && (
            <p className="mt-3 max-w-36 text-xs font-bold leading-5 text-white/80">
              Detail request dropped. Cached fallback shown.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide text-white/75">
            {pokemon.heightM && <span>{pokemon.heightM.toFixed(1)}m</span>}
            {pokemon.weightKg && <span>{pokemon.weightKg.toFixed(1)}kg</span>}
            {pokemon.generation && <span>{pokemon.generation.region}</span>}
          </div>
        </div>
        <div className="absolute bottom-2 right-2 z-10 flex h-28 w-28 items-end justify-center pb-2 transition-transform duration-300 group-hover:scale-110">
          <img
            src={image}
            alt={pokemon.displayName}
            width={128}
            height={128}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>
      </article>
    </Link>
  );
}
