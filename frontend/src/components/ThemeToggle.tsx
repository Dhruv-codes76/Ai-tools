"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {


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

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add micro-interaction: subtle instant scale down on click
    const button = e.currentTarget;
    button.style.transform = "scale(0.85)";
    setTimeout(() => {
      button.style.transform = "";
    }, 150);

    const nextTheme = isDark ? "light" : "dark";
    // Using instant Next Themes switch instead of View Transitions for a snappier feel
    // Smooth global crossfade is now handled natively via CSS transitions in globals.css
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-sm transition-all duration-300 ease-out hover:bg-slate-200 hover:scale-105 active:scale-95 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Moon className="h-[22px] w-[22px] text-blue-400 transition-transform duration-500 hover:rotate-[360deg]" />
          <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-md transition-opacity duration-300"></div>
        </>
      ) : (
        <>
          <Sun className="h-[22px] w-[22px] text-amber-500 transition-transform duration-500 hover:rotate-90" />
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md transition-opacity duration-300"></div>
        </>
      )}
    </button>
  );
}
