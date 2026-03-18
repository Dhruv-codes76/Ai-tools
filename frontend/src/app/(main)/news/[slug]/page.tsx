import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";
import BackLink from "@/components/BackLink";
import SwipeToBack from "@/components/SwipeToBack";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const article = await getNewsBySlug(slug);
    if (!article) return { title: 'Not Found' };

    const title = article.seoMetaTitle || article.title;
    const description = article.seoMetaDescription || article.summary;
    const url = `https://ai-news-portal.com/news/${article.slug}`;

    return {
        title: `${title} | AI News`,
        description: description,
        alternates: {
            canonical: article.canonicalUrl || url,
        },
        openGraph: {
            title: article.ogTitle || title,
            description: article.ogDescription || description,
            url: url,
            type: 'article',
            publishedTime: article.createdAt,
            images: article.ogImage ? [{ url: article.ogImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.twitterTitle || title,
            description: article.twitterDescription || description,
            images: article.twitterImage ? [article.twitterImage] : (article.ogImage ? [article.ogImage] : []),
        },
    };
}

export default async function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const article = await getNewsBySlug(slug);

    if (!article) {
        notFound();
    }

    const date = new Date(article.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.summary,
        image: article.ogImage || '',
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        author: {
            '@type': 'Organization',
            name: 'AI Intelligence Portal',
        },
    };

    return (
        <SwipeToBack>
            <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-16 animate-fade-in animate-slide-up pb-24">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="mb-8 sticky top-0 bg-[#05050A]/80 backdrop-blur-xl z-10 py-4 -mx-4 px-4 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:mx-0">
                    <BackLink href="/news" label="Back" />
                </div>

                <article className="space-y-6 md:space-y-8 rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-3xl">
                    {article.featuredImage && (
                        <div className="w-full aspect-video rounded-xl border border-white/10 shadow-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={article.featuredImage}
                                alt={article.featuredImageAlt || article.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    )}

                    <header className="pb-6 border-b border-white/10">
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white/90 leading-tight mb-4">
                            {article.title}
                        </h1>

                        <div className="flex items-center text-sm font-medium tracking-wide text-gray-500 uppercase">
                            <time>{date}</time>
                            <span className="mx-3 text-white/20">&middot;</span>
                            <span>Intelligence Brief</span>
                        </div>
                    </header>

                    <p className="text-xl md:text-2xl font-medium text-gray-300 leading-relaxed border-l-4 border-white/20 pl-6 py-2 my-8">
                        {article.summary}
                    </p>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none mb-12 font-sans text-gray-300 leading-[1.8] space-y-4"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {article.sourceLink && (
                        <footer className="pt-8 border-t border-white/10 mt-12">
                            <a
                                href={article.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm font-semibold tracking-wide text-white/70 hover:text-white transition-colors group"
                            >
                                Read Original Source
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </a>
                        </footer>
                    )}
                </article>

                <div className="mt-16 pt-12 border-t border-white/5">
                    <CommentSection articleId={article._id} />
                </div>
            </div>
        </SwipeToBack>
    );
}
