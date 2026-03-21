"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";


export default function UserMenu() {
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch current user
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        fetchUser();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    // const router = import("next/navigation").then(m => m.useRouter());
    const handleLogin = async () => {
        window.location.href = "/login";
        return;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Error logging in with Google:', error?.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 overflow-hidden cursor-pointer transition-transform duration-200 active:scale-95 bg-white/5 hover:bg-white/10"
            >
                {user && user.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <User className="w-4 h-4 text-foreground/80" />
                )}
            </button>

            {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-3 overflow-hidden animate-fade-in origin-top-right z-50 transition-all duration-150 scale-100 opacity-100">
                    {!user ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-center text-muted-foreground mb-2">Sign in to join the conversation</p>
                            <button
                                onClick={handleLogin}
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black py-2.5 px-3 rounded-lg font-semibold transition-all duration-200"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="px-2 py-2 mb-2 border-b border-white/10">
                                <p className="text-sm font-semibold text-foreground truncate">{user.user_metadata?.full_name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
