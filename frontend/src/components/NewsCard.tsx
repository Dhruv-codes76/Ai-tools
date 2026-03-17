import Link from "next/link";
import { ArrowRight, Bookmark, Share2, Image as ImageIcon } from "lucide-react";

export default function NewsCard({ news }: { news: any }) {
    const readTime = Math.ceil(news.content.split(' ').length / 200);
    const date = new Date(news.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric",
    });

    return (
        <article className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            {/* Image / Fallback Section */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted flex items-center justify-center">
                {news.featuredImage ? (
                    <img
                        src={news.featuredImage}
                        alt={news.featuredImageAlt || news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-background via-muted to-border flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest text-foreground uppercase border border-white/10 shadow-sm">
                    {news.category || 'AI Intel'}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6 md:p-8">
                <div className="flex items-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">
                    <time>{date}</time>
                    <span className="mx-2">&bull;</span>
                    <span>{readTime} MIN READ</span>
                </div>

                <h3 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                </h3>

                <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {news.summary}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                    <div className="flex gap-4">
                        <button className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full" aria-label="Save article">
                            <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full" aria-label="Share article">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    <Link
                        href={`/news/${news.slug}`}
                        className="flex items-center text-sm font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors group/link"
                    >
                        Read
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
