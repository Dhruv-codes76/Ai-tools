"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

export interface LogoProps {
    size?: LogoSize;
    className?: string;
    disableLink?: boolean;
}

export default function Logo({ size = "md", className = "", disableLink = false }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    const textClasses = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-3xl"
    };

    // Before mounting, render a skeleton to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className={`${sizeClasses[size]} rounded-lg bg-muted animate-pulse`} />
                <div className={`h-6 w-24 bg-muted animate-pulse rounded`} />
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    const content = (
        <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
            <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br ${isDark ? 'from-indigo-500/20 to-purple-600/10 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'from-indigo-500/10 to-purple-600/5 border border-indigo-500/20 shadow-sm'} ${sizeClasses[size]} transition-all duration-300 group-hover:scale-[1.05]`}>
                {/* SVG Logo Icon (Abstract Tech/AI shape) */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-[60%] h-[60%] ${isDark ? 'text-white' : 'text-indigo-600'}`}
                >
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 8L16 12L12 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 12H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span className={`font-sans font-bold tracking-tight ${textClasses[size]} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Portal
            </span>
        </div>
    );

    if (disableLink) {
        return content;
    }

    return (
        <Link href="/">
            {content}
        </Link>
    );
}
