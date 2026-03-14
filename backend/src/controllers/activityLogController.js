const ActivityLog = require('../models/ActivityLog');
const AppError = require('../utils/AppError');

// GET /api/logs (Protected)
const getLogs = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Optional filtering by resource, action, or adminEmail
    const filter = {};
    if (req.query.resource) filter.resource = req.query.resource;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.adminEmail) filter.adminEmail = req.query.adminEmail;

    const logs = await ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await ActivityLog.countDocuments(filter);
    res.json({ data: logs, total, page, totalPages: Math.ceil(total / limit) });
};

module.exports = { getLogs };
