const Tool = require('../models/Tool');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');
const AppError = require('../utils/AppError');
const { handleImageUploads } = require('../utils/cloudinary');


const getTools = async (req, res, next) => {
    const query = req.header('Authorization') ? { isDeleted: false } : { status: 'published', isDeleted: false };
    if (req.query.category) query.category = req.query.category;

    const tools = await Tool.find(query).populate('category', 'name slug');
    res.json(tools);
};

const getToolBySlug = async (req, res, next) => {
    const tool = await Tool.findOne({ slug: req.params.slug, isDeleted: false }).populate('category', 'name slug');
    if (!tool) return next(new AppError('Tool not found', 404));
    
    if (tool.status === 'draft' && !req.header('Authorization')) {
        return next(new AppError('Forbidden', 403));
    }
    res.json(tool);
};

const createTool = async (req, res, next) => {
    try {
        let toolData = generateSEO(req.body, 'tool');

        // Handle image uploads if any
        toolData = await handleImageUploads(req.files, toolData, 'tools');

        const tool = new Tool(toolData);
        await tool.save();
        await logActivity(req, 'CREATE', 'Tool', tool._id, { name: tool.name });
        res.status(201).json(tool);
    } catch (error) {
        next(error);
    }
};

const updateTool = async (req, res, next) => {
    try {
        let toolData = generateSEO(req.body, 'tool');

        // Handle image uploads if any
        toolData = await handleImageUploads(req.files, toolData, 'tools');

        const tool = await Tool.findByIdAndUpdate(req.params.id, toolData, { new: true });
        
        if (!tool) return next(new AppError('Tool not found with that ID', 404));
        
        await logActivity(req, 'UPDATE', 'Tool', tool._id, req.body);
        res.json(tool);
    } catch (error) {
        next(error);
    }
};


const deactivateTool = async (req, res, next) => {
    return softDelete(req, Tool, req.params.id, res, next);
};

const restoreTool = async (req, res, next) => {
    return restore(req, Tool, req.params.id, res, next);
};

module.exports = { getTools, getToolBySlug, createTool, updateTool, deactivateTool, restoreTool };
