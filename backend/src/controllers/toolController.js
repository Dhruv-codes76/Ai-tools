const Tool = require('../models/Tool');
const { softDelete, restore } = require('../utils/softDelete');
const jwt = require('jsonwebtoken');
const { logActivity } = require('../utils/logger');
const { generateSEO } = require('../utils/seoUtils');

const getTools = async (req, res) => {
    try {
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
        if (req.query.category) query.category = req.query.category;

        const tools = await Tool.find(query).populate('category', 'name slug');
        res.json(tools);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getToolBySlug = async (req, res) => {
    try {
        const tool = await Tool.findOne({ slug: req.params.slug, isDeleted: false }).populate('category', 'name slug');
        if (!tool) return res.status(404).json({ error: 'Tool not found' });

        if (tool.status === 'draft') {
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
        res.json(tool);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createTool = async (req, res) => {
    try {
        const toolData = generateSEO(req.body, 'tool');
        const tool = new Tool(toolData);
        await tool.save();
        await logActivity(req, 'CREATE', 'Tool', tool._id, { name: tool.name });
        res.status(201).json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTool = async (req, res) => {
    try {
        const toolData = generateSEO(req.body, 'tool');
        const tool = await Tool.findByIdAndUpdate(req.params.id, toolData, { new: true });
        if (tool) {
            await logActivity(req, 'UPDATE', 'Tool', tool._id, req.body);
        }
        res.json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deactivateTool = async (req, res) => {
    return softDelete(req, Tool, req.params.id, res);
};

const restoreTool = async (req, res) => {
    return restore(req, Tool, req.params.id, res);
};

module.exports = { getTools, getToolBySlug, createTool, updateTool, deactivateTool, restoreTool };
