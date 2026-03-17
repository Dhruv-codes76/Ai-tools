const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createComment, getComments, likeComment } = require('../controllers/commentController');

// Using memory store is okay for simple deployments, but let's make sure it utilizes trust proxy headers for uniqueness
const minuteLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 requests per windowMs
    keyGenerator: (req, res) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    },
    message: 'Too many comments created from this IP in the last minute, please try again after a minute'
});

const dailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20, // limit each IP to 20 requests per windowMs
    keyGenerator: (req, res) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    },
    message: 'Too many comments created from this IP today, please try again tomorrow'
});

router.post('/comment', minuteLimiter, dailyLimiter, createComment);
router.get('/comments', getComments);
router.post('/comment/like/:id', likeComment);

module.exports = router;
