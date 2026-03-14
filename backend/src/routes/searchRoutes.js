const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Tool = require('../models/Tool');

/**
 * Searches for News and Tools matching a query.
 * Returns suggestions for internal linking.
 */
router.get('/suggestions', async (req, res, next) => {
    const query = req.query.q;
    if (!query || query.length < 2) {
        return res.json([]);
    }

    const regex = new RegExp(query, 'i');

    const [news, tools] = await Promise.all([
        News.find({ title: regex, isDeleted: false, status: 'published' })
            .select('title slug')
            .limit(5),
        Tool.find({ name: regex, isDeleted: false, status: 'published' })
            .select('name slug')
            .limit(5)
    ]);

    const suggestions = [
        ...news.map(item => ({
            id: item._id,
            title: item.title,
            url: `/news/${item.slug}`,
            type: 'news'
        })),
        ...tools.map(item => ({
            id: item._id,
            title: item.name,
            url: `/tools/${item.slug}`,
            type: 'tool'
        }))
    ];

    res.json(suggestions);
});

module.exports = router;
