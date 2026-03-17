const crypto = require('crypto');

const generateAnonymousId = (req) => {
    // Get true client IP from proxy headers, fallback to socket
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const hash = crypto.createHash('sha256');
    hash.update(`${ip}-${userAgent}`);
    return hash.digest('hex').substring(0, 8).toUpperCase();
};

module.exports = { generateAnonymousId };
