import NewsReelContainer from "./NewsReelContainer";
import { getNews } from "@/lib/api";

export const metadata = {
    title: "Latest AI News | Editorial",
    description: "Read the latest beginner-friendly, unbiased AI news.",
};

// Ensure page is always dynamic (no stale caching)
export const revalidate = 0;

export default async function NewsPage() {
    const { data: newsItems } = await getNews();

    return <NewsReelContainer newsItems={newsItems || []} />;
}
