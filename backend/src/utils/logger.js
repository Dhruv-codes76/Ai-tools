const prisma = require('../prisma');

/**
 * Centrally log admin operations to the database using Prisma
 * 
 * @param {Object} req - Express request object
 * @param {String} action - Action performed
 * @param {String} resource - The resource affected
 * @param {String} resourceId - The ID of the affected resource (optional)
 * @param {Object} details - Any additional context or metadata (optional)
 */
const logActivity = async (req, action, resource, resourceId = null, details = {}) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Extract admin details from req.admin (set by auth middleware) or details object (e.g. on login)
        const adminId = req.admin ? req.admin.id : details.adminId;
        const adminEmail = req.admin ? req.admin.email || 'Unknown' : details.adminEmail || 'Unknown';

        await prisma.activityLog.create({
            data: {
                adminId: parseInt(adminId, 10),
                adminEmail,
                action,
                resource,
                resourceId: resourceId ? resourceId.toString() : null,
                details: details || {},
                ipAddress
            }
        });
    } catch (error) {
        console.error('Failed to save activity log:', error.message);
    }
};

module.exports = { logActivity };
