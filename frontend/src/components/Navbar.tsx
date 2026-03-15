"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "News", href: "/news" },
        { name: "Tools", href: "/tools" },
    ];

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="font-sans font-bold text-3xl tracking-tight text-foreground">
                            AI MVP
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
                                    className={`text-sm tracking-wide transition-colors relative group py-2 ${isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {link.name}
                                    {/* Minimal underline hover effect typical of editorial design */}
                                    <span className={`absolute left-0 bottom-0 w-full h-px transition-all duration-300 ${isActive ? 'bg-foreground' : 'bg-transparent group-hover:bg-muted-foreground'
                                        }`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link
                            href="/admin/login"
                            className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
