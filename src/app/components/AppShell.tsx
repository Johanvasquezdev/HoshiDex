import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pokemones", label: "Pokemones" },
  { href: "/regiones", label: "Regiones" },
  { href: "/tipos", label: "Tipos" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-200 selection:text-red-950 dark:bg-[#07090f] dark:text-slate-100 dark:selection:bg-red-400/30 dark:selection:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#0b1020]/85 dark:shadow-black/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center">
              <span className="absolute inset-0 rounded-full bg-red-500/20 blur-md transition-opacity group-hover:opacity-80 dark:bg-red-400/25" />
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt=""
                width={32}
                height={32}
                className="relative transition-transform group-hover:rotate-12"
              />
            </span>
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-xl font-black text-transparent dark:from-red-300 dark:to-rose-400">
              HoshiDex
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center rounded-full border border-slate-200/80 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-white hover:text-red-600 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-red-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto border-t border-slate-200/70 px-4 py-2 dark:border-white/10 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
