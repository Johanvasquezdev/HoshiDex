"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useMaintenanceStore, type MediaAssetFormValues } from "@/lib/maintenance/use-maintenance-store";

const emptyMediaAsset: MediaAssetFormValues = {
  pokemonId: "",
  abilityName: "",
  game: "",
  generation: null,
  kind: "model",
  url: "",
  sourceUrl: "",
};

export function MediaAssetFormPage({
  mode,
  assetId,
}: {
  mode: "create" | "edit";
  assetId?: string;
}) {
  const router = useRouter();
  const store = useMaintenanceStore();
  const existing = useMemo(
    () => store.mediaAssets.find((asset) => asset.id === assetId),
    [assetId, store.mediaAssets],
  );
  const [values, setValues] = useState<MediaAssetFormValues>(emptyMediaAsset);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existing) {
      setValues({
        pokemonId: existing.pokemonId,
        abilityName: existing.abilityName,
        game: existing.game,
        generation: existing.generation,
        kind: existing.kind,
        url: existing.url,
        sourceUrl: existing.sourceUrl,
      });
    } else if (mode === "create") {
      setValues((current) => ({
        ...current,
        pokemonId: current.pokemonId || store.pokemon[0]?.id || "",
      }));
    }
  }, [existing, mode, store.pokemon]);

  const missing = [
    !values.pokemonId && "pokemon",
    !values.kind && "kind",
    !values.url.trim() && "asset URL",
  ].filter(Boolean);

  function updateField<K extends keyof MediaAssetFormValues>(
    field: K,
    value: MediaAssetFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (missing.length > 0) return;

    if (mode === "edit" && assetId) store.updateMediaAsset(assetId, values);
    else store.createMediaAsset(values);

    router.push("/media-assets");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/media-assets"
        className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to media assets
      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20 sm:p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">
            {mode === "edit" ? "Edit Media Asset" : "Create Media Asset"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Pokemon, kind, and asset URL are required. Ability names should use PokeAPI slugs such as blaze or overgrow.
          </p>
        </div>

        <div className="grid gap-5">
          <SelectField
            label="Pokemon"
            value={values.pokemonId}
            onChange={(value) => updateField("pokemonId", value)}
            options={store.pokemon.map((pokemon) => ({ label: pokemon.name, value: pokemon.id }))}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Kind"
              value={values.kind}
              onChange={(value) => updateField("kind", value as MediaAssetFormValues["kind"])}
              options={[
                { label: "Model", value: "model" },
                { label: "Video", value: "video" },
              ]}
            />
            <TextField
              label="Ability name"
              value={values.abilityName}
              onChange={(value) => updateField("abilityName", value)}
              placeholder="Optional, e.g. blaze"
            />
          </div>
          <TextField
            label={values.kind === "video" ? "Video URL" : "Model URL"}
            value={values.url}
            onChange={(value) => updateField("url", value)}
            placeholder={values.kind === "video" ? "https://.../clip.mp4" : "https://.../model.glb"}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Game"
              value={values.game}
              onChange={(value) => updateField("game", value)}
              placeholder="Optional"
            />
            <NumberField
              label="Generation"
              value={values.generation}
              onChange={(value) => updateField("generation", value)}
            />
          </div>
          <TextField
            label="Source URL"
            value={values.sourceUrl}
            onChange={(value) => updateField("sourceUrl", value)}
            placeholder="Optional attribution or source"
          />
        </div>

        {submitted && missing.length > 0 && (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-950/20 dark:text-red-300">
            Required fields: {missing.join(", ")}.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/media-assets"
            className="inline-flex justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
          >
            Back
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            <Save className="h-4 w-4" />
            {mode === "edit" ? "Save Asset" : "Create Asset"}
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type="number"
        min={1}
        value={value ?? ""}
        placeholder="Optional"
        onChange={(event) => {
          const next = event.target.value;
          onChange(next ? Number(next) : null);
        }}
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
