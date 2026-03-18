import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";
import BackLink from "@/components/BackLink";

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
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-fade-in animate-slide-up">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mb-8">
                <BackLink href="/news" label="Directory" />
            </div>

            <article className="space-y-6 md:space-y-10">
                {article.featuredImage && (
                    <div className="w-full aspect-video rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={article.featuredImage} 
                            alt={article.featuredImageAlt || article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <header className="pb-8 border-b border-white/10">
                    <h1 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-foreground leading-[1.2] mb-6">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        <time>{date}</time>
                        <span className="mx-4">&middot;</span>
                        <span>Intelligence Brief</span>
                    </div>
                </header>

                <p className="text-lg md:text-xl font-sans text-muted-foreground italic leading-relaxed border-l-4 border-white/20 pl-4 py-2">
                    {article.summary}
                </p>

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-gray-300 leading-[1.8]"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {article.sourceLink && (
                    <footer className="pt-8 border-t border-white/10">
                        <a
                            href={article.sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-semibold tracking-wide text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Read Original Source &rarr;
                        </a>
                    </footer>
                )}
            </article>

            <div className="mt-16 pt-16 border-t border-white/10">
                <CommentSection articleId={article._id} />
            </div>
        </div>
    );
}
