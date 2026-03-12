const Category = require('../models/Category');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const category = new Category({ name, slug, description });
        await category.save();
        await logActivity(req, 'CREATE', 'Category', category._id, { name: category.name });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, slug, description }, { new: true });
        if (category) {
            await logActivity(req, 'UPDATE', 'Category', category._id, { name, slug, description });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deactivateCategory = async (req, res) => {
    return softDelete(req, Category, req.params.id, res);
};

const restoreCategory = async (req, res) => {
    return restore(req, Category, req.params.id, res);
};

module.exports = { getCategories, createCategory, updateCategory, deactivateCategory, restoreCategory };
