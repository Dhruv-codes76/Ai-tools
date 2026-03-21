"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useEffect, useState, useRef } from "react";
import { Home, Newspaper, Wrench, Menu } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [menuOpen, setMenuOpen] = useState(false);

    // Hide the standard top navbar entirely on the mobile Reels view
    // so it doesn't interrupt the edge-to-edge experience. We'll show it everywhere else.
    const isMobileReels = pathname === "/news";

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
            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 backdrop-blur-xl bg-background/80 border-b border-border/40 transition-transform duration-300 ease-in-out z-50 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                } ${isMobileReels ? "hidden md:block" : "block"}`}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group shrink-0">
                            <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                                AI Portal
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex space-x-8 lg:space-x-12 items-center absolute left-1/2 transform -translate-x-1/2 h-full">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href} prefetch={true}
                                        className={`text-sm tracking-wide transition-all duration-300 relative py-2 font-medium flex items-center h-full ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full"></span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
                            <ThemeToggle />
                            <UserMenu />

                            <div className="relative flex items-center justify-center">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors hidden md:flex items-center justify-center"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-card border border-border overflow-hidden animate-fade-in origin-top-right">
                                        <Link
                                            href="/admin/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
            {/* Spacer for fixed top navbar */}
            <div className={`h-16 ${isMobileReels ? "hidden md:block" : "block"}`}></div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.1)]">
                <div className="flex justify-around items-center h-16 px-2 w-full mx-auto">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href} prefetch={true}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group ${
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "fill-current scale-110" : "group-hover:scale-110 group-active:scale-95"}`} />
                                    {isActive && (
                                        <div className="absolute -inset-1 bg-foreground/10 rounded-full blur-md -z-10" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100 font-semibold' : 'opacity-80'}`}>{link.name}</span>
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-foreground rounded-b-full shadow-[0_0_8px_currentColor]"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
