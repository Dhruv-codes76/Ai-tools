"use client";

import { useState } from "react";
import { Globe, Share2, Twitter, Info } from "lucide-react";

interface SEOData {
    seoMetaTitle: string;
    seoMetaDescription: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string[];
    focusKeyphrase: string;
}

interface SEOEditorProps {
    data: SEOData;
    onChange: (newData: Partial<SEOData>) => void;
    baseSlug: string;
    type: "news" | "tool";
}

export default function SEOEditor({ data, onChange, baseSlug, type }: SEOEditorProps) {
    const [activeTab, setActiveTab] = useState<"google" | "social">("google");
    const baseUrl = "https://www.aiportalweekly.com"; // Replace with actual domain
    const fullUrl = `${baseUrl}/${type === "news" ? "news" : "tools"}/${baseSlug}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    return (
        <div className="border-2 border-border p-8 space-y-10 bg-card/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-border pb-6">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Globe className="w-6 h-6" />
                        Search Engine Optimization
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">
                        Control how your content appears across the web
                    </p>
                </div>
                <div className="flex bg-muted p-1 self-start sm:self-center">
                    <button 
                        type="button"
                        onClick={() => setActiveTab("google")}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "google" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Google
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab("social")}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "social" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Social
                    </button>
                </div>
            </div>

            {/* Google Search Preview */}
            {activeTab === "google" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-xl max-w-2xl transform hover:scale-[1.01] transition-transform">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs ring-1 ring-gray-200">A</div>
                            <cite className="text-[13px] text-[#202124] not-italic block font-sans">
                                {baseUrl.replace(/^https?:\/\//, '')} <span className="text-[#5f6368]"> › {type === "news" ? "news" : "tools"}</span>
                            </cite>
                        </div>
                        <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-2 font-sans font-medium line-clamp-1">
                            {data.seoMetaTitle || "Your Optimized Headline Goes Here"}
                        </h4>
                        <p className="text-sm text-[#4d5156] leading-relaxed font-sans line-clamp-2">
                            <span className="text-[#70757a] font-medium">Mar 16, 2026 — </span>
                            {data.seoMetaDescription || "Provide a compelling meta description to increase your click-through rate from search results."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5">
                                Search Title
                                <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                            </label>
                            <input
                                type="text"
                                name="seoMetaTitle"
                                value={data.seoMetaTitle}
                                onChange={handleChange}
                                placeholder="Target: 45-60 characters"
                                className={`w-full p-4 bg-transparent border-2 focus:border-foreground focus:outline-none text-sm font-medium transition-all ${
                                    data.seoMetaTitle.length >= 45 && data.seoMetaTitle.length <= 60 
                                    ? "border-green-500/50" 
                                    : "border-border"
                                }`}
                            />
                            <div className="flex justify-between items-center px-1">
                                <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden mr-4">
                                    <div 
                                        className={`h-full transition-all ${
                                            data.seoMetaTitle.length < 45 || data.seoMetaTitle.length > 60 
                                            ? "bg-red-500" 
                                            : "bg-green-500"
                                        }`} 
                                        style={{ width: `${Math.min(100, (data.seoMetaTitle.length / 60) * 100)}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                    (data.seoMetaTitle.length > 0 && data.seoMetaTitle.length < 45) || data.seoMetaTitle.length > 60 
                                    ? "text-red-500" 
                                    : "text-muted-foreground"
                                }`}>
                                    {data.seoMetaTitle.length} / 45-60
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 md:col-span-2 border-t-2 border-border pt-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5 text-secondary">
                                    URL Slug & Permanlink
                                </label>
                                <div className="p-4 bg-muted/20 border-2 border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <code className="text-[10px] font-bold text-foreground bg-foreground/10 px-2 py-0.5 rounded">
                                            /{type === "news" ? "news" : "tools"}/<span className="text-secondary">{baseSlug}</span>
                                        </code>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden mr-4">
                                            <div 
                                                className={`h-full transition-all ${
                                                    baseSlug.length > 60 ? "bg-red-500" : "bg-green-500"
                                                }`} 
                                                style={{ width: `${Math.min(100, (baseSlug.length / 60) * 100)}%` }}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                            baseSlug.length > 60 ? "text-red-500" : "text-muted-foreground"
                                        }`}>
                                            {baseSlug.length} / 60
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic leading-tight">
                                    Slug is automatically managed by your Focus Keyphrase at the top of the page.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5">Search Description</label>
                                <textarea
                                    name="seoMetaDescription"
                                    rows={3}
                                    value={data.seoMetaDescription}
                                    onChange={handleChange}
                                    placeholder="Target: 140-160 characters"
                                    className={`w-full p-4 bg-transparent border-2 focus:border-foreground focus:outline-none text-sm font-medium transition-all resize-none ${
                                        data.seoMetaDescription.length >= 140 && data.seoMetaDescription.length <= 160 
                                        ? "border-green-500/50" 
                                        : "border-border"
                                    }`}
                                />
                                <div className="flex justify-between items-center px-1">
                                    <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden mr-4">
                                        <div 
                                            className={`h-full transition-all ${
                                                data.seoMetaDescription.length < 140 || data.seoMetaDescription.length > 160 
                                                ? "bg-red-500" 
                                                : "bg-green-500"
                                            }`} 
                                            style={{ width: `${Math.min(100, (data.seoMetaDescription.length / 160) * 100)}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                        (data.seoMetaDescription.length > 0 && data.seoMetaDescription.length < 140) || data.seoMetaDescription.length > 160 
                                        ? "text-red-500" 
                                        : "text-muted-foreground"
                                    }`}>
                                        {data.seoMetaDescription.length} / 140-160
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Preview */}
            {activeTab === "social" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Facebook/OG Preview */}
                        <div className="space-y-4">
                            <h5 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-blue-600">
                                <Share2 className="w-4 h-4" /> Facebook Network
                            </h5>
                            <div className="border border-[#dadde1] rounded-sm overflow-hidden bg-white max-w-sm shadow-md">
                                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-[#dadde1] relative">
                                    {data.ogImage ? (
                                        <img src={data.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <Share2 className="w-12 h-12 mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="text-[11px] text-[#606770] uppercase tracking-tighter mb-1 truncate font-sans">{baseUrl.replace(/^https?:\/\//, '')}</div>
                                    <div className="font-bold text-[#1d2129] leading-tight mb-1 truncate text-base font-sans">{data.ogTitle || data.seoMetaTitle || "Post Title"}</div>
                                    <div className="text-xs text-[#606770] line-clamp-1 font-sans">{data.ogDescription || data.seoMetaDescription || "Post description goes here..."}</div>
                                </div>
                            </div>
                        </div>

                        {/* Twitter Preview */}
                        <div className="space-y-4">
                            <h5 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-950 dark:text-white">
                                <Twitter className="w-4 h-4" /> X / Twitter
                            </h5>
                            <div className="border border-[#e1e8ed] rounded-2xl overflow-hidden bg-white max-w-sm shadow-md">
                                <div className="h-44 bg-gray-100 flex items-center justify-center border-b border-[#e1e8ed] relative">
                                    {data.twitterImage ? (
                                        <img src={data.twitterImage} alt="Twitter Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <Twitter className="w-12 h-12 mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="font-bold text-[#14171a] leading-tight mb-1 truncate font-sans">{data.twitterTitle || data.seoMetaTitle || "Post Title"}</div>
                                    <div className="text-xs text-[#657786] line-clamp-2 font-sans">{data.twitterDescription || data.seoMetaDescription || "Post description..."}</div>
                                    <div className="text-xs text-[#657786] mt-2 flex items-center gap-1.5 font-sans">
                                        <Globe className="w-3 h-3" /> {baseUrl.replace(/^https?:\/\//, '')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-border pt-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Social Title Override</label>
                                <input
                                    type="text"
                                    name="ogTitle"
                                    value={data.ogTitle || ""}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Social Image URL</label>
                                <input
                                    type="text"
                                    name="ogImage"
                                    value={data.ogImage || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none text-sm font-medium font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">X/Twitter Title</label>
                                <input
                                    type="text"
                                    name="twitterTitle"
                                    value={data.twitterTitle || ""}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">X/Twitter Image URL</label>
                                <input
                                    type="text"
                                    name="twitterImage"
                                    value={data.twitterImage || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none text-sm font-medium font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="pt-8 border-t-2 border-border">
                <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Canonical URL (System Default Recommeded)</label>
                    <input
                        type="url"
                        name="canonicalUrl"
                        value={data.canonicalUrl || ""}
                        onChange={handleChange}
                        placeholder={fullUrl}
                        className="w-full p-4 bg-muted/30 border-2 border-border focus:border-foreground focus:outline-none text-xs font-black tracking-wider uppercase"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium italic opacity-70">
                        Leave this blank to let the system automatically manage indexing for you.
                    </p>
                </div>
            </div>
        </div>
    );
}
