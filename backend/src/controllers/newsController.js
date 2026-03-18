const News = require('../models/News');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');
const AppError = require('../utils/AppError');
const { handleImageUploads } = require('../utils/cloudinary');


const getNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        // Ensure we fetch both published and draft if it's the admin panel
        const query = req.header('Authorization') ? { isDeleted: false } : { status: { $regex: '^published$', $options: 'i' }, isDeleted: false };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await News.countDocuments(query);
        res.json({ data: news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

const getNewsBySlug = async (req, res, next) => {
    try {
        const article = await News.findOne({ slug: req.params.slug, isDeleted: false });
        if (!article) return next(new AppError('Article not found', 404));

        if (article.status === 'draft' && !req.header('Authorization')) {
            return next(new AppError('Forbidden', 403));
        }

        res.json(article);
    } catch (error) {
        next(error);
    }
};

const createNews = async (req, res, next) => {
    try {
        let articleData = generateSEO(req.body, 'news');
        
        // Handle image uploads if any
        articleData = await handleImageUploads(req.files, articleData, 'news');

        const article = new News(articleData);
        await article.save();
        await logActivity(req, 'CREATE', 'News', article._id, { title: article.title });
        res.status(201).json(article);
    } catch (error) {
        next(error);
    }
};

const updateNews = async (req, res, next) => {
    try {
        let articleData = generateSEO(req.body, 'news');

        // Handle image uploads if any
        articleData = await handleImageUploads(req.files, articleData, 'news');

        const article = await News.findByIdAndUpdate(req.params.id, articleData, { new: true });

        if (!article) return next(new AppError('Article not found with that ID', 404));

        await logActivity(req, 'UPDATE', 'News', article._id, req.body);
        res.json(article);
    } catch (error) {
        next(error);
    }
};


const deactivateNews = async (req, res, next) => {
    return softDelete(req, News, req.params.id, res, next);
};

const restoreNews = async (req, res, next) => {
    return restore(req, News, req.params.id, res, next);
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews, deactivateNews, restoreNews };
