/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Download, MessageCircle, Share2, Check, ExternalLink, Loader2 } from "lucide-react";
import { toBlob } from 'html-to-image';
import Logo from "../Logo";

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
    imageUrl?: string;
};

export default function ShareModal({ isOpen, onClose, title, url, imageUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const [loadingAction, setLoadingAction] = useState<'whatsapp' | 'native' | 'download' | 'copy' | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);


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

    if (!isOpen || !isMounted) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateImageFile = async (): Promise<File | null> => {
        if (!previewRef.current) return null;
        try {
            const blob = await toBlob(previewRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    background: '#0a0a0a',
                    margin: '0',
                }
            });
            if (!blob) return null;
            return new File([blob], `AI_Portal_${title.substring(0, 15).replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        } catch (err) {
            console.error('Error generating image blob:', err);
            return null;
        }
    };

    const handleWhatsApp = async () => {
        setIsSharing(true);
        setLoadingAction('whatsapp');
        try {
            const file = await generateImageFile();
            if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: `${title}\n\nRead more at: ${url}`,
                    files: [file]
                });
            } else {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${url}`)}`, '_blank');
            }
        } catch (err) {
            console.error("WhatsApp share failed", err);
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${url}`)}`, '_blank');
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };

    const handleNativeShare = async () => {
        setIsSharing(true);
        setLoadingAction('native');
        try {
            const file = await generateImageFile();
            if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: url,
                    files: [file]
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: title,
                    url: url
                });
            } else {
                 handleCopy();
            }
        } catch (err) {
            console.error("Native share failed", err);
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };

    const handleDownload = async () => {
        setIsSharing(true);
        setLoadingAction('download');
        try {
            const fileToDownload = await generateImageFile();
            if (!fileToDownload) return;

            const dataUrl = URL.createObjectURL(fileToDownload);
            const link = document.createElement('a');
            link.download = `AI_Portal_${title.substring(0, 15).replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
            URL.revokeObjectURL(dataUrl);
        } catch (err) {
            console.error('Error generating image:', err);
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[999] flex items-center justify-center animate-fade-in p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative bg-white/10 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-[24px] shadow-2xl animate-slide-up overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/40 shrink-0">
                    <h3 className="font-bold text-lg tracking-tight text-white">Share Article</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white/70 hover:text-white"
                        aria-label="Close share modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col items-center">

                    {/*
                        Shareable Image Preview wrapper.
                        We scale it down for UI display, but the actual capture happens on the full resolution div.
                    */}
                    <div className="w-full flex justify-center mb-8 relative" style={{ height: '320px' }}>
                        {/* Hidden high-res container for capture (1080x1080 format) */}
                        <div className="absolute left-[-9999px] top-[-9999px]">
                            <div
                                ref={previewRef}
                                className="relative flex flex-col justify-end overflow-hidden"
                                style={{
                                    width: '1080px',
                                    height: '1080px',
                                    backgroundColor: '#0a0a0a', // Explicit black background
                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}
                            >
                                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt=""
                                            crossOrigin="anonymous"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b 0%, #000000 100%)' }}></div>
                                    )}
                                </div>
                                {/* Dark gradient overlay for text readability */}
                                <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, transparent 100%)' }} />

                                <div style={{ position: 'relative', zIndex: 20, padding: '80px', width: '100%' }}>
                                    <h4 style={{
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '64px',
                                        lineHeight: 1.2,
                                        textShadow: '0 4px 12px rgba(0,0,0,0.8)',
                                        marginBottom: '60px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {title}
                                    </h4>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                        borderTop: '2px solid rgba(255,255,255,0.2)',
                                        paddingTop: '40px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ transform: 'scale(1.5)', transformOrigin: 'left center' }}>
                                                <Logo size="lg" disableLink={true} />
                                            </div>
                                        </div>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '28px', fontWeight: 600 }}>aiportalweekly.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Preview shown to user (scaled down representation) */}
                        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black transform transition-transform hover:scale-[1.02]">
                            <div className="absolute inset-0 z-0">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-black"></div>
                                )}
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

                            <div className="relative z-20 p-5 h-full flex flex-col justify-end w-full">
                                <h4 className="text-white font-bold text-xl leading-tight drop-shadow-md line-clamp-4 mb-4">
                                    {title}
                                </h4>

                                <div className="mt-auto pt-3 border-t border-white/20 flex justify-between items-center w-full">
                                    <div>
                                        <Logo size="sm" disableLink={true} />
                                    </div>
                                    <span className="text-white/50 text-[10px] font-medium">Read More</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full px-2">
                        <button onClick={handleWhatsApp} disabled={isSharing || loadingAction !== null} className="flex flex-col items-center gap-3 group disabled:opacity-50" aria-label="Share via WhatsApp">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95">
                                {loadingAction === "whatsapp" ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageCircle className="w-6 h-6" />}
                            </div>
                            <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">WhatsApp</span>
                        </button>

                        <button onClick={handleCopy} disabled={isSharing || loadingAction !== null} className="flex flex-col items-center gap-3 group disabled:opacity-50" aria-label={copied ? "Link copied" : "Copy link"}>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95">
                                {loadingAction === "copy" ? <Loader2 className="w-6 h-6 animate-spin" /> : (copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />)}
                            </div>
                            <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{copied ? "Copied" : "Copy"}</span>
                        </button>

                        <button onClick={handleDownload} disabled={isSharing || loadingAction !== null} className="flex flex-col items-center gap-3 group disabled:opacity-50" aria-label="Download image">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95">
                                {loadingAction === "download" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                            </div>
                            <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">Save</span>
                        </button>

                        <button onClick={handleNativeShare} disabled={isSharing || loadingAction !== null} className="flex flex-col items-center gap-3 group disabled:opacity-50" aria-label="More share options">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95">
                                {loadingAction === "native" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
                            </div>
                            <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">More</span>
                        </button>
                    </div>
                </div>

                {/* Secondary Action / Link preview */}
                <div className="p-4 bg-white/5 border-t border-white/5 shrink-0">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-black/60 rounded-xl border border-white/10 overflow-hidden">
                        <span className="text-xs text-white/50 truncate font-mono">{url.replace(/^https?:\/\//, '')}</span>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white p-1"
                            aria-label="Open external link"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );


    return createPortal(modalContent, document.body);
}
