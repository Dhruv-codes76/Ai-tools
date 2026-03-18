"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";
import { Home, Newspaper, Wrench, Menu } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (currentScrollY > 50) {
                        if (currentScrollY > lastScrollY.current) {
                            setIsVisible(false);
                        } else {
                            setIsVisible(true);
                        }
                    } else {
                        setIsVisible(true);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "News", href: "/news", icon: Newspaper },
        { name: "Tools", href: "/tools", icon: Wrench },
    ];

    return (
        <>
            <nav
                className={`sticky top-0 backdrop-blur-xl bg-background/50 border-b border-white/10 dark:border-white/5 transition-transform duration-300 ease-in-out z-50 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="w-full">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group ml-4">
                            <span className="font-sans font-bold text-xl tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                                AI Portal
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex space-x-8 items-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`text-sm tracking-wide transition-all duration-300 relative py-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span className="absolute left-0 bottom-0 h-0.5 w-full bg-foreground rounded-full"></span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 mr-4">
                            <ThemeToggle />

                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-card border border-border overflow-hidden">
                                        <Link
                                            href="/admin/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
                                <span className="text-[10px] font-medium tracking-wide">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
