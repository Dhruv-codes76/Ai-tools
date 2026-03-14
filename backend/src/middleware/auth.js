const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        // Pass the error (which will be a JsonWebTokenError or TokenExpiredError) to the central error handler
        next(error);
    }
};

module.exports = { authMiddleware };
