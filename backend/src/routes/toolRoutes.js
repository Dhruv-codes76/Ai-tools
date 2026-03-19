const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const {
    getTools,
    getToolBySlug,
    createTool,
    updateTool,
    deactivateTool,
    restoreTool
} = require('../controllers/toolController');

const validate = require('../middleware/validate');
const { createToolSchema } = require('../validations/toolValidation');

router.get('/', getTools);
router.get('/:slug', getToolBySlug);

router.post('/', authMiddleware, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'twitterImage', maxCount: 1 }
]), validate(createToolSchema), createTool);
router.put('/:id', authMiddleware, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'twitterImage', maxCount: 1 }
]), updateTool);

router.delete('/:id', authMiddleware, deactivateTool);
router.put('/:id/restore', authMiddleware, restoreTool);

module.exports = router;
