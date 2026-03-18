"use client";

import Link from "next/link";
import { Image as ImageIcon, Bookmark, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
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

    const readingTime = Math.max(1, Math.ceil((news.summary?.split(' ').length || 0) / 50)) + " min read";

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShareMenu(!showShareMenu);
    };

    const handleShareAction = (e: React.MouseEvent, platform: string) => {
        e.preventDefault();
        e.stopPropagation();
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
        <article className="group flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-visible transition-all duration-300 hover:scale-[1.01] hover:bg-white/10 hover:border-white/20 relative">
            <Link href={`/news/${news.slug}`} className="flex flex-col h-full rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                {/* Image Placeholder Container (16:9) */}
                <div className="relative w-full pt-[56.25%] bg-muted/30 overflow-hidden">
                    {news.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={news.image_url}
                            alt={news.title}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 transition-transform duration-700 group-hover:scale-105 bg-gradient-to-br from-muted/50 to-background/50">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                    )}

                    {/* Minimal Category Badge */}
                    {news.category && (
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                {news.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <time className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
                            {date} • {readingTime}
                        </time>
                    </div>

                    <h3 className="font-sans text-xl lg:text-2xl font-bold text-foreground leading-snug mb-4 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {news.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto mb-6">
                        {news.summary}
                    </p>

                    {/* Minimal Action Bar */}
                    <div className="mt-auto flex justify-between items-center relative z-20 pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-1 -ml-2">
                            <button
                                onClick={handleSave}
                                className={`p-2 rounded-full transition-all duration-200 hover:bg-muted/80 ${isSaved ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
                                aria-label="Save article"
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={handleShareClick}
                                    className="p-2 rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground"
                                    aria-label="Share article"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>

                                {/* Share Popover */}
                                {showShareMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-1.5 flex flex-col z-50 animate-fade-in origin-bottom-left">
                                        <button onClick={(e) => handleShareAction(e, 'twitter')} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors w-full text-left">
                                            <Twitter className="w-3 h-3" /> Twitter
                                        </button>
                                        <button onClick={(e) => handleShareAction(e, 'linkedin')} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors w-full text-left">
                                            <Linkedin className="w-3 h-3" /> LinkedIn
                                        </button>
                                        <button onClick={(e) => handleShareAction(e, 'copy')} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors w-full text-left">
                                            <LinkIcon className="w-3 h-3" /> Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
