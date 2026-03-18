"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NewsEditor, { NewsFormData } from "@/components/admin/NewsEditor";
import { ArrowLeft } from "lucide-react";

export default function CreateNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const initialData: NewsFormData = {
        title: "",
        slug: "",
        summary: "",
        content: "",
        sourceLink: "",
        status: "draft",
        seoMetaTitle: "",
        seoMetaDescription: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        featuredImage: "",
        featuredImageAlt: "",
    };

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

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: submissionData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create article");

            router.push("/admin/news");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-muted/5 min-h-screen">
            <div className="mb-6">
                <Link href="/admin/news" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to News Management
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-foreground">Draft Intelligence Brief</h1>
                <p className="text-muted-foreground mt-2 italic text-lg max-w-2xl">
                    Create a new article. Use the live preview to see exactly how it will appear to your readers.
                </p>
            </header>

            {error && (
                <div className="mb-8 p-4 border-l-4 border-red-500 bg-red-500/10 text-red-500 text-sm font-bold tracking-wide">
                    {error}
                </div>
            )}

            <NewsEditor 
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
                isEdit={false}
            />
        </div>
    );
}
