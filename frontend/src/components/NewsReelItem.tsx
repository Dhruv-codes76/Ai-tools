"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp, Share2, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";
import ReelComments from "./ReelComments";

export default function NewsReelItem({ news, isActive, handleInteraction, isInteracting }: { news: any, isActive: boolean, handleInteraction: () => void, isInteracting: boolean }) {
    const [showComments, setShowComments] = useState(false);
    const [progress, setProgress] = useState(0);

    // Progress bar for auto-scroll
    useEffect(() => {
        if (!isActive || isInteracting) {
            setProgress(0);
            return;
        }

        const duration = 30000;
        const intervalTime = 100;
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += intervalTime;
            setProgress(Math.min((elapsed / duration) * 100, 100));
        }, intervalTime);

        return () => clearInterval(interval);
    }, [isActive, isInteracting]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                url: `/news/${news.slug}`
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/news/${news.slug}`);
        }
        handleInteraction();
    };

    return (
        <div className="relative w-full h-full md:max-w-2xl mx-auto bg-black text-white md:border-x md:border-white/10 overflow-hidden">

            {/* Background Image (Blurred) */}
            <div className="absolute inset-0 z-0 opacity-40 blur-2xl pointer-events-none transition-opacity duration-1000">
                {news.featuredImage ? (
                    <img
                        src={news.featuredImage}
                        alt=""
                        className="w-full h-full object-cover scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-blue-900/40 to-black"></div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 pb-24 md:pb-6 bg-gradient-to-t from-black via-black/80 to-transparent">

                {/* Top Progress Bar (Reels Style) */}
                <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden z-20">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content Overlay */}
                <div className="w-full flex justify-between items-end gap-4 mb-4">

                    {/* Left side text content */}
                    <div className="flex-1 overflow-hidden pr-12">
                        <div className="flex items-center gap-3 mb-3">
                            {news.trending && (
                                <span className="bg-red-500/20 text-red-400 text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-bold border border-red-500/30">
                                    Trending
                                </span>
                            )}
                            <span className="text-xs text-white/60 font-medium">
                                {news.createdAt ? formatDistanceToNow(new Date(news.createdAt), { addSuffix: true }) : 'Recently'}
                            </span>
                        </div>

                        <Link href={`/news/${news.slug}`}>
                            <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight mb-3 hover:text-blue-400 transition-colors drop-shadow-md">
                                {news.title}
                            </h2>
                        </Link>

                        <p className="text-sm text-white/80 line-clamp-3 sm:line-clamp-4 leading-relaxed max-w-lg shadow-black drop-shadow-lg">
                            {news.summary}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            {(news.tags || []).slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side floating action bar */}
                    <div className="flex flex-col gap-4 pb-2 items-center absolute right-4 bottom-24 md:bottom-8 z-30">
                        {news.sourceLink && (
                            <a
                                href={news.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-lg group"
                                onClick={handleInteraction}
                                title="Read Source"
                            >
                                <ExternalLink className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        )}

                        <button
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-lg"
                            onClick={() => {
                                setShowComments(true);
                                handleInteraction();
                            }}
                        >
                            <MessageCircle className="w-5 h-5 mb-0.5" />
                        </button>

                        <button
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-lg"
                            onClick={handleShare}
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Swipe indicator (only visible initially or briefly) */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 md:opacity-0 animate-pulse hidden">
                    <div className="flex flex-col items-center text-white/30">
                        <ChevronUp className="w-6 h-6 animate-bounce" />
                    </div>
                </div>

            </div>

            {/* Comments Overlay Bottom Sheet */}
            <div className={`absolute inset-x-0 bottom-0 z-50 bg-[#111] md:border-t md:border-white/10 md:rounded-t-3xl transition-transform duration-300 ease-in-out ${showComments ? 'translate-y-0 h-[80%]' : 'translate-y-full h-0'} flex flex-col`}>
                <div className="sticky top-0 p-4 border-b border-white/10 flex items-center justify-between bg-[#111] z-10 rounded-t-3xl">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <button
                        onClick={() => setShowComments(false)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {showComments && (
                        <ReelComments newsId={news.slug || news.id || news._id} />
                    )}
                </div>
            </div>

            {/* Backdrop for comments */}
            {showComments && (
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setShowComments(false)}
                />
            )}
        </div>
    );
}
