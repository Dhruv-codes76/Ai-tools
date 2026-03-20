"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import IdCardLogin from "@/components/auth/IdCardLogin";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/');
            } else {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative selection:bg-indigo-500/30">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">

                {/* Left Content (Desktop) / Hidden on Mobile */}
                <div className="hidden lg:flex flex-col flex-1 max-w-2xl animate-fade-in animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 w-fit mb-8 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" /> Welcome to the platform
                    </div>

                    <h1 className="text-5xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">conversation</span> today.
                    </h1>

                    <p className="text-lg xl:text-xl text-white/60 mb-10 max-w-xl leading-relaxed">
                        Sign in to share your insights, connect with other enthusiasts, and unlock the full potential of our AI intelligence platform.
                    </p>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                                <Zap className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Instant Access</h3>
                                <p className="text-white/50 text-sm leading-relaxed">Join instantly with your Google account. No long forms or complex setups required.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                                <ShieldCheck className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Secure & Private</h3>
                                <p className="text-white/50 text-sm leading-relaxed">Your data is secured with enterprise-grade encryption. We never share your personal information.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content (ID Card Login) */}
                <div className="w-full lg:w-auto flex-1 flex justify-center lg:justify-end mt-16 lg:mt-0">
                    <IdCardLogin />
                </div>

            </div>
        </div>
    );
}
