"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DynamicBackground() {
    const { resolvedTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        let requestId: number;

        const handleMouseMove = (e: MouseEvent) => {
            requestId = requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                setMousePosition({ x, y });
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(requestId);
        };
    }, []);

    if (resolvedTheme === "light") {
        return (
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#FAFAFA] transition-colors duration-500" />
        );
    }

    // Dynamic background for dark mode, highly premium and subtle
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#05050A]">
            <div
                className="absolute inset-[-50%] opacity-30 blur-[120px] mix-blend-screen transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${(mousePosition.x - 0.5) * 4}%, ${(mousePosition.y - 0.5) * 4}%)`,
                    background: "radial-gradient(circle at 40% 40%, rgba(30, 58, 138, 0.4) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(88, 28, 135, 0.2) 0%, transparent 50%)",
                }}
            />
            <div className="absolute inset-0 bg-[#05050A]/40 z-[-1]" />
        </div>
    );
}
