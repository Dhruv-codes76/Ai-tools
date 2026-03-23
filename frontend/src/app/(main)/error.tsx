"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Main app area error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="bg-card border border-border/50 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
                {/* Decorative mesh gradient blob */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 relative z-10 text-red-500">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-sans font-bold text-foreground tracking-tight mb-3 relative z-10">
                    Transmission Failed
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
                    We lost connection to the database. The catalog is temporarily unavailable.
                </p>

                <button
                    onClick={() => reset()}
                    className="group relative z-10 w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold uppercase tracking-widest text-sm transition-all duration-300 active:scale-95 shadow-lg shadow-foreground/20"
                >
                    <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
                    Tap to Retry
                </button>
            </div>
        </div>
    );
}
