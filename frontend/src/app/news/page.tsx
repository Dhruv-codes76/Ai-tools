import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { getNews } from '@/lib/api';


export const metadata = {
    title: 'AI News | Latest Updates in Artificial Intelligence',
    description: 'Read the latest news and updates about Artificial Intelligence, machine learning, and new AI tools.',
};

export default async function NewsListing({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    const { data: news, totalPages } = await getNews(currentPage);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold mb-4">AI News</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Stay informed with the latest developments in artificial intelligence.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {news?.length > 0 ? (
                    news.map((article: any) => <NewsCard key={article._id} article={article} />)
                ) : (
                    <p className="text-gray-500 col-span-3">No news available.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center flex-wrap gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/news?page=${i + 1}`}
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
