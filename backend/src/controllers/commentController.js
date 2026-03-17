const xss = require('xss');
const prisma = require('../utils/prisma');
const { generateAnonymousId } = require('../utils/hashIp');
const AppError = require('../utils/AppError');

const BLACKLIST = ['casino', 'loan', 'crypto', 'adult', 'bet'];

const validateComment = (text) => {
    if (!text || text.length < 25) {
        throw new AppError('Comment must be at least 25 characters long.', 400);
    }
    if (text.length > 500) {
        throw new AppError('Comment must be no more than 500 characters long.', 400);
    }

    const lowerText = text.toLowerCase();
    for (const word of BLACKLIST) {
        if (lowerText.includes(word)) {
            throw new AppError('Comment contains prohibited words.', 400);
        }
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 2) {
        throw new AppError('Comment contains too many links (max 2 allowed).', 400);
    }

    return xss(text); // Sanitize XSS
};

const createComment = async (req, res, next) => {
    try {
        const { article_id, comment_text, parent_id, website } = req.body;

        // Honeypot check
        if (website) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const anonymous_id = generateAnonymousId(req);

        const safeText = validateComment(comment_text);

        const comment = await prisma.comment.create({
            data: {
                article_id,
                anonymous_id,
                comment_text: safeText,
                parent_id: parent_id || null,
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};

const getComments = async (req, res, next) => {
    try {
        const { article_id } = req.query;
        if (!article_id) {
            return res.status(400).json({ error: 'article_id is required' });
        }

        const comments = await prisma.comment.findMany({
            where: {
                article_id,
                is_hidden: false
            },
            orderBy: [
                { likes: 'desc' },
                { created_at: 'desc' }
            ]
        });

        // Build threaded structure
        const commentMap = {};
        const rootComments = [];

        comments.forEach(c => {
            commentMap[c.id] = { ...c, replies: [] };
        });

        comments.forEach(c => {
            if (c.parent_id && commentMap[c.parent_id]) {
                commentMap[c.parent_id].replies.push(commentMap[c.id]);
            } else {
                rootComments.push(commentMap[c.id]);
            }
        });

        res.json(rootComments);
    } catch (error) {
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedComment = await prisma.comment.update({
            where: { id },
            data: {
                likes: { increment: 1 }
            }
        });
        res.json(updatedComment);
    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getComments, likeComment };
