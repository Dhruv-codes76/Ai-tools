const prisma = require('../prisma');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');
const AppError = require('../utils/AppError');
const { handleImageUploads } = require('../utils/cloudinary');

const getNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const query = req.header('Authorization') ? { isDeleted: false } : { status: 'PUBLISHED', isDeleted: false };

        const news = await prisma.news.findMany({
            where: query,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });

        const total = await prisma.news.count({ where: query });
        res.json({ data: news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

const getNewsBySlug = async (req, res, next) => {
    try {
        const article = await prisma.news.findFirst({
            where: { slug: req.params.slug, isDeleted: false }
        });
        if (!article) return next(new AppError('Article not found', 404));

        if (article.status === 'DRAFT' && !req.header('Authorization')) {
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
        articleData = await handleImageUploads(req.files, articleData, 'news');

        if (articleData.status) articleData.status = articleData.status.toUpperCase();

        const article = await prisma.news.create({
            data: articleData
        });
        await logActivity(req, 'CREATE', 'News', article.id.toString(), { title: article.title });
        res.status(201).json(article);
    } catch (error) {
        next(error);
    }
};

const updateNews = async (req, res, next) => {
    try {
        let articleData = generateSEO(req.body, 'news');
        articleData = await handleImageUploads(req.files, articleData, 'news');

        if (articleData.status) articleData.status = articleData.status.toUpperCase();

        const article = await prisma.news.update({
            where: { id: parseInt(req.params.id, 10) },
            data: articleData
        });

        await logActivity(req, 'UPDATE', 'News', article.id.toString(), articleData);
        res.json(article);
    } catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError('Article not found with that ID', 404));
        }
        next(error);
    }
};

const deactivateNews = async (req, res, next) => {
    return softDelete(req, prisma.news, 'News', req.params.id, res, next);
};

const restoreNews = async (req, res, next) => {
    return restore(req, prisma.news, 'News', req.params.id, res, next);
};

module.exports = { getNews, getNewsBySlug, createNews, updateNews, deactivateNews, restoreNews };
