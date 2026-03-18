"use client";

import LoginCard from "@/components/LoginCard";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/');
            } else {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white/80 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0E0E10]">
            {/* Desktop Left Side - Video Background */}
            <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden bg-black border-r border-white/5 shadow-2xl z-0">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 transition-opacity duration-1000"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-background-with-colored-light-spheres-moving-30311-large.mp4" type="video/mp4" />
                </video>
                <div className="z-20 p-16 max-w-2xl text-left mt-auto pb-32">
                    <h1 className="text-5xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
                        Unbiased AI Insights. <br />
                        <span className="text-white/60">Absolute clarity.</span>
                    </h1>
                    <p className="text-xl text-white/80 font-medium max-w-lg leading-relaxed drop-shadow-lg border-l-4 border-white/20 pl-6 py-2">
                        Filter the robust signal from the incessant noise. Join the intelligence directory to supercharge your workflow.
                    </p>
                </div>
            </div>

            {/* Mobile / Right Side Login Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#0A0A0A]/95 md:bg-[#0A0A0A] md:max-w-xl 2xl:max-w-2xl animate-fade-in shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)]">
                {/* Ambient glow behind card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

                <div className="w-full relative z-10 flex justify-center py-20">
                    <LoginCard />
                </div>
            </div>
        </div>
    );
}
