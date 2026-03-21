"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "icon" | "full";

export interface LogoProps {
    size?: LogoSize;
    variant?: LogoVariant;
    animated?: boolean;
    className?: string;
    disableLink?: boolean;
}

export default function Logo({ size = "md", variant = "icon", animated = true, className = "", disableLink = false }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sizeClasses = {
        sm: "h-6",
        md: "h-8",
        lg: "h-10"
    };

    // Before mounting, render a skeleton to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className={`${sizeClasses[size]} w-8 rounded-lg bg-muted animate-pulse`} />
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    // Choose logo source based on theme and variant
    const imgSrc = isDark
        ? (variant === "full" ? "/logos/logo-full-dark.png" : "/logos/logo-icon-dark.png")
        : (variant === "full" ? "/logos/logo-full-light.png" : "/logos/logo-icon-light.png");

    const altText = variant === "full" ? "AI Portal Logo" : "AI Portal Icon";

    const content = (
        <div className={`
            flex items-center justify-center cursor-pointer bg-transparent transition-colors duration-300 ease-in-out
            ${animated ? 'animate-premium-entry premium-hover premium-active' : ''}
            ${className}
        `}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imgSrc}
                alt={altText}
                className={`${sizeClasses[size]} w-auto object-contain bg-transparent transition-colors duration-300 ease-in-out`}
            />
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
