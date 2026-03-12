const News = require('../models/News');
const { softDelete, restore } = require('../utils/softDelete');
const jwt = require('jsonwebtoken');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');

const getNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        let query = { status: 'published', isDeleted: false };
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                query = { isDeleted: false };
            } catch (err) {
                // Invalid token, fallback to published only
            }
        }

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await News.countDocuments(query);
        res.json({ data: news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getNewsBySlug = async (req, res) => {
    try {
        const article = await News.findOne({ slug: req.params.slug, isDeleted: false });
        if (!article) return res.status(404).json({ error: 'Article not found' });

        if (article.status === 'draft') {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            let isAuthorized = false;
            if (token) {
                try {
                    jwt.verify(token, process.env.JWT_SECRET);
                    isAuthorized = true;
                } catch (err) {
                    // Invalid token
                }
            }
            if (!isAuthorized) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createNews = async (req, res) => {
    try {
        const articleData = generateSEO(req.body, 'news');
        const article = new News(articleData);
        await article.save();
        await logActivity(req, 'CREATE', 'News', article._id, { title: article.title });
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateNews = async (req, res) => {
    try {
        const articleData = generateSEO(req.body, 'news');
        const article = await News.findByIdAndUpdate(req.params.id, articleData, { new: true });
        if (article) {
            await logActivity(req, 'UPDATE', 'News', article._id, req.body);
        }
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deactivateNews = async (req, res) => {
    return softDelete(req, News, req.params.id, res);
};

const restoreNews = async (req, res) => {
    return restore(req, News, req.params.id, res);
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews, deactivateNews, restoreNews };
