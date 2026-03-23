/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";


export default function DesktopNewsList({ newsItems }: { newsItems: any[] }) {
    if (!newsItems || newsItems.length === 0) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-gray-500">No news available.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-32 md:pb-12">
            <h1 className="text-4xl font-bold mb-10 tracking-tight text-foreground">
                Latest Insights
            </h1>
            <div className="flex flex-col gap-10">
                {newsItems.map((news) => (
                    <article
                        key={news._id || news.id || news.slug}
                        className="flex flex-col md:flex-row gap-6 bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                        {/* Image Block */}
                        <div className="w-full md:w-[300px] h-48 md:h-full relative shrink-0 bg-muted">
                            {news.featuredImage ? (
                                <img
                                    src={news.featuredImage}
                                    alt={news.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                                    <span className="text-muted-foreground/50">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Content Block */}
                        <div className="flex flex-col justify-center p-6 md:pl-2 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                {news.trending && (
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-sm">
                                        Trending
                                    </span>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {news.createdAt ? formatDistanceToNow(new Date(news.createdAt), { addSuffix: true }) : 'Recently'}
                                </span>
                            </div>

                            <Link href={`/news/${news.slug}`}>
                                <h2 className="text-2xl font-bold tracking-tight mb-3 text-foreground hover:text-indigo-400 transition-colors line-clamp-2">
                                    {news.title}
                                </h2>
                            </Link>

                            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 mb-4">
                                {news.summary}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-auto">
                                {(news.tags || []).slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
