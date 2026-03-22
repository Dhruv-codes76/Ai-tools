/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
import { getNews, getTools } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.aiportalweekly.com';

    const baseUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
    ];

    try {
        // Fetch all news and tools for dynamic sitemap using centralized API
        const [newsData, toolsData] = await Promise.all([
            getNews(1, 1000),
            getTools(1, 1000)
        ]);

        const newsUrls = Array.isArray(newsData.data) ? newsData.data.map((article: any) => ({
            url: `${baseUrl}/news/${article.slug}`,
            lastModified: new Date(article.updatedAt || article.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })) : [];

        const toolUrls = Array.isArray(toolsData.data) ? toolsData.data.map((tool: any) => ({
            url: `${baseUrl}/tools/${tool.slug}`,
            lastModified: new Date(tool.updatedAt || tool.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })) : [];

        return [
            ...baseUrls,
            ...newsUrls,
            ...toolUrls,
        ];
    } catch (error) {
        console.error("Network error generating sitemap:", error);
        return baseUrls;
    }
}
