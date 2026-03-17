"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder with the same dimensions to prevent layout shift
        return <div className="w-16 h-8 rounded-full bg-border" aria-hidden="true" />;
    }

    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative flex items-center justify-between w-16 h-8 p-1 rounded-full
                transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50
                shadow-inner overflow-hidden border border-border/50
                ${isDark ? "bg-slate-900/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" : "bg-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"}
            `}
            aria-label="Toggle Dark Mode"
            title="Toggle Theme"
        >
            {/* Background glowing effect for dark mode (starry/aurora feel) */}
            <div
                className={`
                    absolute inset-0 transition-opacity duration-500 pointer-events-none
                    ${isDark ? "opacity-100 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-transparent" : "opacity-0"}
                `}
            />

            {/* Icons behind the slider */}
            <div className="absolute left-2 flex items-center justify-center pointer-events-none">
                 <Sun className={`w-4 h-4 text-amber-500 transition-all duration-500 ${isDark ? 'opacity-30 scale-75' : 'opacity-100 scale-100 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
            </div>

            <div className="absolute right-2 flex items-center justify-center pointer-events-none">
                 <Moon className={`w-4 h-4 text-indigo-400 transition-all duration-500 ${isDark ? 'opacity-100 scale-100 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'opacity-30 scale-75'}`} />
            </div>

            {/* Sliding Knob */}
            <div
                className={`
                    absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md
                    transform transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-10
                    ${isDark
                        ? "translate-x-8 bg-slate-800 border border-slate-700/50 shadow-[0_0_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "translate-x-0 bg-white border border-slate-200 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.05)]"
                    }
                `}
            >
               {/* Inner glow on the knob */}
               <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isDark ? 'opacity-100 bg-gradient-to-br from-indigo-500/10 to-transparent' : 'opacity-100 bg-gradient-to-br from-amber-200/20 to-transparent'}`} />
            </div>
        </button>
    );
}
