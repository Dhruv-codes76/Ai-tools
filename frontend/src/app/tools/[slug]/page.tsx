import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/api';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const tool = await getToolBySlug(resolvedParams.slug);

    if (!tool) return { title: 'Not Found' };

    return {
        title: tool.seoMetaTitle || `${tool.name} | AI Tools`,
        description: tool.seoMetaDescription || tool.description,
    };
}

export default async function ToolDetail({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const tool = await getToolBySlug(resolvedParams.slug);

    if (!tool) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-12">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {tool.verified && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    Verified
                                </span>
                            )}
                            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                                {tool.category?.name || 'Tool'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold">{tool.name}</h1>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
                            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </span>
                        <a
                            href={tool.affiliateLink || tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-center inline-block w-full sm:w-auto"
                        >
                            Visit Website
                        </a>
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="lead text-2xl text-gray-700 dark:text-gray-200 mb-8 font-medium">
                        {tool.description}
                    </p>

                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Tags:</span>
                        {tool.tags?.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
