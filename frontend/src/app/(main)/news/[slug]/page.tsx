import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";
import BackLink from "@/components/BackLink";
import SwipeToBack from "@/components/SwipeToBack";
import ArticleClientControls from "./ArticleClientControls";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const article = await getNewsBySlug(slug);
    if (!article) return { title: 'Not Found' };

    const title = article.seoMetaTitle || article.title;
    const description = article.seoMetaDescription || article.summary;
    const url = `https://www.aiportalweekly.com/news/${article.slug}`;

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
            <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-8 md:py-16 animate-fade-in animate-slide-up pb-24">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="mb-10 flex justify-between items-center">
                    <BackLink href="/news" label="Back to News" />

                    <ArticleClientControls
                        title={article.title}
                        slug={article.slug}
                        imageUrl={article.featuredImage}
                    />
                </div>

                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                            {article.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 font-medium">
                            {article.summary}
                        </p>

                        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground/80 mb-8 border-b border-border pb-8">
                            <div className="flex items-center gap-4">
                                <time>{date}</time>
                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                <span>Intelligence Brief</span>
                            </div>
                        </div>
                    </header>

                    {article.featuredImage && (
                        <figure className="mb-12 w-full rounded-2xl overflow-hidden bg-muted">
                            <img
                                src={article.featuredImage}
                                alt={article.featuredImageAlt || article.title}
                                className="w-full h-auto object-cover"
                            />
                        </figure>
                    )}

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none mb-12 font-sans text-foreground/90 leading-[1.8]"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {article.sourceLink && (
                        <footer className="pt-8 mt-12 border-t border-border flex justify-between items-center">
                            <a
                                href={article.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-base font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
                            >
                                Read Original Source
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </a>

                            <ArticleClientControls
                                title={article.title}
                                slug={article.slug}
                                imageUrl={article.featuredImage}
                            />
                        </footer>
                    )}
                </article>

                <div className="mt-20">
                    <CommentSection articleId={article.slug} />
                </div>
            </div>
        </SwipeToBack>
    );
}
