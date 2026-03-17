import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-card border-t border-border mt-auto font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Col */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group w-max">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-12 shadow-[0_0_10px_rgba(0,191,255,0.3)]">
                                <span className="text-white font-heading font-black text-sm tracking-tighter">AI</span>
                            </div>
                            <span className="font-heading font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                                Portal Weekly
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Filter the robust signal from the incessant noise. We bring you real, beginner-friendly AI intelligence and meticulously categorized tooling.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Col */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-heading font-bold text-foreground mb-2">Navigation</h4>
                        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">Home</Link>
                        <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">Latest News</Link>
                        <Link href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">AI Tools Catalog</Link>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">About Us</Link>
                    </div>

                    {/* Legal Col */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-heading font-bold text-foreground mb-2">Legal</h4>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">Terms of Service</Link>
                        <Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors w-max">Cookie Policy</Link>
                    </div>

                    {/* Newsletter Col */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <h4 className="font-heading font-bold text-foreground mb-2">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            Get the latest AI intelligence delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                            />
                            <button type="button" className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-full h-px bg-border my-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} AI Portal Weekly. All rights reserved.</p>
                    <p>Designed with absolute clarity.</p>
                </div>
            </div>
        </footer>
    );
}
