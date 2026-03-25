const activityLogService = require('../services/activityLogService');

/**
 * Enterprise Activity Log Controller
 */

const getLogs = async (req, res, next) => {
    try {
        const { logs, pagination } = await activityLogService.getLogs({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            resource: req.query.resource,
            action: req.query.action,
            adminEmail: req.query.adminEmail
        });

        res.json({ data: logs, ...pagination });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLogs };

