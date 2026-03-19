const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

/**
 * Higher-order middleware to validate request data against a Zod schema.
 * NOTE: For multipart/form-data routes, this must be placed AFTER upload middleware.
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map((i) => `${i.path.slice(1).join('.')}: ${i.message}`).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

module.exports = validate;
