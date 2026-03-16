import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export const metadata = {
    title: "Latest AI News | Editorial",
    description: "Read the latest beginner-friendly, unbiased AI news.",
};

export default async function NewsPage() {
    const { data: newsItems } = await getNews();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <PageHeader 
                title="AI News Directory" 
                subtitle="The signal, cleanly separated from the noise." 
            />

            {newsItems && newsItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsItems.map((item: any, index: number) => (
                        <div
                            key={item._id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                            <NewsCard news={{...item, trending: index < 2}} />
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message="No transmissions available." />
            )}
        </div>
    );
}
