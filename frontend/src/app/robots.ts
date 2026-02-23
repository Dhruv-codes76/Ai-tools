import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/login/'],
        },
        sitemap: 'https://ai-mvp.vercel.app/sitemap.xml',
    };
}
