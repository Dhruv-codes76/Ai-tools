'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Newspaper, Wrench, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const isLogin = pathname === '/admin/login';

    useEffect(() => {
        if (isLogin) {
            setIsAuthenticated(true);
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router, isLogin]);

    if (!isAuthenticated) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
    );

    if (isLogin) {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage News', href: '/admin/news', icon: Newspaper },
        { name: 'Manage Tools', href: '/admin/tools', icon: Wrench },
        { name: 'Audit Trail', href: '/admin/logs', icon: ShieldAlert },
    ];

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden w-full z-50">
            {/* Subtle Admin Background */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-background">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-background to-blue-900/5 opacity-50" />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-card/50 backdrop-blur-xl border-r border-border/50
                transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-sans font-bold tracking-tight text-xl text-foreground">
                                AI Portal <span className="text-muted-foreground font-medium">Admin</span>
                            </span>
                        </Link>
                        <button
                            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? 'bg-foreground/5 text-foreground font-semibold shadow-sm border border-border/50'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-border/50 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 z-10 relative h-screen overflow-y-auto">
                {/* Mobile Header */}
                <header className="h-16 flex items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 md:hidden">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-foreground rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-lg tracking-tight">Admin</span>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <div className="flex-1 p-4 md:p-8 lg:p-10 pb-24 md:pb-10">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
