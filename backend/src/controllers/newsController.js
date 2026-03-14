const News = require('../models/News');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');
const AppError = require('../utils/AppError');

const getNews = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const query = req.header('Authorization') ? { isDeleted: false } : { status: 'published', isDeleted: false };

    const news = await News.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await News.countDocuments(query);
    res.json({ data: news, total, page, totalPages: Math.ceil(total / limit) });
};

const getNewsBySlug = async (req, res, next) => {
    const article = await News.findOne({ slug: req.params.slug, isDeleted: false });
    if (!article) return next(new AppError('Article not found', 404));
    
    if (article.status === 'draft' && !req.header('Authorization')) {
        return next(new AppError('Forbidden', 403));
    }
    
    res.json(article);
};

const createNews = async (req, res, next) => {
    const articleData = generateSEO(req.body, 'news');
    const article = new News(articleData);
    await article.save();
    await logActivity(req, 'CREATE', 'News', article._id, { title: article.title });
    res.status(201).json(article);
};

const updateNews = async (req, res, next) => {
    const articleData = generateSEO(req.body, 'news');
    const article = await News.findByIdAndUpdate(req.params.id, articleData, { new: true });
    
    // Express 5 or handleCastErrorDB will catch invalid IDs, but if it's a valid ID making no match:
    if (!article) return next(new AppError('Article not found with that ID', 404));
    
    await logActivity(req, 'UPDATE', 'News', article._id, req.body);
    res.json(article);
};

const deactivateNews = async (req, res, next) => {
    return softDelete(req, News, req.params.id, res, next);
};

const restoreNews = async (req, res, next) => {
    return restore(req, News, req.params.id, res, next);
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews, deactivateNews, restoreNews };
