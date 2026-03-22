/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import UserMenu from "../UserMenu";
import { useEffect, useState, useRef, useMemo } from "react";
import { Home, Newspaper, Wrench, Menu, Search, X, Clock, TrendingUp, Info } from "lucide-react";
import Logo from "../Logo";

export default function Navbar({ newsItems = [] }: { newsItems?: any[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [menuOpen, setMenuOpen] = useState(false);

    // Search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                            // Close search and menu on scroll down
                            setIsSearchOpen(false);
                            setMenuOpen(false);
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

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("recentSearches");
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent searches", e);
            }
        }
    }, []);

    // Save recent searches when updated
    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    // Close search on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close search on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchQuery(""); // clear on close
        }
    }, [isSearchOpen]);

    // Debounce search query (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search functionality hooks
    const trendingTopics = useMemo(() => {
        // Predefined or top news items. For now, just take the first 5 news titles
        return newsItems.slice(0, 5).map((item) => item.title || item.name);
    }, [newsItems]);

    const searchResults = useMemo(() => {
        if (!debouncedQuery.trim()) return [];

        const query = debouncedQuery.toLowerCase();
        const results = newsItems.filter(item => {
            const title = (item.title || item.name || "").toLowerCase();
            const description = (item.description || item.excerpt || "").toLowerCase();

            // Fuzzy search logic (approximate match / typo tolerance)
            // 1. Direct inclusion
            if (title.includes(query) || description.includes(query)) return true;

            // 2. Split query by spaces and check if all words exist
            const words = query.split(/\s+/).filter(Boolean);
            if (words.length > 1) {
                const allWordsMatch = words.every(word => title.includes(word) || description.includes(word));
                if (allWordsMatch) return true;
            }
            return false;
        });

        // Limit results to top 5-8
        return results.slice(0, 6);
    }, [debouncedQuery, newsItems]);

    const handleSearchSelect = (query: string, navigateUrl?: string) => {
        // Add to recent searches if not already there, and keep max 5
        setRecentSearches(prev => {
            const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
            return [query, ...filtered].slice(0, 5);
        });

        setIsSearchOpen(false);
        setSearchQuery("");

        if (navigateUrl) {
            router.push(navigateUrl);
        }
    };

    const clearRecentSearches = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering input focus
        setRecentSearches([]);
    };

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "News", href: "/news", icon: Newspaper },
        { name: "Tools", href: "/tools", icon: Wrench },
        { name: "About", href: "/about", icon: Info },
    ];

    // Helper for highlight matching text
    const highlightMatch = (text: string, query: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ?
            <span key={i} className="text-blue-600 dark:text-blue-400 font-bold bg-blue-100/30 dark:bg-blue-900/30 rounded px-0.5">{part}</span>
            : <span key={i}>{part}</span>
        );
    };

    return (
        <>
            {/* Backdrop blur layer for search overlay */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-30 bg-foreground/10 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSearchOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 backdrop-blur-xl bg-background/90 border-b border-border shadow-sm dark:shadow-none transition-transform duration-300 ease-in-out z-50 pt-safe ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                } ${isMobileReels && !isSearchOpen ? "hidden md:block" : "block"}`}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16 relative">
                        <Link href="/" className="flex items-center justify-center gap-2 md:gap-3 shrink-0 group">
                            <Logo size="lg" variant="icon" animated={true} disableLink={true} className="shrink-0 group-hover:scale-105 transition-transform" />
                            <span className="font-bold tracking-tight text-lg md:text-xl text-foreground transition-colors duration-300 ease-in-out group-hover:opacity-80 leading-none flex items-center">
                                AI Portal
                            </span>
                        </Link>

                        {/* Desktop Nav - Hide when search is expanded on smaller screens */}
                        <div className={`hidden md:flex space-x-8 lg:space-x-12 items-center absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href} prefetch={true}
                                        className={`text-sm tracking-wide transition-all duration-300 relative py-2 font-medium ${isActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 shrink-0 h-full">
                            {/* Search Container */}
                            <div className="relative flex items-center" ref={searchRef}>
                                <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-muted/50 border border-transparent rounded-full ${isSearchOpen ? 'w-[140px] sm:w-[220px] md:w-[260px] lg:w-[300px] px-3 py-1.5 border-border' : 'w-8 h-8 sm:w-10 sm:h-10 justify-center'}`}>
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className={`text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ${!isSearchOpen ? 'w-full h-full flex items-center justify-center' : ''}`}
                                    >
                                        <Search className={isSearchOpen ? "w-4 h-4" : "w-5 h-5"} />
                                    </button>

                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`bg-transparent outline-none border-none text-sm text-foreground placeholder:text-muted-foreground ml-2 transition-all duration-300 w-full ${isSearchOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 w-0 absolute'}`}
                                        onFocus={() => setIsSearchOpen(true)}
                                    />

                                    {isSearchOpen && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setIsSearchOpen(false);
                                            }}
                                            className="text-muted-foreground hover:text-foreground ml-1 p-1 rounded-full flex-shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="block">
                                <ThemeToggle />
                            </div>
                            <UserMenu />

                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors hidden md:flex items-center justify-center"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-card border border-border overflow-hidden animate-fade-in origin-top-right z-50">
                                        <Link
                                            href="/admin/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted premium-active transition-colors"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropdown Full Width Overlay (Attached below the navbar) */}
                {isSearchOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 w-full bg-card shadow-xl backdrop-blur-2xl border-b border-border shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-b-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-40 overflow-hidden"
                    >
                        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
                            {!debouncedQuery.trim() ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                                    {/* Recent Searches */}
                                    <div className={recentSearches.length > 0 ? "block" : "hidden md:block opacity-50 pointer-events-none"}>
                                        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                                            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors duration-300 ease-in-out">Recent Searches</h3>
                                            {recentSearches.length > 0 && (
                                                <button onClick={clearRecentSearches} className="text-xs font-medium text-blue-600 hover:underline px-2 py-1 rounded-md hover:bg-muted transition-colors">Clear</button>
                                            )}
                                        </div>
                                        <ul className="space-y-1">
                                            {recentSearches.length > 0 ? recentSearches.map((query, idx) => (
                                                <li key={idx}>
                                                    <button
                                                        onClick={() => {
                                                            setSearchQuery(query);
                                                            inputRef.current?.focus();
                                                        }}
                                                        className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-muted premium-active rounded-lg transition-colors duration-200 flex items-center group"
                                                    >
                                                        <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                        <span className="truncate flex-1 font-medium text-foreground transition-colors duration-300 ease-in-out">{query}</span>
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="text-sm text-muted-foreground py-3 px-3 italic">No recent searches</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Trending Topics */}
                                    <div>
                                        <div className="flex items-center mb-3 border-b border-border pb-2">
                                            <TrendingUp className="w-4 h-4 mr-2 text-rose-500" />
                                            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors duration-300 ease-in-out">Trending Now</h3>
                                        </div>
                                        <ul className="space-y-1">
                                            {trendingTopics.map((topic, idx) => (
                                                <li key={idx}>
                                                    <button
                                                        onClick={() => {
                                                            setSearchQuery(topic);
                                                            inputRef.current?.focus();
                                                        }}
                                                        className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-muted premium-active rounded-lg transition-colors duration-200 flex items-center group"
                                                    >
                                                        <Search className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                                                        <span className="truncate flex-1 font-medium text-foreground transition-colors duration-300 ease-in-out">{topic}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors duration-300 ease-in-out">Results for &quot;{debouncedQuery}&quot;</h3>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{searchResults.length} found</span>
                                    </div>

                                    {/* Search Results */}
                                    {searchResults.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {searchResults.map((item) => (
                                                <button
                                                    key={item._id || item.slug}
                                                    onClick={() => handleSearchSelect(item.title || item.name, `/news/${item.slug}`)}
                                                    className="w-full text-left p-3 sm:p-4 hover:bg-muted premium-active border-b border-border last:border-b-0 rounded-lg transition-all duration-300 group flex items-start space-x-4"
                                                >
                                                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <Newspaper className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm sm:text-base font-semibold text-foreground line-clamp-1 mb-1 transition-colors">
                                                            {highlightMatch(item.title || item.name || "", debouncedQuery)}
                                                        </p>
                                                        {(item.description || item.excerpt) && (
                                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                                {highlightMatch(item.description || item.excerpt || "", debouncedQuery)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 sm:py-20 text-center flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-medium text-foreground">No results found for &quot;{debouncedQuery}&quot;</p>
                                            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">We couldn&apos;t find any articles matching your search. Try checking for typos or using broader keywords.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-[60px] px-2 w-full max-w-md mx-auto">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href} prefetch={true}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group ${
                                    isActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "fill-current scale-110" : "group-hover:scale-110 premium-active"}`} />
                                    {isActive && (
                                        <div className="absolute -inset-1 bg-muted/50 rounded-full blur-sm -z-10" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>{link.name}</span>
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-foreground rounded-b-full shadow-[0_0_8px_currentColor]"></div>
                                )}
                            </Link>
                        );
                    })}
                    {/* Mobile Search Button */}
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setTimeout(() => {
                                setIsSearchOpen(true);
                                inputRef.current?.focus();
                            }, 300);
                        }}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group ${
                            isSearchOpen ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <div className="relative flex items-center justify-center">
                            <Search className={`w-5 h-5 transition-transform duration-300 ${isSearchOpen ? "stroke-[2.5] scale-110" : "group-hover:scale-110 premium-active"}`} />
                            {isSearchOpen && (
                                <div className="absolute -inset-1 bg-muted/50 rounded-full blur-sm -z-10" />
                            )}
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide transition-all ${isSearchOpen ? 'opacity-100' : 'opacity-70'}`}>Search</span>
                        {isSearchOpen && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-foreground rounded-b-full shadow-[0_0_8px_currentColor]"></div>
                        )}
                    </button>
                </div>
            </nav>
        </>
    );
}
