import re

with open('frontend/src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Find the navLinks mapping in the mobile nav
mobile_nav_pattern = r"\{navLinks\.map\(\(link\) => \{([\s\S]*?)return \([\s\S]*?\}\)\}"

def mobile_nav_replacement(match):
    original_map = match.group(0)

    # We want to insert the Search button after News or just keep it as a button
    # Let's add a separate button for Search in the mobile nav loop or alongside it

    new_nav = """{navLinks.map((link) => {
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
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "fill-current scale-110" : "group-hover:scale-110 group-active:scale-95"}`} />
                                    {isActive && (
                                        <div className="absolute -inset-1 bg-gray-900/10 dark:bg-white/10 rounded-full blur-md -z-10" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>{link.name}</span>
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-900 dark:bg-white rounded-b-full shadow-[0_0_8px_currentColor]"></div>
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
                            isSearchOpen ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <div className="relative flex items-center justify-center">
                            <Search className={`w-5 h-5 transition-transform duration-300 ${isSearchOpen ? "stroke-[2.5] scale-110" : "group-hover:scale-110 group-active:scale-95"}`} />
                            {isSearchOpen && (
                                <div className="absolute -inset-1 bg-gray-900/10 dark:bg-white/10 rounded-full blur-md -z-10" />
                            )}
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide transition-all ${isSearchOpen ? 'opacity-100' : 'opacity-70'}`}>Search</span>
                        {isSearchOpen && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-900 dark:bg-white rounded-b-full shadow-[0_0_8px_currentColor]"></div>
                        )}
                    </button>"""
    return new_nav

content = re.sub(mobile_nav_pattern, mobile_nav_replacement, content)

with open('frontend/src/components/Navbar.tsx', 'w') as f:
    f.write(content)
