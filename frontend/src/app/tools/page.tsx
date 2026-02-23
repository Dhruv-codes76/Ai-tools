import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import { getTools, getCategories } from '@/lib/api';


export const metadata = {
    title: 'AI Tools Directory | The Best Artificial Intelligence Apps',
    description: 'Browse our curated directory of the best AI tools, apps, and services for productivity, creation, and more.',
};

export default async function ToolsListing({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>
}) {
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    const activeCategory = resolvedParams?.category || '';

    const [toolsData, categories] = await Promise.all([
        getTools(currentPage, 12, activeCategory),
        getCategories()
    ]);

    const { data: tools, totalPages } = toolsData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold mb-4">AI Tools Directory</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Discover the top artificial intelligence applications to boost your productivity.
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
                <Link
                    href="/tools"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    All Tools
                </Link>
                {categories.map((cat: any) => (
                    <Link
                        key={cat._id}
                        href={`/tools?category=${cat._id}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {tools?.length > 0 ? (
                    tools.map((tool: any) => <ToolCard key={tool._id} tool={tool} />)
                ) : (
                    <p className="text-gray-500 col-span-3">No tools found for this category.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center flex-wrap gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/tools?page=${i + 1}${activeCategory ? `&category=${activeCategory}` : ''}`}
                            className={`px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${currentPage === i + 1 ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-100' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
