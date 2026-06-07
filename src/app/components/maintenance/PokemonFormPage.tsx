"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useMaintenanceStore, type PokemonFormValues } from "@/lib/maintenance/use-maintenance-store";

const emptyPokemon: PokemonFormValues = {
  name: "",
  imageUrl: "",
  regionId: "",
  primaryTypeId: "",
  secondaryTypeId: "",
};

export function PokemonFormPage({
  mode,
  pokemonId,
}: {
  mode: "create" | "edit";
  pokemonId?: string;
}) {
  const router = useRouter();
  const store = useMaintenanceStore();
  const existing = useMemo(
    () => store.pokemon.find((pokemon) => pokemon.id === pokemonId),
    [pokemonId, store.pokemon],
  );
  const [values, setValues] = useState<PokemonFormValues>(emptyPokemon);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existing) {
      setValues({
        name: existing.name,
        imageUrl: existing.imageUrl,
        regionId: existing.regionId,
        primaryTypeId: existing.primaryTypeId,
        secondaryTypeId: existing.secondaryTypeId,
      });
    } else if (mode === "create") {
      setValues((current) => ({
        ...current,
        regionId: current.regionId || store.regions[0]?.id || "",
        primaryTypeId: current.primaryTypeId || store.types[0]?.id || "",
        secondaryTypeId: current.secondaryTypeId || store.types[1]?.id || store.types[0]?.id || "",
      }));
    }
  }, [existing, mode, store.regions, store.types]);

  const missing = [
    !values.name.trim() && "name",
    !values.imageUrl.trim() && "photo",
    !values.regionId && "region",
    !values.primaryTypeId && "primary type",
    !values.secondaryTypeId && "secondary type",
  ].filter(Boolean);

  function updateField(field: keyof PokemonFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (missing.length > 0) return;

    if (mode === "edit" && pokemonId) store.updatePokemon(pokemonId, values);
    else store.createPokemon(values);

    router.push("/pokemones");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/pokemones"
        className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pokemones
      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20 sm:p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">
            {mode === "edit" ? "Edit Pokemon" : "Create Pokemon"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Name, photo, region, primary type, and secondary type are required.
          </p>
        </div>

        <div className="grid gap-5">
          <TextField
            label="Pokemon name"
            value={values.name}
            onChange={(value) => updateField("name", value)}
          />
          <TextField
            label="Photo URL"
            value={values.imageUrl}
            onChange={(value) => updateField("imageUrl", value)}
          />
          {values.imageUrl && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <img src={values.imageUrl} alt="" className="h-32 w-32 object-contain" />
            </div>
          )}
          <SelectField
            label="Region"
            value={values.regionId}
            onChange={(value) => updateField("regionId", value)}
            options={store.regions.map((region) => ({ label: region.name, value: region.id }))}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Primary type"
              value={values.primaryTypeId}
              onChange={(value) => updateField("primaryTypeId", value)}
              options={store.types.map((type) => ({ label: type.name, value: type.id }))}
            />
            <SelectField
              label="Secondary type"
              value={values.secondaryTypeId}
              onChange={(value) => updateField("secondaryTypeId", value)}
              options={store.types.map((type) => ({ label: type.name, value: type.id }))}
            />
          </div>
        </div>

        {submitted && missing.length > 0 && (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-950/20 dark:text-red-300">
            Required fields: {missing.join(", ")}.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/pokemones"
            className="inline-flex justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
          >
            Back
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            <Save className="h-4 w-4" />
            {mode === "edit" ? "Save Pokemon" : "Create Pokemon"}
          </button>
        </div>
      </form>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-[#111827] dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

