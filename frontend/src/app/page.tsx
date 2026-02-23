import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import ToolCard from '@/components/ToolCard';
import { getNews, getTools } from '@/lib/api';

export default async function Home() {
  const [news, tools] = await Promise.all([getNews(1, 3), getTools(1, 3)]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          The Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">AI Innovation</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
          Stay updated with the latest artificial intelligence news and discover powerful AI tools to supercharge your workflow.
        </p>
      </div>

      {/* Latest News Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Latest AI News</h2>
          <Link href="/news" className="text-blue-600 hover:text-blue-500 font-medium">
            View all news &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.data?.length > 0 ? (
            news.data.map((article: any) => <NewsCard key={article._id} article={article} />)
          ) : (
            <p className="text-gray-500 col-span-3">No news available at the moment.</p>
          )}
        </div>
      </div>

      {/* Top Tools Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Featured AI Tools</h2>
          <Link href="/tools" className="text-blue-600 hover:text-blue-500 font-medium">
            Discover more tools &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.data?.length > 0 ? (
            tools.data.map((tool: any) => <ToolCard key={tool._id} tool={tool} />)
          ) : (
            <p className="text-gray-500 col-span-3">No tools available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
