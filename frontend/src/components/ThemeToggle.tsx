"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering only after mounting
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-sm transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
        <div className="h-5 w-5 opacity-0"></div>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-sm transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Moon className="h-[22px] w-[22px] text-blue-400" />
          <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-md"></div>
        </>
      ) : (
        <>
          <Sun className="h-[22px] w-[22px] text-amber-500" />
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md"></div>
        </>
      )}
    </button>
  );
}
