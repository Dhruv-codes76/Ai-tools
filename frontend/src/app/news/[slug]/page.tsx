import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNewsBySlug } from '@/lib/api';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const article = await getNewsBySlug(resolvedParams.slug);

    if (!article) return { title: 'Not Found' };

    return {
        title: article.seoMetaTitle || `${article.title} | AI News`,
        description: article.seoMetaDescription || article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            type: 'article',
            publishedTime: article.createdAt,
        }
    };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = await getNewsBySlug(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    const dateStr = new Date(article.createdAt).toLocaleDateString();

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-10 text-center">
                <div className="flex justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">
                    {article.tags?.map((tag: string) => (
                        <span key={tag} className="uppercase tracking-wider">{tag}</span>
                    ))}
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                    {article.title}
                </h1>
                <div className="text-gray-500 dark:text-gray-400">
                    Published on {dateStr}
                </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 border-l-4 border-blue-500 pl-4 italic">
                    {article.summary}
                </p>

                {/* For MVP, we're rendering raw HTML, or markdown. Wait, if it's markdown, we need react-markdown.
            If it's safe HTML from our own CMS, dangerouslySetInnerHTML works. */}
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {article.sourceLink && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <a
                        href={article.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Read original source &rarr;
                    </a>
                </div>
            )}

            {/* Optional JSON-LD Structured Data snippet for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'NewsArticle',
                        headline: article.title,
                        datePublished: article.createdAt,
                        dateModified: article.updatedAt,
                        description: article.summary
                    })
                }}
            />
        </article>
    );
}
