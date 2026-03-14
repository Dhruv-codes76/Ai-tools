"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShieldIcon from "@mui/icons-material/Shield";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Non-JSON API Response:", text);
                throw new Error("Invalid response from server. Check if API URL is configured correctly.");
            }

            if (!res.ok) {
                throw new Error(data?.error || `Login failed (Status: ${res.status})`);
            }

            // Store token securely
            localStorage.setItem("adminToken", data.token);

            // Redirect to dashboard
            router.push("/admin/dashboard");
            router.refresh();

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 glass-card rounded-3xl p-8 md:p-10 border-t-4 border-t-primary">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 p-3 rounded-2xl mb-4">
                        <ShieldIcon className="text-primary w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Admin Portal</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to manage news, tools, and system data.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-sm font-bold text-muted-foreground mb-1 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EmailIcon className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-bold text-muted-foreground mb-1 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 block w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg hover:shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Authenticating..." : "Sign In Securely"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
