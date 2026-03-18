"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NewsEditor, { NewsFormData } from "@/components/admin/NewsEditor";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState<NewsFormData | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return router.push("/admin/login");

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch article");

                const article = data.data.find((item: { _id: string; [key: string]: string | boolean | number }) => item._id === id);
                if (!article) throw new Error("Article not found");

                setInitialData({
                    title: article.title || "",
                    slug: article.slug || "",
                    summary: article.summary || "",
                    content: article.content || "",
                    sourceLink: article.sourceLink || "",
                    status: article.status || "draft",
                    seoMetaTitle: article.seoMetaTitle || "",
                    seoMetaDescription: article.seoMetaDescription || "",
                    canonicalUrl: article.canonicalUrl || "",
                    ogTitle: article.ogTitle || "",
                    ogDescription: article.ogDescription || "",
                    ogImage: article.ogImage || "",
                    twitterTitle: article.twitterTitle || "",
                    twitterDescription: article.twitterDescription || "",
                    twitterImage: article.twitterImage || "",
                    featuredImage: article.featuredImage || "",
                    featuredImageAlt: article.featuredImageAlt || "",
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setFetching(false);
            }
        };

        fetchArticle();
    }, [id, router]);

    const handleSubmit = async (formData: NewsFormData) => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const submissionData = new FormData();
            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'featuredImageFile' && value) {
                    submissionData.append('featuredImage', value);
                } else if (value !== undefined && value !== null) {
                    submissionData.append(key, value);
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: submissionData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update article");

            router.push("/admin/news");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (fetching) {
        return (
            <div className="max-w-[1600px] mx-auto min-h-screen py-32 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="tracking-widest uppercase font-bold text-sm">Loading Intel Brief...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-muted/5 min-h-screen">
            <div className="mb-6">
                <Link href="/admin/news" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to News Management
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-foreground">Edit Intelligence Brief</h1>
                <p className="text-muted-foreground mt-2 italic text-lg max-w-2xl">
                    Update your article below. Changes to the live preview reflect what your readers will see.
                </p>
            </header>

            {error && (
                <div className="mb-8 p-4 border-l-4 border-red-500 bg-red-500/10 text-red-500 text-sm font-bold tracking-wide">
                    {error}
                </div>
            )}

            {initialData && (
                <NewsEditor 
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    isEdit={true}
                />
            )}
        </div>
    );
}
