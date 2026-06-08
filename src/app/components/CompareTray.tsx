"use client";

import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { BarChart3, ChevronUp, X } from "lucide-react";
import { Radar } from "react-chartjs-2";
import type { PokemonSummary } from "@/lib/pokemon/types";
import { MAX_COMPARE_POKEMON } from "@/lib/pokemon/compare";
import { typeHexColors } from "./type-styles";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const statLabels = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];
const statKeys = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const;

export function CompareTray({
  selected,
  onRemove,
  onClear,
}: {
  selected: PokemonSummary[];
  onRemove: (id: number) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const chartData = useMemo(
    () => ({
      labels: statLabels,
      datasets: selected.map((pokemon, index) => {
        const color = typeHexColors[pokemon.types[0] ?? "normal"] ?? "#EF4444";
        return {
          label: pokemon.displayName,
          data: statKeys.map((key) => pokemon.baseStats?.[key] ?? 0),
          backgroundColor: `${color}26`,
          borderColor: color,
          borderWidth: 2,
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointRadius: 3 + index * 0.2,
        };
      }),
    }),
    [selected],
  );

  if (selected.length === 0) return null;

  return (
    <section className="sticky bottom-4 z-40 mt-8 rounded-[1.4rem] border border-red-300/30 bg-[#0f172a]/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
            Compare mode
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-black">
            <BarChart3 className="h-5 w-5 text-red-300" />
            {selected.length} selected
            <span className="text-xs text-slate-400">/ {MAX_COMPARE_POKEMON}</span>
          </h2>
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap gap-2 lg:justify-center">
          {selected.map((pokemon) => (
            <div
              key={pokemon.id}
              className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2"
            >
              <img
                src={pokemon.media.primary ?? pokemon.media.fallback}
                alt=""
                className="h-9 w-9 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-black">{pokemon.displayName}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  #{pokemon.id.toString().padStart(3, "0")} {pokemon.types.join(" / ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(pokemon.id)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={`Remove ${pokemon.displayName} from compare`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500"
          >
            <ChevronUp className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
            Analysis
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 xl:grid-cols-[minmax(0,420px)_1fr]">
          <div className="h-80 rounded-2xl border border-white/10 bg-black/20 p-4">
            <Radar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: { color: "rgba(255,255,255,0.14)" },
                    grid: { color: "rgba(255,255,255,0.12)" },
                    pointLabels: {
                      color: "#cbd5e1",
                      font: { size: 10, weight: "bold" },
                    },
                    ticks: { display: false },
                    min: 0,
                    max: 255,
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#e2e8f0", boxWidth: 10, font: { size: 11 } },
                  },
                  tooltip: { backgroundColor: "rgba(2,6,23,0.95)" },
                },
              }}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {selected.map((pokemon) => (
              <article
                key={pokemon.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {pokemon.generation?.region ?? "Special"}
                </p>
                <h3 className="mt-1 truncate text-base font-black">{pokemon.displayName}</h3>
                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <p>Types: {pokemon.types.join(" / ")}</p>
                  <p>Abilities: {pokemon.abilityNames?.join(", ") || "Unknown"}</p>
                  <p>
                    Body: {pokemon.heightM?.toFixed(1) ?? "?"}m /{" "}
                    {pokemon.weightKg?.toFixed(1) ?? "?"}kg
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
