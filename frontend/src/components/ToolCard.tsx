import Link from 'next/link';

export default function ToolCard({ tool }: { tool: any }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <Link href={`/tools/${tool.slug}`}>
                        <h3 className="text-xl font-bold hover:text-blue-500 transition-colors">{tool.name}</h3>
                    </Link>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-medium rounded">
                        {tool.pricing}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {tool.description}
                </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.category?.name || 'Uncategorized'}
                </span>
                <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                    Visit Website &rarr;
                </a>
            </div>
        </div>
    );
}
