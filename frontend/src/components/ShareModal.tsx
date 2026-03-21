"use client";

import { useEffect, useRef, useState } from "react";
import { X, Copy, Download, MessageCircle, Share2, Check } from "lucide-react";
import { toPng } from 'html-to-image';

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
    imageUrl?: string;
};

export default function ShareModal({ isOpen, onClose, title, url, imageUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank');
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(console.error);
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);

        try {
            const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `AI_Portal_${title.substring(0, 15).replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating image:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative bg-card border border-border w-full max-w-sm rounded-3xl shadow-2xl animate-slide-up overflow-hidden z-10"
            >
                <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                    <h3 className="font-bold text-lg tracking-tight">Share Article</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Shareable Image Preview (Hidden from screen but readable by html-to-image) */}
                    <div className="w-full flex justify-center mb-6 relative">
                        <div
                            ref={previewRef}
                            className="w-[280px] h-[400px] relative rounded-xl overflow-hidden flex flex-col justify-end border border-white/10 shadow-lg bg-black"
                        >
                             <div className="absolute inset-0 z-0">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-black"></div>
                                )}
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />
                            <div className="relative z-20 p-5 w-full">
                                <h4 className="text-white font-bold text-lg leading-tight drop-shadow-md line-clamp-4">{title}</h4>
                                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center w-full">
                                    <span className="text-white/60 text-xs font-medium uppercase tracking-widest">AI Portal</span>
                                    <span className="text-white/40 text-[10px]">Read More</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">WhatsApp</span>
                        </button>

                        <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{copied ? "Copied!" : "Copy"}</span>
                        </button>

                        <button onClick={handleDownload} disabled={isDownloading} className="flex flex-col items-center gap-2 group disabled:opacity-50">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Download className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">Save</span>
                        </button>

                        <button onClick={handleNativeShare} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">More</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
