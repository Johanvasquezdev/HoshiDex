"use client";

import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  DEFAULT_ADVANCED_FILTERS,
  POKEMON_TYPES,
  getActiveFilterChips,
  type AdvancedFilters,
} from "@/lib/pokemon/advanced-filters";

type NumericFilterKey = Extract<
  keyof AdvancedFilters,
  | "minHp"
  | "minAttack"
  | "minDefense"
  | "minSpecialAttack"
  | "minSpecialDefense"
  | "minSpeed"
  | "minHeight"
  | "maxHeight"
  | "minWeight"
  | "maxWeight"
>;

const statInputs: Array<{ key: NumericFilterKey; label: string; placeholder: string }> = [
  { key: "minHp", label: "HP", placeholder: "70+" },
  { key: "minAttack", label: "ATK", placeholder: "90+" },
  { key: "minDefense", label: "DEF", placeholder: "80+" },
  { key: "minSpecialAttack", label: "SPA", placeholder: "90+" },
  { key: "minSpecialDefense", label: "SPD", placeholder: "80+" },
  { key: "minSpeed", label: "SPE", placeholder: "100+" },
];

const bodyInputs: Array<{ key: NumericFilterKey; label: string; placeholder: string }> = [
  { key: "minHeight", label: "Min m", placeholder: "1.0" },
  { key: "maxHeight", label: "Max m", placeholder: "2.5" },
  { key: "minWeight", label: "Min kg", placeholder: "10" },
  { key: "maxWeight", label: "Max kg", placeholder: "120" },
];

export function AdvancedFilterPanel({
  filters,
  onChange,
}: {
  filters: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
}) {
  const activeChips = getActiveFilterChips(filters);

  function updateFilter<K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleType(type: string) {
    updateFilter(
      "types",
      filters.types.includes(type)
        ? filters.types.filter((current) => current !== type)
        : [...filters.types, type],
    );
  }

  function updateNumber(key: NumericFilterKey, value: string) {
    const parsed = Number(value);
    updateFilter(key, value === "" || !Number.isFinite(parsed) ? null : parsed);
  }

  return (
    <aside className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-slate-950 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-[#101827]/95 dark:text-white dark:shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-600 dark:text-red-300">
            Analyzer
          </p>
          <h2 className="mt-1 text-xl font-black">Advanced filters</h2>
        </div>
        <SlidersHorizontal className="mt-1 h-5 w-5 text-red-600 dark:text-red-300" />
      </div>

      {activeChips.length > 0 && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 dark:border-red-300/20 dark:bg-red-500/10">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-700 dark:text-red-200">
              Active scan
            </p>
            <button
              type="button"
              onClick={() => onChange(DEFAULT_ADVANCED_FILTERS)}
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-600 transition hover:text-red-800 dark:text-red-100 dark:hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                {chip.label}
                <X className="h-3 w-3 text-slate-400 dark:text-white/60" />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Ability
          </span>
          <input
            value={filters.ability}
            onChange={(event) => updateFilter("ability", event.target.value)}
            placeholder="protean, blaze..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-300/60"
          />
        </label>

        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Type matrix
          </p>
          <div className="grid grid-cols-3 gap-2">
            {POKEMON_TYPES.map((type) => {
              const active = filters.types.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`rounded-full border px-2 py-1.5 text-[10px] font-black capitalize transition ${
                    active
                      ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-200/70 dark:border-red-200 dark:shadow-red-950/30"
                      : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Base stats
          </p>
          <div className="grid grid-cols-3 gap-2">
            {statInputs.map((input) => (
              <label key={input.key} className="block">
                <span className="mb-1 block text-[10px] font-black text-slate-500 dark:text-slate-500">
                  {input.label}
                </span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={filters[input.key] ?? ""}
                  onChange={(event) => updateNumber(input.key, event.target.value)}
                  placeholder={input.placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-red-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-red-300/60"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Physical profile
          </p>
          <div className="grid grid-cols-2 gap-2">
            {bodyInputs.map((input) => (
              <label key={input.key} className="block">
                <span className="mb-1 block text-[10px] font-black text-slate-500 dark:text-slate-500">
                  {input.label}
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={filters[input.key] ?? ""}
                  onChange={(event) => updateNumber(input.key, event.target.value)}
                  placeholder={input.placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-red-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-red-300/60"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Species flags
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["legendary", "Legend"],
              ["mythical", "Mythic"],
              ["baby", "Baby"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  updateFilter(key as "legendary" | "mythical" | "baby", !filters[key as "legendary" | "mythical" | "baby"])
                }
                className={`rounded-xl border px-2 py-2 text-[10px] font-black transition ${
                  filters[key as "legendary" | "mythical" | "baby"]
                    ? "border-sky-200 bg-sky-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
