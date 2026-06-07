"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function TaxonomyFormPage({
  entity,
  mode,
  itemId,
}: {
  entity: "regiones" | "tipos";
  mode: "create" | "edit";
  itemId?: string;
}) {
  const router = useRouter();
  const store = useMaintenanceStore();
  const items = entity === "regiones" ? store.regions : store.types;
  const item = useMemo(() => items.find((entry) => entry.id === itemId), [itemId, items]);
  const [name, setName] = useState(item?.name ?? "");
  const [submitted, setSubmitted] = useState(false);
  const singular = entity === "regiones" ? "region" : "type";

  useEffect(() => {
    if (mode === "edit" && item) setName(item.name);
  }, [item, mode]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!name.trim()) return;

    if (entity === "regiones") {
      if (mode === "edit" && itemId) store.updateRegion(itemId, name.trim());
      else store.createRegion(name.trim());
    } else {
      if (mode === "edit" && itemId) store.updateType(itemId, name.trim());
      else store.createType(name.trim());
    }

    router.push(`/${entity}`);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/${entity}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {entity}
      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20 sm:p-8"
      >
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">
          {mode === "edit" ? `Edit ${singular}` : `Create ${singular}`}
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Name is required.
        </p>

        <label className="mt-8 grid gap-2">
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </label>

        {submitted && !name.trim() && (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-950/20 dark:text-red-300">
            Name is required.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/${entity}`}
            className="inline-flex justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
          >
            Back
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            <Save className="h-4 w-4" />
            {mode === "edit" ? `Save ${singular}` : `Create ${singular}`}
          </button>
        </div>
      </form>
    </section>
  );
}
