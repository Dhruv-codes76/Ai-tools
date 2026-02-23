import Link from 'next/link';
import { formatDistance } from 'date-fns'; // We will install date-fns later if needed, but for now we can use simple JS dates or native Intl.RelativeTimeFormat.
// Actually, let's use standard JS to avoid new deps for now.

export default function NewsCard({ article }: { article: any }) {
    const dateStr = new Date(article.createdAt).toLocaleDateString();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex space-x-2 text-sm text-gray-400 mb-3">
                    <span>{dateStr}</span>
                    {article.tags?.length > 0 && (
                        <>
                            <span>&bull;</span>
                            <span className="text-blue-500">{article.tags[0]}</span>
                        </>
                    )}
                </div>
                <Link href={`/news/${article.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-500 transition-colors">{article.title}</h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {article.summary}
                </p>
            </div>
        </div>
    );
}
