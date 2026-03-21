"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-full bg-transparent" aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";

    const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
        const nextTheme = isDark ? "light" : "dark";

        /**
         * Fallback for browsers that don't support View Transitions API
         */
        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(nextTheme);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];

            // Animate depending on whether we're going dark or light
            document.documentElement.animate(
                {
                    clipPath: isDark ? clipPath.slice().reverse() : clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in",
                    pseudoElement: isDark
                        ? "::view-transition-old(root)"
                        : "::view-transition-new(root)",
                }
            );
        });
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                transition-colors duration-300 ease-in-out focus:outline-none hover:bg-muted/50 premium-hover premium-active
            `}
            aria-label="Toggle Dark Mode"
            title="Toggle Theme"
        >
            <div className="relative flex items-center justify-center">
                <Sun className={`w-5 h-5 absolute transition-all duration-500 ${isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0 text-foreground'}`} />
                <Moon className={`w-5 h-5 absolute transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0 text-foreground' : 'opacity-0 scale-50 -rotate-90'}`} />
            </div>
        </button>
    );
}
