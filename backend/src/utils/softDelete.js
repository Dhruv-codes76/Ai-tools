const { logActivity } = require('./logger');
const AppError = require('./AppError');

const softDelete = async (req, Model, id, res, next) => {
    const doc = await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    // If ID formatting is wrong, Mongoose throws CastError which is handled automatically.
    // If valid ID format but no doc found:
    if (!doc) return next(new AppError(`${Model.modelName} not found`, 404));

    await logActivity(req, 'DEACTIVATE', Model.modelName, doc._id);
    res.json({ message: `${Model.modelName} deactivated successfully`, data: doc });
};

const restore = async (req, Model, id, res, next) => {
    const doc = await Model.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!doc) return next(new AppError(`${Model.modelName} not found`, 404));

    await logActivity(req, 'RESTORE', Model.modelName, doc._id);
    res.json({ message: `${Model.modelName} restored successfully`, data: doc });
};

module.exports = { softDelete, restore };
