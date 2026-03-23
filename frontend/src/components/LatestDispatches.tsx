import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/api";

export default async function LatestDispatches() {
  const { data: latestNews } = await getNews(1, 6);

  if (!latestNews || latestNews.length === 0) {
    return (
      <p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">
        No transmissions currently active.
      </p>
    );
  }

  return (
    <>
      {latestNews.map((news: any) => (
        <NewsCard key={news._id} news={news} />
      ))}
    </>
  );
}
