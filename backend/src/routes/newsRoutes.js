const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { authMiddleware } = require('../middleware/auth');

// GET /api/news (Public) - Fetch with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        // Admin can see all, public sees only published
        const query = req.header('Authorization') ? {} : { status: 'published' };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await News.countDocuments(query);
        res.json({ data: news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/news/:slug (Public) - Fetch single article
router.get('/:slug', async (req, res) => {
    try {
        const article = await News.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ error: 'Article not found' });
        if (article.status === 'draft' && !req.header('Authorization')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/news (Protected) - Admin creates article
router.post('/', authMiddleware, async (req, res) => {
    try {
        const article = new News(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/news/:id (Protected) - Admin edits article
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/news/:id (Protected) - Admin deletes article
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
