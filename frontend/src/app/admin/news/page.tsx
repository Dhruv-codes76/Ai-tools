/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArticleIcon from "@mui/icons-material/Article";
import EditOpenIcon from "@mui/icons-material/EditOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export default function AdminNewsPage() {
    const router = useRouter();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const fetchNews = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch news");

            setNews(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deactivateNews = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this article?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchNews();
            else alert("Failed to deactivate.");
        } catch {
            alert("Error occurred.");
        }
    };

    const triggerAIGeneration = async () => {
        if (!confirm("This will fetch the latest news from RSS, Reddit, and Gemini Search. Proceed?")) return;
        setGenerating(true);
        setError("");
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/auto-generate`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to trigger AI automation");
            alert(data.message || "News generated successfully!");
            fetchNews();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error generating news");
        } finally {
            setGenerating(false);
        }
    };

    const draftNews = news.filter((item: any) => item.status === 'DRAFT' && !item.isDeleted);
    const publishedNews = news.filter((item: any) => item.status !== 'DRAFT' && !item.isDeleted);
    const deactivatedNews = news.filter((item: any) => item.isDeleted);

    const renderTable = (data: any[], emptyMessage: string) => (
        <div className="glass-card rounded-2xl overflow-hidden border border-border mb-8 shadow-sm">
            {data.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">{emptyMessage}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-border bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-bold">Title</th>
                                <th className="px-6 py-4 font-bold">Slug</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.slug}</td>
                                    <td className="px-6 py-4">
                                        {item.isDeleted ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">Deactivated</span>
                                        ) : item.status === 'DRAFT' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20">AI Draft</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">Published</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link
                                            href={`/admin/news/edit/${item.id}`}
                                            className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                                            title="Edit"
                                        >
                                            <EditOpenIcon className="w-5 h-5 mx-1" />
                                        </Link>
                                        <button
                                            onClick={() => deactivateNews(item.id)}
                                            disabled={item.isDeleted}
                                            className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors mx-1"
                                            title="Deactivate"
                                        >
                                            <VisibilityOffIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
                <ArrowBackIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-10 gap-4 flex-wrap">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
                        <ArticleIcon className="w-8 h-8 mr-3 text-primary" />
                        Manage News
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={triggerAIGeneration}
                        disabled={generating}
                        className="px-5 py-2.5 bg-background text-foreground hover:bg-muted border border-border font-bold tracking-widest uppercase text-sm transition-colors flex items-center disabled:opacity-50 rounded"
                    >
                        {generating ? (
                           <div className="w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                           <AutoFixHighIcon className="w-4 h-4 mr-2 text-primary" />
                        )}
                        {generating ? "Fetching News..." : "Fetch AI News"}
                    </button>

                    <Link
                        href="/admin/news/create"
                        className="px-5 py-2.5 bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground font-bold tracking-widest uppercase text-sm transition-colors rounded"
                    >
                        + Draft New Article
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="p-8 text-center text-muted-foreground mt-10">Loading news records...</div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-500">
                        <AutoFixHighIcon className="w-5 h-5 mr-2" />
                        AI Drafts (Needs Approval)
                    </h2>
                    {renderTable(draftNews, "No pending AI drafts at the moment. Hit 'Fetch AI News' to grab the latest trends.")}

                    <h2 className="text-xl font-bold mb-4 mt-12 text-foreground">Published News</h2>
                    {renderTable(publishedNews, "No published news found.")}

                    {deactivatedNews.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold mb-4 mt-12 text-muted-foreground opacity-50">Deactivated / Archive</h2>
                            <div className="opacity-50">{renderTable(deactivatedNews, "")}</div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
