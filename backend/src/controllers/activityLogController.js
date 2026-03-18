const prisma = require('../prisma');
const AppError = require('../utils/AppError');

// GET /api/logs (Protected)
const getLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // Optional filtering by resource, action, or adminEmail
        const filter = {};
        if (req.query.resource) filter.resource = req.query.resource;
        if (req.query.action) filter.action = req.query.action;
        if (req.query.adminEmail) filter.adminEmail = req.query.adminEmail;

        const logs = await prisma.activityLog.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });

        const total = await prisma.activityLog.count({ where: filter });
        res.json({ data: logs, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLogs };
