const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { authMiddleware } = require('../middleware/auth');

// GET /api/tools (Public)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const category = req.query.category;

        let query = req.header('Authorization') ? {} : { status: 'published' };
        if (category) query.category = category;

        const tools = await Tool.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Tool.countDocuments(query);
        res.json({ data: tools, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/tools/:slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const tool = await Tool.findOne({ slug: req.params.slug }).populate('category', 'name slug');
        if (!tool) return res.status(404).json({ error: 'Tool not found' });
        if (tool.status === 'draft' && !req.header('Authorization')) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(tool);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/tools (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const tool = new Tool(req.body);
        await tool.save();
        res.status(201).json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/tools/:id (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/tools/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Tool.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tool deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
