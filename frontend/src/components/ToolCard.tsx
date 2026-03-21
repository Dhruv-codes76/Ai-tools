import Link from "next/link";
import { Wrench } from "lucide-react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface ToolItem {
    _id: string;
    name: string;
    slug: string;
    description: string;
    pricing: string;
    category?: Category;
}

export default function ToolCard({ tool }: { tool: ToolItem }) {
    return (
        <article className="group flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg premium-hover hover:bg-white/10 hover:border-white/20 premium-active active:opacity-90">
            <Link prefetch={true} href={`/tools/${tool.slug}`} className="flex flex-col h-full">
                 {/* Image Placeholder Container (2:1 approx) with Zoom on Hover */}
                 <div className="relative w-full pt-[40%] bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted/20 transition-transform duration-700 group-hover:scale-[1.03]">
                        <Wrench className="w-8 h-8" />
                    </div>
                </div>

                <div className="flex flex-col flex-grow p-6 lg:p-8">
                    <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="font-sans text-xl font-bold leading-tight group-hover:text-foreground/80 transition-colors line-clamp-2">
                            {tool.name}
                        </h3>
                    </div>

                    <p className="text-sm text-muted-foreground flex-grow line-clamp-3 leading-relaxed font-medium mb-6">
                        {tool.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-xs tracking-wide">
                        <span className="font-semibold text-muted-foreground uppercase">Pricing</span>
                        <span className="capitalize font-medium px-2 py-1 rounded-md bg-muted/50 text-foreground/80">{tool.pricing || "Freemium"}</span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
