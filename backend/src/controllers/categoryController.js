const prisma = require('../prisma');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const AppError = require('../utils/AppError');

const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({ where: { isDeleted: false } });
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await prisma.category.create({
            data: req.body
        });
        await logActivity(req, 'CREATE', 'Category', category.id, { name: category.name });
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 'P2002') {
            return next(new AppError('Category with this slug already exists', 400));
        }
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await prisma.category.update({
            where: { id: parseInt(req.params.id, 10) },
            data: req.body
        });
        
        await logActivity(req, 'UPDATE', 'Category', category.id, req.body);
        res.json(category);
    } catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError('Category not found with that ID', 404));
        }
        if (error.code === 'P2002') {
            return next(new AppError('Category slug must be unique', 400));
        }
        next(error);
    }
};

const deactivateCategory = async (req, res, next) => {
    return softDelete(req, prisma.category, 'Category', req.params.id, res, next);
};

const restoreCategory = async (req, res, next) => {
    return restore(req, prisma.category, 'Category', req.params.id, res, next);
};

module.exports = { getCategories, createCategory, updateCategory, deactivateCategory, restoreCategory };
