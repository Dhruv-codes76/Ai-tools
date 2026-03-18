"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function CreateToolPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        website: "",
        pricing: "free",
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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === "name" && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add tool");

            router.push("/admin/tools");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/admin/tools" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    &larr; Back to Tool Catalog Management
                </Link>
            </div>

            <h1 className="text-4xl font-sans font-bold tracking-tight mb-8">Add New Tool to Catalog</h1>

            {error && (
                <div className="mb-8 p-4 border border-red-500 text-red-500 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <FeaturedImagePortal 
                    imageUrl={formData.featuredImage}
                    imageAlt={formData.featuredImageAlt}
                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Tool Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                        />
                    </div>
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
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest uppercase block mb-2">Description / Review</label>
                    <RichTextEditor 
                        content={formData.description}
                        onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                        placeholder="Describe the tool, its features, and your verdict..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest uppercase block">Website URL</label>
                    <input
                        required
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Pricing Model</label>
                        <select
                            name="pricing"
                            value={formData.pricing}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm"
                        >
                            <option value="free" className="bg-background">Free</option>
                            <option value="freemium" className="bg-background">Freemium</option>
                            <option value="paid" className="bg-background">Paid</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm"
                        >
                            <option value="draft" className="bg-background">Draft</option>
                            <option value="published" className="bg-background">Published</option>
                        </select>
                    </div>
                </div>

                <div className="pt-8 border-t border-border">
                    <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Search Engine Optimization (SEO)</h2>
                    <SEOEditor 
                        data={formData} 
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        baseSlug={formData.slug}
                        type="tool"
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-50 flex justify-center md:justify-end md:px-12">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border border-foreground transition-all disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Tool"}
                    </button>
                </div>
            </form>
        </div>
    );
}
