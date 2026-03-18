const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

/**
 * Searches for News and Tools matching a query.
 * Returns suggestions for internal linking.
 */
router.get('/suggestions', async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 2) {
            return res.json([]);
        }

        const [news, tools] = await Promise.all([
            prisma.news.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive'
                    },
                    isDeleted: false,
                    status: 'PUBLISHED'
                },
                select: { id: true, title: true, slug: true },
                take: 5
            }),
            prisma.tool.findMany({
                where: {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    },
                    isDeleted: false,
                    status: 'PUBLISHED'
                },
                select: { id: true, name: true, slug: true },
                take: 5
            })
        ]);

        const suggestions = [
            ...news.map(item => ({
                id: item.id.toString(),
                title: item.title,
                url: `/news/${item.slug}`,
                type: 'news'
            })),
            ...tools.map(item => ({
                id: item.id.toString(),
                title: item.name,
                url: `/tools/${item.slug}`,
                type: 'tool'
            }))
        ];

        res.json(suggestions);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
