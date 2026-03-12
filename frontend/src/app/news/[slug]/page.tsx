import Link from "next/link";
import { notFound } from "next/navigation";
import xss from "xss";

async function getArticle(slug: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${slug}`;
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);
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

export default async function SingleNewsPage({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Link href="/news" className="inline-block text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground mb-12 transition-colors">
                &larr; Directory
            </Link>

            <article>
                {article.featuredImage && (
                    <div className="w-full aspect-video mb-12 border border-border overflow-hidden">
                        <img 
                            src={article.featuredImage} 
                            alt={article.featuredImageAlt || article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <header className="border-b-4 border-foreground pb-8 mb-10">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight leading-none mb-6 text-foreground">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-sm font-medium tracking-widest text-muted-foreground uppercase">
                        <time>{date}</time>
                        <span className="mx-4">&mdash;</span>
                        <span>Intelligence Brief</span>
                    </div>
                </header>

                <p className="text-xl md:text-2xl font-sans text-muted-foreground italic mb-12 leading-relaxed">
                    {article.summary}
                </p>

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-muted-foreground leading-loose"
                    dangerouslySetInnerHTML={{ __html: xss(article.content) }}
                />

                {article.sourceLink && (
                    <footer className="pt-8 border-t border-border">
                        <a
                            href={article.sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm font-bold tracking-widest uppercase text-foreground border-b border-foreground hover:text-muted-foreground hover:border-muted-foreground transition-all pb-1"
                        >
                            Read Original Source &rarr;
                        </a>
                    </footer>
                )}
            </article>
        </div>
    );
}
