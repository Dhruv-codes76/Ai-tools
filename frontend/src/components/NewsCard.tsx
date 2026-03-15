import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
    image_url?: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    const date = new Date(news.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="group flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <Link href={`/news/${news.slug}`} className="flex flex-col h-full">
                {/* Image Placeholder Container (16:9) */}
                <div className="relative w-full pt-[56.25%] bg-muted flex items-center justify-center">
                    {news.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={news.image_url}
                            alt={news.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-6">
                    <time className="text-xs tracking-wider text-muted-foreground uppercase font-medium mb-3">
                        {date}
                    </time>
                    <h3 className="font-sans text-xl md:text-2xl font-bold text-card-foreground leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto">
                        {news.summary}
                    </p>
                </div>
            </Link>
        </article>
    );
}
