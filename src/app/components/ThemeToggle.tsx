"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      title={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-red-400/40 dark:hover:text-red-300"
    >
      {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
