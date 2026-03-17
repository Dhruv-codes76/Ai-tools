import Link from "next/link";
import { ArrowRight, Star, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function ToolCard({ tool }: { tool: any }) {
    return (
        <article className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    {/* Tool Icon / Fallback */}
                    <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:shadow-primary/20 group-hover:border-primary/50">
                        {tool.logo ? (
                            <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                        )}
                    </div>

                    {/* Category */}
                    <span className="text-xs font-bold tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg uppercase">
                        {tool.category || 'Utility'}
                    </span>
                </div>

                <h3 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {tool.name}
                </h3>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3 mb-8 flex-grow">
                    {tool.description}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-lg shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-foreground">{tool.rating || '4.5'}</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        {tool.websiteUrl && (
                            <a
                                href={tool.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full group/ext"
                                aria-label={`Visit ${tool.name} website`}
                            >
                                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/ext:translate-y-px" />
                            </a>
                        )}

                        <Link
                            href={`/tools/${tool.slug}`}
                            className="flex items-center text-sm font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors group/link"
                        >
                            Explore
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
