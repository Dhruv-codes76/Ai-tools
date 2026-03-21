"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Share2, MessageCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import dynamic from 'next/dynamic';
import ShareModal from "./ShareModal";

const ReelComments = dynamic(() => import('./ReelComments'), {
  loading: () => (
    <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  ssr: false
});

export default function NewsReelItem({ news, isActive, handleInteraction, isInteracting }: { news: any, isActive: boolean, handleInteraction: () => void, isInteracting: boolean }) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [progress, setProgress] = useState(0);

    // Progress bar for auto-scroll
    useEffect(() => {
        if (!isActive || isInteracting || showShare || showComments) {
            setProgress(0); // eslint-disable-line react-hooks/set-state-in-effect
            return;
        }

        const duration = 30000;
        const intervalTime = 100;
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += intervalTime;
            // setProgress is safe here because it represents visual progression independent of strict react state cycles.
            setProgress(Math.min((elapsed / duration) * 100, 100)); // eslint-disable-line react-hooks/set-state-in-effect
        }, intervalTime);

        return () => clearInterval(interval);
    }, [isActive, isInteracting, showShare, showComments]);

    const toggleShare = () => {
        setShowShare(!showShare);
        handleInteraction();
    };

    return (
        <>
            <div className="relative w-full h-full bg-background overflow-hidden flex flex-col justify-end">

                {/* Full Screen Background Image */}
                <div className="absolute inset-0 z-0 bg-black">
                    {news.featuredImage ? (
                        <img
                            src={news.featuredImage}
                            alt=""
                            className={`w-full h-full object-cover object-center transition-transform duration-[40s] ease-out ${isActive && !isInteracting ? 'scale-110' : 'scale-100'}`} // Subtle zoom effect
                            loading={isActive ? "eager" : "lazy"}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
                    )}
                </div>

                {/* Gradient Overlays for Readability (Adapts to Light/Dark mode via tailwind classes) */}
                {/* Top overlay - transparent to dark */}
                <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none h-40" />
                {/* Bottom overlay - dark gradient for text readability with backdrop blur to soften the image below the text */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none h-[70vh] backdrop-blur-[2px] mask-gradient" />

                {/* Top Progress Bar (Reels Style) */}
                <div className="absolute top-safe pt-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden z-20">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Main Content Area */}
                <div className="relative z-20 w-full px-4 pb-20 md:pb-6 flex justify-between items-end gap-6 pointer-events-auto">

                    {/* Left side text content */}
                    <div className="flex-1 flex flex-col justify-end overflow-hidden pb-4">
                        <div className="flex items-center gap-3 mb-4">
                            {news.trending && (
                                <span className="bg-red-500 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded shadow-md font-bold">
                                    Trending
                                </span>
                            )}
                            <span className="text-xs text-white/80 font-medium drop-shadow-md tracking-wide">
                                {news.createdAt ? formatDistanceToNow(new Date(news.createdAt), { addSuffix: true }) : 'Recently'}
                            </span>
                        </div>

                        <Link href={`/news/${news.slug}`} className="active:opacity-70 transition-opacity">
                            <h2 className="text-[26px] sm:text-3xl font-bold font-sans tracking-tight mb-3 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-[1.15]">
                                {news.title}
                            </h2>
                        </Link>

                        <p className="text-sm text-white/90 line-clamp-3 leading-[1.6] mb-5 font-medium max-w-[90%] drop-shadow-lg">
                            {news.summary}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            {(news.tags || []).slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md shadow-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side floating action bar */}
                    <div className="flex flex-col gap-6 items-center justify-end pb-6 shrink-0 z-30">
                        {news.sourceLink && (
                            <a
                                href={news.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                                onClick={handleInteraction}
                            >
                                <ExternalLink className="w-[22px] h-[22px]" />
                                <span className="text-[10px] font-semibold mt-1 tracking-wide">Read</span>
                            </a>
                        )}

                        <button
                            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                            onClick={() => {
                                setShowComments(true);
                                handleInteraction();
                            }}
                        >
                            <MessageCircle className="w-[22px] h-[22px] fill-transparent" />
                            <span className="text-[10px] font-semibold mt-1 tracking-wide">Chat</span>
                        </button>

                        <button
                            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                            onClick={toggleShare}
                        >
                            <Share2 className="w-[22px] h-[22px]" />
                            <span className="text-[10px] font-semibold mt-1 tracking-wide">Share</span>
                        </button>
                    </div>
                </div>

                {/* Swipe Up Indicator */}
                {isActive && (
                    <div className="absolute bottom-[65px] left-1/2 -translate-x-1/2 opacity-70 animate-bounce pointer-events-none md:hidden flex flex-col items-center z-10">
                        <span className="text-[9px] uppercase tracking-widest text-white/90 font-bold mb-1">Swipe</span>
                        <ChevronUp className="w-5 h-5 text-white" />
                    </div>
                )}

                {/* Comments Overlay Bottom Sheet */}
                <div
                    className={`absolute inset-x-0 bottom-0 z-50 bg-[#0f0f11] rounded-t-3xl transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${showComments ? 'translate-y-0 h-[75vh] shadow-[0_-20px_40px_rgba(0,0,0,0.8)]' : 'translate-y-full h-[75vh]'}`}
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full" />
                    <div className="sticky top-0 p-4 border-b border-white/5 flex items-center justify-between bg-[#0f0f11] z-10 rounded-t-3xl backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white tracking-tight">Discussion</h3>
                        <button
                            onClick={() => setShowComments(false)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all"
                        >
                            <ChevronDown className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 h-[calc(100%-60px)] overflow-y-auto p-4 custom-scrollbar">
                        {showComments && (
                            <ReelComments newsId={news.slug || news.id || news._id} />
                        )}
                    </div>
                </div>

                {/* Backdrop for comments */}
                {showComments && (
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                        onClick={() => setShowComments(false)}
                    />
                )}
            </div>

            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                title={news.title}
                url={`${window.location.origin}/news/${news.slug}`}
                imageUrl={news.featuredImage}
            />
        </>
    );
}
