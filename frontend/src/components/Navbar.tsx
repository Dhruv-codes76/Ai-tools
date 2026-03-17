"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Only trigger hiding if we've scrolled down a reasonable amount
                    if (currentScrollY > 50) {
                        // Scrolling down
                        if (currentScrollY > lastScrollY.current) {
                            setIsVisible(false);
                        }
                        // Scrolling up
                        else {
                            setIsVisible(true);
                        }
                    } else {
                        // Always visible at the top
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
        { name: "Home", href: "/" },
        { name: "News", href: "/news" },
        { name: "Tools", href: "/tools" },
    ];

    return (
        <nav
            className={`sticky top-0 backdrop-blur-md bg-background/80 inset-x-0 z-50 border-b border-border transition-transform duration-300 ease-in-out ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group gap-3">
                        {/* Vector Logo representation */}
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_15px_rgba(0,191,255,0.4)]">
                            <span className="text-white font-heading font-black text-xl tracking-tighter">AI</span>
                        </div>
                        <span className="font-heading font-bold text-xl lg:text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
                            Portal Weekly
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-10 items-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm tracking-wide transition-all duration-300 relative group py-2 font-semibold ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                                        }`}
                                >
                                    {link.name}
                                    {/* Minimal underline hover effect typical of editorial design */}
                                    <span className={`absolute left-0 bottom-0 h-[2px] rounded-full transition-all duration-300 ${isActive ? 'bg-primary w-full' : 'bg-primary w-0 group-hover:w-full'
                                        }`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-6">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
