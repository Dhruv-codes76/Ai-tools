"use client";

import Link from "next/link";
import { Image as ImageIcon, Bookmark, Share2, TrendingUp, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
    image_url?: string;
    trending?: boolean;
    category?: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const date = new Date(news.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    // Simple word count to estimate reading time (approx 200 words/min)
    const readingTime = Math.max(1, Math.ceil((news.summary?.split(' ').length || 0) / 50)) + " min read";

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSaved(!isSaved);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowShareMenu(!showShareMenu);
    };

    const handleShareAction = (e: React.MouseEvent, platform: string) => {
        e.preventDefault();
        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/news/${news.slug}`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
        setShowShareMenu(false);
    };

    return (
        <article className="group flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-foreground/20 relative">
            <Link href={`/news/${news.slug}`} className="flex flex-col h-full rounded-2xl overflow-hidden">
                {/* Image Placeholder Container (16:9) with Zoom on Hover */}
                <div className="relative w-full pt-[56.25%] bg-muted flex items-center justify-center overflow-hidden">
                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        {news.trending && (
                            <span className="flex items-center gap-1 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                                <TrendingUp className="w-3 h-3" /> Trending
                            </span>
                        )}
                        <span className="bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/50 shadow-sm transition-colors group-hover:bg-background">
                            {news.category || "AI Intel"}
                        </span>
                    </div>

                    {news.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={news.image_url}
                            alt={news.title}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted/50 transition-transform duration-700 group-hover:scale-105">
                            <ImageIcon className="w-10 h-10" />
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-3">
                        <time className="text-xs tracking-wider text-muted-foreground uppercase font-semibold">
                            {date} • {readingTime}
                        </time>
                    </div>

                    <h3 className="font-sans text-xl lg:text-2xl font-bold text-card-foreground leading-snug mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {news.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto font-medium mb-6">
                        {news.summary}
                    </p>

                    {/* Action Bar */}
                    <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center relative z-20">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSave}
                                className={`p-2 rounded-full transition-all duration-200 hover:bg-muted active:scale-95 ${isSaved ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                aria-label="Save article"
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={handleShareClick}
                                    className="p-2 rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95"
                                    aria-label="Share article"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>

                                {/* Share Popover */}
                                {showShareMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-card border border-border rounded-xl shadow-lg p-2 flex flex-col gap-1 z-50 animate-fade-in origin-bottom-left">
                                        <button onClick={(e) => handleShareAction(e, 'twitter')} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors w-full text-left">
                                            <Twitter className="w-4 h-4" /> Twitter
                                        </button>
                                        <button onClick={(e) => handleShareAction(e, 'linkedin')} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors w-full text-left">
                                            <Linkedin className="w-4 h-4" /> LinkedIn
                                        </button>
                                        <button onClick={(e) => handleShareAction(e, 'copy')} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors w-full text-left">
                                            <LinkIcon className="w-4 h-4" /> Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <span className="text-xs font-semibold text-foreground/60 tracking-wider uppercase group-hover:text-foreground transition-colors flex items-center">
                            Read <span className="ml-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
