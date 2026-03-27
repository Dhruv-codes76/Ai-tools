const Parser = require('rss-parser');
const axios = require('axios');
const prisma = require('../config/prisma');
const aiWriterService = require('./aiWriterService');
const imageService = require('./imageService');
const { generateSlug } = require('../utils/seoUtils');

class NewsScraperService {
    constructor() {
        this.rssParser = new Parser();
        this.trustedFeeds = [
            'https://techcrunch.com/category/artificial-intelligence/feed/',
            'https://www.theverge.com/rss/artificial-intelligence/index.xml'
        ];
        this.redditSources = [
            'https://www.reddit.com/r/artificial/top.json?limit=5&t=day',
            'https://www.reddit.com/r/OpenAI/top.json?limit=5&t=day'
        ];
    }


    async articleExists(sourceLink) {
        const count = await prisma.news.count({ where: { sourceLink } });
        return count > 0;
    }

    async saveDraftArticle(sourceLink, rawTitle, rawText, source = "MANUAL") {
        try {
            // Check DB to prevent duplicates
            if (await this.articleExists(sourceLink)) {
                console.log(`Skipping duplicate: ${sourceLink}`);
                return;
            }

            // 1. Rewrite via Gemini
            console.log(`Processing with Gemini: ${rawTitle}`);
            const rewritten = await aiWriterService.rewriteNews(rawTitle, rawText);

            // 2. Download and Upload Image to Cloudinary (or fallback)
            console.log(`Sourcing image for: ${rewritten.title}`);
            let cloudinaryUrl = await imageService.getFeaturedImageFromUrl(sourceLink, rewritten.title);

            // 3. Save to Prisma as DRAFT
            const slug = generateSlug(rewritten.title) + '-' + Math.floor(Math.random() * 1000);

            await prisma.news.create({
                data: {
                    title: rewritten.title,
                    slug,
                    summary: rewritten.summary,
                    content: rewritten.content,
                    sourceLink,
                    source,
                    featuredImage: cloudinaryUrl || '', // Fallback empty if no image 
                    featuredImageAlt: rewritten.title,
                    status: 'DRAFT',
                    seoMetaTitle: rewritten.title,
                    seoMetaDescription: rewritten.summary,
                    canonicalUrl: `/news/${slug}`,
                    isDeleted: false
                }
            });

            console.log(`Saved DRAFT News: ${rewritten.title}`);
        } catch (error) {
            console.error(`Failed to save draft for ${sourceLink}:`, error);
        }
    }

    async fetchRSS() {
        console.log('--- Starting RSS Fetch ---');
        for (const feedUrl of this.trustedFeeds) {
            try {
                let feed = await this.rssParser.parseURL(feedUrl);
                // Just take the top 2 from each feed to not overwhelm daily
                const items = feed.items.slice(0, 2);
                for (const item of items) {
                    if (await this.articleExists(item.link)) continue;
                    
                    const rawText = item.contentSnippet || item.content || item.title;
                    await this.saveDraftArticle(item.link, item.title, rawText, "RSS");
                }
            } catch (e) {
                console.error(`RSS Error for ${feedUrl}:`, e.message);
            }
        }
    }

    async fetchReddit() {
        console.log('--- Starting Reddit Fetch ---');
        for (const redditUrl of this.redditSources) {
            try {
                const res = await axios.get(redditUrl);
                const posts = res.data.data.children;
                for (const post of posts) {
                    const data = post.data;
                    if (!data.is_self && !data.url.includes('reddit.com') && !data.url.includes('i.redd.it')) {
                        if (await this.articleExists(data.url)) continue;
                        
                        await this.saveDraftArticle(data.url, data.title, data.title, "REDDIT");
                        break; 
                    }
                }
            } catch (e) {
                console.error(`Reddit Error for ${redditUrl}:`, e.message);
            }
        }
    }

    async fetchGeminiGrounding() {
        console.log('--- Starting Gemini Grounding Fetch ---');
        const items = await aiWriterService.searchLatestNews();
        for (const item of items) {
            if (!item.url || await this.articleExists(item.url)) continue;
            await this.saveDraftArticle(item.url, item.rawTitle, item.rawText, "GEMINI_SEARCH");
        }
    }

    async runDailyAutomation() {
        console.log('Automated News Generation Triggered');
        await this.fetchRSS();
        await this.fetchReddit();
        await this.fetchGeminiGrounding();
        console.log('Automated News Generation Completed');
    }
}

module.exports = new NewsScraperService();
