"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DynamicBackground() {
    const { resolvedTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (resolvedTheme === "light") {
        return (
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-background transition-colors duration-500" />
        );
    }

    // Dynamic background for dark mode, subtle, YouTube Music style
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
            <div
                className="absolute inset-[-50%] opacity-40 blur-[100px] mix-blend-screen transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 2 - 1}%, ${mousePosition.y * 2 - 1}%)`,
                    background: "radial-gradient(circle at 40% 40%, rgba(76, 29, 149, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(29, 78, 216, 0.3) 0%, transparent 40%)",
                }}
            />
            <div className="absolute inset-0 bg-black/60 z-[-1]" />
        </div>
    );
}
