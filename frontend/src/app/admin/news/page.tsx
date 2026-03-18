"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArticleIcon from "@mui/icons-material/Article";
import EditOpenIcon from "@mui/icons-material/EditOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function AdminNewsPage() {
    const router = useRouter();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNews = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            // For admin we want to see all including inactive if the API supports it
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNews(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const deactivateNews = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this article?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${id}`, {
                method: "DELETE", // Based on backend route mappings we used previously
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchNews();
            else alert("Failed to deactivate.");
        } catch (e) {
            alert("Error occurred.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
                <ArrowBackIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
                        <ArticleIcon className="w-8 h-8 mr-3 text-primary" />
                        Manage News
                    </h1>
                </div>

                <Link
                    href="/admin/news/create"
                    className="px-5 py-2.5 bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground font-bold tracking-widest uppercase text-sm transition-colors"
                >
                    + Draft New Article
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden border border-border">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading specific news records...</div>
                ) : news.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No news articles found.</div>
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
                                {news.map((item: any) => (
                                    <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.slug}</td>
                                        <td className="px-6 py-4">
                                            {item.isDeleted ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">Deactivated</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link
                                                href={`/admin/news/edit/${item._id}`}
                                                className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                                                title="Edit"
                                            >
                                                <EditOpenIcon className="w-5 h-5 mx-1" />
                                            </Link>
                                            <button
                                                onClick={() => deactivateNews(item._id)}
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
        </div>
    );
}
