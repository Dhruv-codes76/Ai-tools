const prisma = require('../prisma');
const xss = require('xss');
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

    return xss(text); 
};

const createComment = async (req, res, next) => {
    try {
        const { article_id, comment_text, parent_id, website } = req.body;

        if (website) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const anonymous_id = generateAnonymousId(req);
        const safeText = validateComment(comment_text);

        const comment = await prisma.comment.create({
            data: {
                articleId: article_id,
                anonymousId: anonymous_id,
                commentText: safeText,
                parentId: parent_id || null,
            }
        });

        // The frontend expects the comment to have snake_case properties
        res.status(201).json({
            id: comment.id,
            article_id: comment.articleId,
            anonymous_id: comment.anonymousId,
            comment_text: comment.commentText,
            parent_id: comment.parentId,
            likes: comment.likes,
            is_hidden: comment.isHidden,
            created_at: comment.createdAt
        });
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

        const prismaComments = await prisma.comment.findMany({
            where: {
                articleId: article_id,
                isHidden: false
            },
            orderBy: [
                { likes: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        // Map to frontend-expected formats
        const comments = prismaComments.map(c => ({
            id: c.id.toString(),
            article_id: c.articleId,
            anonymous_id: c.anonymousId,
            comment_text: c.commentText,
            parent_id: c.parentId,
            likes: c.likes,
            is_hidden: c.isHidden,
            created_at: c.createdAt
        }));

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
            where: { id: parseInt(id, 10) },
            data: { likes: { increment: 1 } }
        });
        
        res.json({
            id: updatedComment.id.toString(),
            article_id: updatedComment.articleId,
            anonymous_id: updatedComment.anonymousId,
            comment_text: updatedComment.commentText,
            parent_id: updatedComment.parentId,
            likes: updatedComment.likes,
            is_hidden: updatedComment.isHidden,
            created_at: updatedComment.createdAt
        });
    } catch (error) {
        if (error.code === 'P2025') return next(new AppError('Comment not found', 404));
        next(error);
    }
};

module.exports = { createComment, getComments, likeComment };
