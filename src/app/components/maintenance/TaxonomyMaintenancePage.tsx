"use client";

import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

export function TaxonomyMaintenancePage({ entity }: { entity: "regiones" | "tipos" }) {
  const store = useMaintenanceStore();
  const items = entity === "regiones" ? store.regions : store.types;
  const title = entity === "regiones" ? "Regions" : "Pokemon Types";
  const singular = entity === "regiones" ? "region" : "type";

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Maintenance list with create, edit, and delete actions.
          </p>
        </div>
        <Link
          href={`/${entity}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
        >
          <Plus className="h-4 w-4" />
          Create {singular}
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/20">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <span>Name</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4">
              <span className="font-black text-slate-900 dark:text-white">{item.name}</span>
              <div className="flex gap-2">
                <Link
                  href={`/${entity}/${item.id}/edit`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                  aria-label={`Edit ${item.name}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${entity}/${item.id}/delete`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-300"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
