"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Ruler, Sparkles, Weight } from "lucide-react";
import type { EvolutionNode, PokemonDetail } from "@/lib/pokemon/types";
import { AbilityShowcase } from "./AbilityShowcase";
import { StatsRadar } from "./StatsRadar";
import { typeGradients, typeHexColors } from "./type-styles";

function EvolutionTree({ node }: { node: EvolutionNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={`/pokemon/${node.idOrName}`}
        className="break-words rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-red-200 hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-red-400/40 dark:hover:bg-red-500/10"
      >
        {node.displayName}
      </Link>
      {node.children.length > 0 && (
        <div className="ml-3 border-l border-slate-200 pl-3 dark:border-white/10 sm:ml-4 sm:pl-4">
          {node.children.map((child) => (
            <EvolutionTree key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PokemonDetailClient({ pokemon }: { pokemon: PokemonDetail }) {
  const [isShiny, setIsShiny] = useState(false);
  const [animated, setAnimated] = useState(false);
  const mainType = pokemon.types[0] ?? "normal";
  const gradient = typeGradients[mainType] ?? "from-gray-400 to-gray-500";
  const hexColor = typeHexColors[mainType] ?? "#9ca3af";
  const heroImage = useMemo(() => {
    if (isShiny && pokemon.media.shiny) return pokemon.media.shiny;
    if (animated && pokemon.media.animated) return pokemon.media.animated;
    return pokemon.media.primary ?? pokemon.media.fallback;
  }, [animated, isShiny, pokemon.media]);
  const isAnimatedSprite = heroImage === pokemon.media.animated;
  const heroImageClassName = isAnimatedSprite
    ? "max-h-full max-w-full object-contain drop-shadow-2xl [image-rendering:pixelated]"
    : "max-h-full max-w-full object-contain drop-shadow-2xl";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 pb-20 dark:bg-[#07090f]">
      <section className={`relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br ${gradient} pb-7 pt-5 text-white shadow-xl sm:rounded-b-[3rem] sm:pb-56 sm:pt-10`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <svg width="420" height="420" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-72 w-72 sm:h-[420px] sm:w-[420px]">
            <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 0 0-7.9 7h4.96a3 3 0 0 1 5.88 0h4.96A8 8 0 0 0 12 4zm0 16a8 8 0 0 0 7.9-7h-4.96a3 3 0 0 1-5.88 0H4.1A8 8 0 0 0 12 20zm0-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-bold drop-shadow-md transition hover:text-white/80 sm:mb-8 sm:text-base">
            <ArrowLeft className="h-5 w-5" />
            Back to HoshiDex
          </Link>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="text-base font-black opacity-80 sm:text-lg">#{pokemon.id.toString().padStart(3, "0")}</div>
              <h1 className="break-words text-4xl font-black tracking-tight drop-shadow-lg sm:text-7xl">
                {pokemon.displayName}
              </h1>
              <p className="mt-2 text-base font-bold opacity-85 sm:text-lg">{pokemon.genus ?? "Pokémon"}</p>
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                {pokemon.types.map((type) => (
                  <span key={type} className="rounded-full border border-white/20 bg-white/20 px-4 py-2 text-xs font-black capitalize shadow-sm backdrop-blur-md sm:px-5 sm:text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative z-30 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
              <button
                onClick={() => setAnimated((value) => !value)}
                className="min-h-11 rounded-full border border-white/20 bg-white/20 px-4 py-2 text-xs font-black shadow-lg shadow-black/10 backdrop-blur transition hover:bg-white/30"
              >
                {animated ? "Animated" : "Artwork"}
              </button>
              <button
                onClick={() => setIsShiny((value) => !value)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-black shadow-lg shadow-black/10 transition ${
                  isShiny
                    ? "border-yellow-300 bg-yellow-300 text-yellow-950"
                    : "border-white/20 bg-white/20 text-white backdrop-blur hover:bg-white/30"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                {isShiny ? "Shiny" : "Regular"}
              </button>
            </div>
          </div>
          <div className="relative z-20 mt-4 flex h-52 items-end justify-center sm:hidden">
            <img
              src={heroImage}
              alt={pokemon.displayName}
              width={260}
              height={260}
              className={heroImageClassName}
            />
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-3 max-w-5xl px-3 sm:-mt-40 sm:px-6">
        <section className="relative mb-8 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-2xl sm:mb-10 sm:rounded-[2rem] sm:p-10 sm:pt-48 dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/40">
          <div className="absolute -top-36 left-1/2 z-10 hidden h-72 w-72 -translate-x-1/2 items-end justify-center sm:-top-52 sm:flex sm:h-96 sm:w-96">
            <img
              src={heroImage}
              alt={pokemon.displayName}
              width={380}
              height={380}
              className={heroImageClassName}
            />
          </div>
          <p className="mx-auto mb-6 max-w-3xl text-center text-sm font-medium italic leading-7 text-slate-600 sm:mb-10 sm:text-lg sm:leading-8 dark:text-slate-300">
            “{pokemon.description}”
          </p>
          <div className="mb-8 grid gap-3 sm:mb-12 sm:grid-cols-2 sm:gap-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm dark:text-slate-400">
                <Weight className="h-5 w-5" />
                Weight
              </div>
              <div className="text-lg font-black text-slate-800 sm:text-2xl dark:text-white">{pokemon.weightKg} kg</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm dark:text-slate-400">
                <Ruler className="h-5 w-5" />
                Height
              </div>
              <div className="text-lg font-black text-slate-800 sm:text-2xl dark:text-white">{pokemon.heightM} m</div>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
            <div className="min-w-0">
              <h2 className={`mb-6 bg-gradient-to-r ${gradient} bg-clip-text text-2xl font-black text-transparent`}>
                Base Stats
              </h2>
              <div className="h-64 sm:h-80">
                <StatsRadar stats={pokemon.stats} color={hexColor} />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className={`mb-6 bg-gradient-to-r ${gradient} bg-clip-text text-2xl font-black text-transparent`}>
                Abilities
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.abilities.map((ability) => (
                  <div key={ability.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="break-words text-base font-black text-slate-800 sm:text-lg dark:text-white">{ability.displayName}</h3>
                      {ability.isHidden && (
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-300">
                          Hidden
                        </span>
                      )}
                    </div>
                    {ability.effect && <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{ability.effect}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-6 sm:mb-10 sm:gap-10 lg:grid-cols-2">
          {pokemon.evolution && (
            <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-xl sm:rounded-[2rem] sm:p-8 dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30">
              <h2 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">Evolution Chain</h2>
              <EvolutionTree node={pokemon.evolution} />
            </section>
          )}
          <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-xl sm:rounded-[2rem] sm:p-8 dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30">
            <h2 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">Forms & Variations</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {pokemon.varieties.map((variety) => (
                <Link
                  key={variety.name}
                  href={`/pokemon/${variety.idOrName}`}
                  className="group min-w-0 rounded-2xl border border-transparent p-2 text-center transition hover:border-slate-100 hover:bg-slate-50 sm:p-3 dark:hover:border-white/10 dark:hover:bg-white/5"
                >
                  <span className="mx-auto mb-2 grid h-20 w-20 place-items-center rounded-full bg-slate-100 shadow-inner sm:h-24 sm:w-24 dark:bg-white/10 dark:shadow-black/20">
                    <img
                      src={variety.sprite}
                      alt={variety.displayName}
                      width={80}
                      height={80}
                      className="max-h-16 max-w-16 transition group-hover:scale-110 sm:max-h-20 sm:max-w-20"
                    />
                  </span>
                  <span className="block break-words text-xs font-black text-slate-700 sm:text-sm dark:text-slate-200">{variety.displayName}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <AbilityShowcase
          pokemonName={pokemon.displayName}
          mainType={mainType}
          color={hexColor}
          abilities={pokemon.abilities}
          generationLabel={pokemon.generation?.label ?? "Special Form"}
          modelUrl={pokemon.media.modelUrl}
          videoUrl={pokemon.media.videoUrl}
          mediaAssets={pokemon.mediaAssets}
        />
      </div>
    </div>
  );
}
