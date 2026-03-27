"use client";

import Link from "next/link";
import { Image as ImageIcon, Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import ShareModal from "../ShareModal";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
    image_url?: string;
    featuredImage?: string;
    trending?: boolean;
    category?: string;
    source?: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const getSourceStyles = (source?: string) => {
        switch (source) {
            case 'RSS':
                return "bg-blue-600/80 text-white";
            case 'REDDIT':
                return "bg-orange-600/80 text-white";
            case 'GEMINI_SEARCH':
                return "bg-gradient-to-r from-purple-600/80 to-blue-500/80 text-white";
            default:
                return null;
        }
    };

    const sourceStyles = getSourceStyles(news.source);

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
        setShowShareModal(true);
    };

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/news/${news.slug}` : `/news/${news.slug}`;

    return (
        <article className="group flex flex-col h-full bg-black/95 rounded-b-2xl rounded-t-none border border-border shadow-sm hover:shadow-md overflow-visible transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden">
            <Link prefetch={true} href={`/news/${news.slug}`} className="flex flex-col h-full rounded-b-2xl rounded-t-none transition-all duration-200 premium-active active:opacity-90 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                {/* Image Placeholder Container (16:9) */}
                <div className="relative w-full aspect-[16/9] bg-muted/30 overflow-hidden">
                    {(news.image_url || news.featuredImage) ? (
                        <div className="absolute inset-0 z-0 overflow-hidden bg-black/95">
                            {/* Edge-to-Edge Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={news.image_url || news.featuredImage}
                                alt={news.title}
                                loading="lazy"
                                className="absolute top-0 left-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                            {/* Seamless Fade into Card Background */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-10 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 transition-transform duration-700 group-hover:scale-[1.03] bg-gradient-to-br from-muted/50 to-background/50">
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

                    {/* Source Badge */}
                    {news.source && sourceStyles && (
                        <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:scale-110">
                            <span className={`${sourceStyles} backdrop-blur-md text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full shadow-lg border border-white/10`}>
                                {news.source === 'GEMINI_SEARCH' ? 'GEMINI' : news.source}
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

                    <h3 className="font-sans text-xl lg:text-2xl font-bold text-foreground dark:text-white leading-snug mb-4 group-hover:text-blue-500 transition-colors line-clamp-2">
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

                            <button
                                onClick={handleShareClick}
                                className="p-2 rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground"
                                aria-label="Share article"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={news.title}
                url={shareUrl}
                imageUrl={news.image_url || news.featuredImage}
            />
        </article>
    );
}