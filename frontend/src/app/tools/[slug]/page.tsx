import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/api";
import BackLink from "@/components/BackLink";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const tool = await getToolBySlug(slug);
    if (!tool) return { title: 'Not Found' };

    const title = tool.seoMetaTitle || tool.name;
    const description = tool.seoMetaDescription || tool.description;
    const url = `https://ai-news-portal.com/tools/${tool.slug}`;

    return {
        title: `${title} | AI Tools`,
        description: description,
        alternates: {
            canonical: tool.canonicalUrl || url,
        },
        openGraph: {
            title: tool.ogTitle || title,
            description: tool.ogDescription || description,
            url: url,
            type: 'website',
            images: tool.ogImage ? [{ url: tool.ogImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.twitterTitle || title,
            description: tool.twitterDescription || description,
            images: tool.twitterImage ? [tool.twitterImage] : (tool.ogImage ? [tool.ogImage] : []),
        },
    };
}

export default async function SingleToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const tool = await getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: tool.name,
                    description: tool.description,
                    applicationCategory: tool.category?.name || 'MultimediaApplication',
                    operatingSystem: 'Web',
                    offers: {
                        '@type': 'Offer',
                        price: tool.pricing === 'free' ? '0' : 'Varies',
                        priceCurrency: 'USD',
                    },
                }) }}
            />
            <BackLink href="/tools" label="Catalog" />

            <article>
                {tool.featuredImage && (
                    <div className="w-full aspect-video mb-12 border border-border overflow-hidden">
                        <img 
                            src={tool.featuredImage} 
                            alt={tool.featuredImageAlt || tool.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <header className="border-b-4 border-foreground pb-10 mb-12">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight leading-none mb-8 text-foreground">
                        {tool.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase">
                        {tool.category && (
                            <span className="px-3 py-1.5 border border-border text-muted-foreground">
                                {tool.category.name}
                            </span>
                        )}
                        <span className="px-3 py-1.5 border border-foreground text-foreground flex items-center">
                            Pricing: {tool.pricing || "Free / Freemium"}
                        </span>
                    </div>
                </header>

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-muted-foreground leading-loose"
                    dangerouslySetInnerHTML={{ __html: tool.description }}
                />

                {tool.website && (
                    <footer className="pt-10 border-t border-border flex justify-center">
                        <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-10 py-5 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border-2 border-transparent hover:border-foreground transition-all text-center w-full md:w-auto"
                        >
                            Navigate to Website
                        </a>
                    </footer>
                )}
            </article>
        </div>
    );
}
