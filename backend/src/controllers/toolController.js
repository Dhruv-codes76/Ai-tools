const prisma = require('../prisma');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');
const AppError = require('../utils/AppError');
const { handleImageUploads } = require('../utils/cloudinary');

const getTools = async (req, res, next) => {
    try {
        const query = req.header('Authorization') ? { isDeleted: false } : { status: 'PUBLISHED', isDeleted: false };
        if (req.query.category) query.categoryId = parseInt(req.query.category, 10);

        const tools = await prisma.tool.findMany({
            where: query,
            include: { category: { select: { name: true, slug: true } } }
        });
        res.json(tools);
    } catch (error) {
        next(error);
    }
};

const getToolBySlug = async (req, res, next) => {
    try {
        const tool = await prisma.tool.findFirst({
            where: { slug: req.params.slug, isDeleted: false },
            include: { category: { select: { name: true, slug: true } } }
        });
        if (!tool) return next(new AppError('Tool not found', 404));
        
        if (tool.status === 'DRAFT' && !req.header('Authorization')) {
            return next(new AppError('Forbidden', 403));
        }
        res.json(tool);
    } catch (error) {
        next(error);
    }
};

const createTool = async (req, res, next) => {
    try {
        let toolData = generateSEO(req.body, 'tool');
        toolData = await handleImageUploads(req.files, toolData, 'tools');

        // Mongoose sometimes passes relation IDs as the model name (e.g. `category`)
        if (toolData.category) {
            toolData.categoryId = parseInt(toolData.category, 10);
            delete toolData.category;
        }

        // Convert enum string
        if (toolData.status) toolData.status = toolData.status.toUpperCase();
        if (toolData.pricing) toolData.pricing = toolData.pricing.toUpperCase();

        const tool = await prisma.tool.create({
            data: toolData
        });
        await logActivity(req, 'CREATE', 'Tool', tool.id.toString(), { name: tool.name });
        res.status(201).json(tool);
    } catch (error) {
        next(error);
    }
};

const updateTool = async (req, res, next) => {
    try {
        let toolData = generateSEO(req.body, 'tool');
        toolData = await handleImageUploads(req.files, toolData, 'tools');

        if (toolData.category) {
            toolData.categoryId = parseInt(toolData.category, 10);
            delete toolData.category;
        }

        if (toolData.status) toolData.status = toolData.status.toUpperCase();
        if (toolData.pricing) toolData.pricing = toolData.pricing.toUpperCase();

        const tool = await prisma.tool.update({
            where: { id: parseInt(req.params.id, 10) },
            data: toolData
        });
        
        await logActivity(req, 'UPDATE', 'Tool', tool.id.toString(), toolData);
        res.json(tool);
    } catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError('Tool not found with that ID', 404));
        }
        next(error);
    }
};

const deactivateTool = async (req, res, next) => {
    return softDelete(req, prisma.tool, 'Tool', req.params.id, res, next);
};

const restoreTool = async (req, res, next) => {
    return restore(req, prisma.tool, 'Tool', req.params.id, res, next);
};

module.exports = { getTools, getToolBySlug, createTool, updateTool, deactivateTool, restoreTool };
