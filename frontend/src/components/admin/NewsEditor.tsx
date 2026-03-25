"use client";

import { useState, useEffect, useMemo } from "react";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Globe, Share2, Twitter, Info, Sparkles, Wand2, Save, Eye, AlertCircle, Search } from "lucide-react";
import { analyzeReadability } from "@/utils/readabilityStats";

export interface NewsFormData {
    title: string;
    slug: string;
    summary: string;
    content: string;
    sourceLink: string;
    status: string;
    seoMetaTitle: string;
    seoMetaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    featuredImage: string;
    featuredImageAlt: string;
    focusKeyphrase: string;
    featuredImageFile?: File;
}

interface NewsEditorProps {
    initialData: NewsFormData;
    onSubmit: (data: NewsFormData) => void;
    loading: boolean;
    isEdit?: boolean;
}

export default function NewsEditor({ initialData, onSubmit, loading, isEdit = false }: NewsEditorProps) {
    const [formData, setFormData] = useState<NewsFormData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiTips, setAiTips] = useState<string[]>([]);
    const [aiHealthMetrics, setAiHealthMetrics] = useState<Record<string, unknown> | null>(null);
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            
            // Auto-generate logic
            if (!isEdit) {
                if (name === "focusKeyphrase" && value) {
                    // 1. Slug from keyphrase
                    newState.slug = value.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '')
                        .substring(0, 60);

                    // 2. SEO Title from keyphrase (Keyphrase | Action | Brand)
                    if (!prev.seoMetaTitle || prev.seoMetaTitle === prev.title) {
                        const titlePattern = `${value.charAt(0).toUpperCase() + value.slice(1)} | Real-World AI Insights | AI Portal`;
                        newState.seoMetaTitle = titlePattern.substring(0, 60);
                    }

                    // 3. Meta Description (Start with keyphrase)
                    if (!prev.seoMetaDescription || prev.seoMetaDescription === prev.summary) {
                        const descPattern = `Learn all about ${value}. We break down the reality, costs, and beginner-friendly tips for ${value} in this detailed guide.`;
                        newState.seoMetaDescription = descPattern.substring(0, 160);
                    }
                } else if (name === "title" && !prev.focusKeyphrase && !newState.slug) {
                    // Fallback to title if no focus keyphrase, but keep it shorter (max 60 chars)
                    newState.slug = value.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '')
                        .substring(0, 60)
                        .replace(/-$/, '');
                    
                    if (!prev.seoMetaTitle) newState.seoMetaTitle = value.substring(0, 60);
                }
            }
            
            return newState;
        });
    };

    const handleAutoSEO = async () => {
        if (!formData.content || formData.content.length < 50) {
            alert("Please add some content first so the AI can analyze it!");
            return;
        }

        setIsOptimizing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/optimize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: formData.content,
                    title: formData.title,
                    focusKeyphrase: formData.focusKeyphrase,
                    type: "news"
                }),
            });

            if (!response.ok) throw new Error("Failed to optimize SEO");

            const data = await response.json();
            
            setFormData(prev => ({
                ...prev,
                focusKeyphrase: data.focusKeyphrase,
                seoMetaTitle: data.seoMetaTitle,
                seoMetaDescription: data.seoMetaDescription,
                slug: data.slug,
                summary: data.summary || prev.summary,
                featuredImageAlt: data.featuredImageAlt || prev.featuredImageAlt
            }));
            
            if (data.improvementTips && Array.isArray(data.improvementTips)) {
                setAiTips(data.improvementTips);
            }
            if (data.healthMetrics) {
                setAiHealthMetrics(data.healthMetrics);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to reach the SEO Magic engine. Check your backend/API key.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Content Health & Readability Checks
    const readability = useMemo(() => analyzeReadability({
        content: formData.content,
        keyphrase: formData.focusKeyphrase,
        title: formData.title,
        slug: formData.slug,
        metaDescription: formData.seoMetaDescription,
        imageAlt: formData.featuredImageAlt
    }), [formData.content, formData.focusKeyphrase, formData.title, formData.slug, formData.seoMetaDescription, formData.featuredImageAlt]);
    
    const hasH1 = formData.content.includes("<h1>");
    const hasRealWorldRelevance = formData.content.toLowerCase().includes("real-world relevance");
    const hasHowItWorks = formData.content.toLowerCase().includes("how it works");

    const healthChecks = [
        { label: "Word Count (> 300)", passed: readability.wordCount >= 300, value: `${readability.wordCount} words` },
        { label: "Focus Keyphrase in Title", passed: readability.keywordInTitle },
        { label: "Focus Keyphrase in Intro", passed: readability.keywordInIntro },
        { label: "Focus Keyphrase in H2", passed: readability.keywordInH2 },
        { label: "Focus Keyphrase in Conclusion", passed: readability.keywordInConclusion },
        { label: "Focus Keyphrase in Image Alt", passed: readability.keywordInImageAlt },
        { label: "Focus Keyphrase in Slug", passed: readability.keywordInSlug },
        { label: "Focus Keyphrase in Meta", passed: readability.keywordInMeta },
        { label: "Keyphrase Density (0.5-2.5%)", passed: readability.keywordDensity >= 0.5 && readability.keywordDensity <= 2.5, value: `${readability.keywordDensity}%` },
        { label: "SEO Title (45-60)", passed: formData.seoMetaTitle.length >= 45 && formData.seoMetaTitle.length <= 60 },
        { label: "SEO Meta Desc (140-160)", passed: formData.seoMetaDescription.length >= 140 && formData.seoMetaDescription.length <= 160 },
        { label: "Short Paragraphs (< 150w)", passed: aiHealthMetrics ? aiHealthMetrics.hasShortParagraphs : !readability.hasLongParagraphs },
        { label: "Varied Sentence Starts", passed: aiHealthMetrics ? aiHealthMetrics.variedSentenceStarts : readability.consecutiveSentenceStarts < 3, value: aiHealthMetrics ? null : `Max ${readability.consecutiveSentenceStarts} in a row` },
        { label: "Passive Voice (< 10%)", passed: aiHealthMetrics ? aiHealthMetrics.passiveVoicePercentage < 10 : readability.passiveVoicePercentage < 10, value: `${aiHealthMetrics ? aiHealthMetrics.passiveVoicePercentage : readability.passiveVoicePercentage}%` },
        { label: "Transitions (25-30%)", passed: aiHealthMetrics ? aiHealthMetrics.transitionsPercentage >= 25 : readability.transitionDensityPercentage >= 25, value: `${aiHealthMetrics ? aiHealthMetrics.transitionsPercentage : readability.transitionDensityPercentage}%` },
        { label: "Featured Image set", passed: !!formData.featuredImage },
    ];

    const handleHealthClick = (label: string) => {
        if (label.includes("H1")) {
            const h1Element = document.querySelector('.custom-editor h1');
            if (h1Element) h1Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (label.includes("Relevance")) {
            const h2Element = Array.from(document.querySelectorAll('.custom-editor h2'))
                .find(el => el.textContent?.toLowerCase().includes("relevance"));
            if (h2Element) h2Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (label.includes("Works")) {
            const h2Element = Array.from(document.querySelectorAll('.custom-editor h2'))
                .find(el => el.textContent?.toLowerCase().includes("works"));
            if (h2Element) h2Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (label.includes("Passive") || label.includes("Transitions")) {
            const editorElement = document.querySelector('.custom-editor');
            if (editorElement) editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const ContentHealth = () => (
        <div className="bg-card border border-border p-4 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center justify-between">
                Content Health
                <span className="text-[9px] px-1.5 py-0.5 bg-foreground text-background">AI GUIDE</span>
            </h4>
            <div className="space-y-2">
                {healthChecks.map((check, i) => (
                    <div 
                        key={i} 
                        className={`flex items-center justify-between text-xs cursor-pointer hover:bg-muted/30 p-1 -mx-1 transition-colors group/hc`}
                        onClick={() => handleHealthClick(check.label)}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${check.passed ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                            <span className={check.passed ? "text-foreground font-medium" : "text-muted-foreground"}>{check.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {check.value && (
                                <span className={`text-[9px] font-bold ${check.passed ? "text-green-500" : "text-red-500"}`}>
                                    {check.value}
                                </span>
                            )}
                            <Search className="w-3 h-3 opacity-0 group-hover/hc:opacity-100 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>
            {!healthChecks.every(c => c.passed) && (
                <p className="text-[10px] text-muted-foreground italic leading-tight pt-1">
                    Tip: Complete all checks for better search rankings.
                </p>
            )}
        </div>
    );

    const PreviewPane = () => (
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {formData.featuredImage ? (
                <div className="w-full aspect-video mb-6 border border-border overflow-hidden">
                    <img 
                        src={formData.featuredImage} 
                        alt={formData.featuredImageAlt || formData.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full aspect-video mb-6 border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted/10">
                    No Featured Image Selected
                </div>
            )}
            
            <header className="border-b-4 border-foreground pb-4 mb-6">
                <h1 className="text-2xl md:text-4xl font-sans font-bold tracking-tight leading-none mb-4 text-foreground">
                    {formData.title || "Your Headline Will Appear Here"}
                </h1>
                <div className="flex items-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    <time>{dateStr}</time>
                    <span className="mx-2">&mdash;</span>
                    <span>Intelligence Brief</span>
                </div>
            </header>

            <p className="text-lg font-sans text-muted-foreground italic mb-8 leading-relaxed">
                {formData.summary || "Your summary/lead paragraph will appear here."}
            </p>

            {formData.content ? (
                <div 
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                    className="prose prose-sm dark:prose-invert max-w-none
                        prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-6 prose-h1:mb-3 prose-h1:leading-tight prose-h1:border-b-2 prose-h1:border-current prose-h1:pb-2
                        prose-h2:text-xl prose-h2:font-bold prose-h2:mt-5 prose-h2:mb-2 prose-h2:leading-snug
                        prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2
                        prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-blue-600 prose-a:underline
                        prose-ul:my-3 prose-li:my-1
                        prose-ol:my-3
                        prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
                />
            ) : (
                <p className="text-muted-foreground border-l-2 border-muted pl-4 italic">Start writing your content to see it previewed here.</p>
            )}
        </article>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 relative">
            {/* Mobile Tab Controls */}
            <div className="flex lg:hidden w-full border-b border-border sticky top-0 bg-background z-20">
                <button 
                    type="button" 
                    onClick={() => setActiveTab("write")}
                    className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "write" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
                >
                    Edit Mode
                </button>
                <button 
                    type="button" 
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "preview" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
                >
                    Live Preview
                </button>
            </div>

            {/* Left side: Editor Form */}
            <div className={`flex-1 space-y-12 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                {/* Editor Header */}
                <div className="flex items-center justify-between border-b-2 border-foreground pb-4 pt-2">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Intelligence Brief Editor</h2>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-70">
                            Advanced Professional Mode
                        </p>
                    </div>
                </div>

                {/* Section 1: Core Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">1</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Core Content</h2>
                    </div>

                    {/* Headline FIRST */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Headline</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors text-2xl font-bold placeholder:opacity-30"
                            placeholder="Enter the main title..."
                        />
                    </div>

                    {/* Focus Keyphrase SECOND */}
                    <div className="bg-secondary/5 border-2 border-secondary/20 p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground block">Focus Keyphrase (The SEO Driver)</label>
                            <input
                                required
                                type="text"
                                name="focusKeyphrase"
                                value={formData.focusKeyphrase}
                                onChange={handleChange}
                                className="w-full p-4 bg-background border-2 border-secondary/30 focus:border-secondary focus:outline-none transition-colors text-lg font-bold placeholder:opacity-30"
                                placeholder="e.g. apple watch ultra"
                            />
                            <p className="text-[10px] text-muted-foreground italic leading-tight">
                                Auto-generates your URL slug, SEO title, and meta description.
                            </p>
                        </div>
                    </div>
                    
                    {/* Content SECOND — Write the blog */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block mb-2">Write your Story</label>
                        <RichTextEditor 
                            content={formData.content}
                            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                            placeholder="Start writing the full article here..."
                        />
                    </div>

                    {/* Generate SEO Button — prominently after content */}
                    <button
                        type="button"
                        onClick={handleAutoSEO}
                        disabled={isOptimizing}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-white text-sm font-black uppercase tracking-widest hover:bg-secondary/80 transition-all rounded-lg shadow-lg disabled:opacity-50"
                    >
                        <Wand2 className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
                        {isOptimizing ? "Generating SEO magic..." : "✨ Generate SEO (Auto-fills everything below)"}
                    </button>
                </section>

                {/* Section 2: Media & Configuration */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">2</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Generated & Settings</h2>
                    </div>

                    {/* Summary — auto-generated but editable */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Brief Summary <span className="text-[10px] text-muted-foreground font-normal normal-case">(auto-generated, editable)</span></label>
                        <textarea
                            required
                            name="summary"
                            rows={3}
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors resize-y text-base"
                            placeholder="Click 'Generate SEO' above to auto-fill, or type manually..."
                        />
                    </div>

                    <div className="bg-card p-6 border border-border">
                        <h3 className="text-xs font-bold tracking-widest uppercase block mb-4 text-muted-foreground">Featured Cover Image</h3>
                        <FeaturedImagePortal 
                            imageUrl={formData.featuredImage}
                            imageAlt={formData.featuredImageAlt}
                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">URL Slug</label>
                            <input
                                required
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Source Link (Optional)</label>
                            <input
                                type="text"
                                name="sourceLink"
                                value={formData.sourceLink}
                                onChange={handleChange}
                                placeholder="https://original-source.com"
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 max-w-xs">
                        <label className="text-sm font-bold tracking-widest uppercase block">Publish Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm font-black"
                        >
                            <option value="draft" className="bg-background text-yellow-500">Draft (Private)</option>
                            <option value="published" className="bg-background text-green-500">Published (Public)</option>
                        </select>
                    </div>
                </section>

                {/* Section 3: SEO & Social */}
                <section className="space-y-6 pb-20 lg:pb-0">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">3</div>
                            <h2 className="text-xl font-bold uppercase tracking-widest">Search & Social (SEO)</h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutoSEO}
                            disabled={isOptimizing}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-all rounded shadow-lg disabled:opacity-50"
                        >
                            <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                            {isOptimizing ? "Generating..." : "✨ Magic Auto-SEO"}
                        </button>
                    </div>

                    <SEOEditor 
                        data={formData} 
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        baseSlug={formData.slug}
                        type="news"
                    />
                </section>
            </div>

            {/* Right side: Live Preview (Sticky) */}
            <div className={`flex-1 lg:w-[45%] lg:max-w-2xl shrink-0 ${activeTab === 'write' ? 'hidden lg:block' : 'block'}`}>
                <div className="lg:sticky lg:top-8 space-y-4">
                    <ContentHealth />
                    
                    {aiTips.length > 0 && (
                        <div className="bg-secondary/5 border-2 border-secondary/20 p-5 shadow-sm rounded-xl">
                            <h4 className="text-[10px] font-black tracking-widest uppercase text-secondary mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                How to Improve This Blog
                            </h4>
                            <ul className="space-y-3">
                                {aiTips.map((tip, idx) => (
                                    <li key={idx} className="text-sm font-medium text-foreground/80 leading-snug flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="border border-border bg-background shadow-xl h-[calc(100vh-16rem)] min-h-[500px] flex flex-col">
                        <div className="border-b border-border bg-muted/20 p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground pl-2">
                                <Eye className="w-4 h-4" /> Live Mobile View
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                            </div>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white dark:bg-zinc-950">
                            <div className="max-w-[55ch] mx-auto">
                                <PreviewPane />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 md:bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t-2 border-foreground p-4 z-50 flex justify-center lg:justify-end lg:px-12">
                <div className="flex items-center gap-4 w-full max-w-7xl mx-auto justify-between lg:justify-end">
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:flex items-center gap-4">
                        {!healthChecks.every(c => c.passed) && (
                            <div className="flex items-center gap-1.5 text-yellow-500">
                                <AlertCircle className="w-4 h-4" />
                                <span>SEO Tips Available</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            Status: <span className={`px-2 py-0.5 rounded-sm text-[10px] ${formData.status === 'published' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>{formData.status}</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-black tracking-widest uppercase text-sm hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 disabled:grayscale shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : (isEdit ? "Update Article" : "Go Live Now")}
                    </button>
                </div>
            </div>
        </form>
    );
}
