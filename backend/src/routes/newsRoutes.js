const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const {
    getNews,
    getNewsBySlug,
    createNews,
    updateNews,
    deactivateNews,
    restoreNews
} = require('../controllers/newsController');

const validate = require('../middleware/validate');
const { createNewsSchema } = require('../validations/newsValidation');

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);

router.post('/', authMiddleware, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'twitterImage', maxCount: 1 }
]), validate(createNewsSchema), createNews);
router.put('/:id', authMiddleware, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'twitterImage', maxCount: 1 }
]), updateNews);

router.delete('/:id', authMiddleware, deactivateNews);
router.put('/:id/restore', authMiddleware, restoreNews);

module.exports = router;
