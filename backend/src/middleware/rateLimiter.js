const rateLimit = require('express-rate-limit');
const AppError = require('./AppError');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res, next, options) => {
        next(new AppError('Too many login attempts from this IP, please try again after 15 minutes', 429));
    }
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res, next, options) => {
        next(new AppError('Too many requests from this IP, please try again later', 429));
    }
});

module.exports = {
    loginLimiter,
    adminLimiter
};
