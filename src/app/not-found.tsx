import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center dark:bg-[#07090f]">
      <div>
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Pokémon not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">That entry is not in this HoshiDex index yet.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-500 dark:shadow-red-950/40 dark:hover:bg-red-400"
        >
          Back to HoshiDex
        </Link>
      </div>
    </main>
  );
}
