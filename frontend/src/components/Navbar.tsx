"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useEffect, useState, useRef, useMemo } from "react";
import { Home, Newspaper, Wrench, Menu, Search, X, Clock, TrendingUp } from "lucide-react";

export default function Navbar({ newsItems = [] }: { newsItems?: any[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [menuOpen, setMenuOpen] = useState(false);

    // Search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

    // Search functionality hooks
    const trendingTopics = useMemo(() => {
        // Predefined or top news items. For now, just take the first 5 news titles
        return newsItems.slice(0, 5).map((item) => item.title || item.name);
    }, [newsItems]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
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
    }, [searchQuery, newsItems]);

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
            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border-b border-gray-200 dark:border-white/10 transition-transform duration-300 ease-in-out z-50 pt-safe ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                } ${isMobileReels ? "hidden md:block" : "block"}`}
            >
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16 relative">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group shrink-0">
                            <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-gray-900 dark:text-white transition-transform duration-300 group-hover:scale-[1.02]">
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
                                        className={`text-sm tracking-wide transition-all duration-300 relative py-2 font-medium ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 shrink-0 h-full">
                            {/* Search Container */}
                            <div className="relative flex items-center" ref={searchRef}>
                                <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-full ${isSearchOpen ? 'w-[200px] sm:w-[300px] md:w-[340px] px-3 py-1.5 border-gray-200 dark:border-white/10' : 'w-8 h-8 sm:w-10 sm:h-10 justify-center'}`}>
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0 ${!isSearchOpen ? 'w-full h-full flex items-center justify-center' : ''}`}
                                    >
                                        <Search className={isSearchOpen ? "w-4 h-4" : "w-5 h-5"} />
                                    </button>

                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`bg-transparent outline-none border-none text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ml-2 transition-all duration-300 w-full ${isSearchOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 w-0 absolute'}`}
                                        onFocus={() => setIsSearchOpen(true)}
                                    />

                                    {isSearchOpen && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setIsSearchOpen(false);
                                            }}
                                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ml-1 p-1 rounded-full flex-shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown */}
                                {isSearchOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-[100vw] sm:w-[340px] md:w-[400px] bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] sm:max-h-[60vh] overflow-y-auto right-[-1rem] sm:right-0">
                                        <div className="p-2">
                                            {!searchQuery.trim() ? (
                                                <div className="space-y-4">
                                                    {/* Recent Searches */}
                                                    {recentSearches.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center justify-between px-3 py-2">
                                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent</h3>
                                                                <button onClick={clearRecentSearches} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear</button>
                                                            </div>
                                                            <ul className="space-y-1">
                                                                {recentSearches.map((query, idx) => (
                                                                    <li key={idx}>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSearchQuery(query);
                                                                                inputRef.current?.focus();
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center group"
                                                                        >
                                                                            <Clock className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                                                                            {query}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Trending Topics */}
                                                    <div>
                                                        <div className="px-3 py-2">
                                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                                                                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                                                                Trending
                                                            </h3>
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {trendingTopics.map((topic, idx) => (
                                                                <li key={idx}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSearchQuery(topic);
                                                                            inputRef.current?.focus();
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors truncate"
                                                                    >
                                                                        <Search className="w-3.5 h-3.5 mr-3 inline-block text-gray-400" />
                                                                        {topic}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    {/* Search Results */}
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((item) => (
                                                            <button
                                                                key={item._id || item.slug}
                                                                onClick={() => handleSearchSelect(item.title || item.name, `/news/${item.slug}`)}
                                                                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors group flex items-start space-x-3"
                                                            >
                                                                <div className="flex-shrink-0 mt-1">
                                                                    <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                        {highlightMatch(item.title || item.name || "", searchQuery)}
                                                                    </p>
                                                                    {(item.description || item.excerpt) && (
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                                                            {highlightMatch(item.description || item.excerpt || "", searchQuery)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-8 text-center">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">No results found for &quot;{searchQuery}&quot;</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different keyword or check spelling.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hidden sm:block">
                                <ThemeToggle />
                            </div>
                            <UserMenu />

                            <div className="relative flex items-center justify-center">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hidden md:flex items-center justify-center"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 overflow-hidden animate-fade-in origin-top-right">
                                        <Link
                                            href="/admin/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.3)]">
                <div className="flex justify-around items-center h-[60px] px-2 w-full max-w-md mx-auto">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href} prefetch={true}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group ${
                                    isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "fill-current scale-110" : "group-hover:scale-110 group-active:scale-95"}`} />
                                    {isActive && (
                                        <div className="absolute -inset-1 bg-gray-900/10 dark:bg-white/10 rounded-full blur-md -z-10" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100 font-semibold' : 'opacity-80'}`}>{link.name}</span>
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-900 dark:bg-white rounded-b-full shadow-[0_0_8px_currentColor]"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
