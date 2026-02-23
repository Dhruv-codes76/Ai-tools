import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ai-mvp.vercel.app';

    // Fetch all news and tools for dynamic sitemap
    // In a real scenario, use an endpoint that returns just slugs and updated dates to be lightweight
    const [newsRes, toolsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news?limit=1000`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools?limit=1000`)
    ]);

    const newsData = await newsRes.json();
    const toolsData = await toolsRes.json();

    const newsUrls = (newsData.data || []).map((article: any) => ({
        url: `${baseUrl}/news/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const toolUrls = (toolsData.data || []).map((tool: any) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(tool.updatedAt || tool.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...newsUrls,
        ...toolUrls,
    ];
}
