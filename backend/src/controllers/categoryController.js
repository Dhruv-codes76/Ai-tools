const Category = require('../models/Category');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const AppError = require('../utils/AppError');

const getCategories = async (req, res, next) => {
    const categories = await Category.find({ isDeleted: false });
    res.json(categories);
};

const createCategory = async (req, res, next) => {
    const category = new Category(req.body);
    await category.save();
    await logActivity(req, 'CREATE', 'Category', category._id, { name: category.name });
    res.status(201).json(category);
};

const updateCategory = async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!category) return next(new AppError('Category not found with that ID', 404));
    
    await logActivity(req, 'UPDATE', 'Category', category._id, req.body);
    res.json(category);
};

const deactivateCategory = async (req, res, next) => {
    return softDelete(req, Category, req.params.id, res, next);
};

const restoreCategory = async (req, res, next) => {
    return restore(req, Category, req.params.id, res, next);
};

module.exports = { getCategories, createCategory, updateCategory, deactivateCategory, restoreCategory };
