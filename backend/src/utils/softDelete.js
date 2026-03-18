const { logActivity } = require('./logger');
const AppError = require('./AppError');

const softDelete = async (req, prismaModel, modelName, id, res, next) => {
    try {
        const doc = await prismaModel.update({
            where: { id: parseInt(id, 10) },
            data: { isDeleted: true }
        });
        await logActivity(req, 'DEACTIVATE', modelName, doc.id.toString());
        res.json({ message: `${modelName} deactivated successfully`, data: doc });
    } catch (err) {
        if (err.code === 'P2025') {
            return next(new AppError(`${modelName} not found`, 404));
        }
        return next(err);
    }
};

const restore = async (req, prismaModel, modelName, id, res, next) => {
    try {
        const doc = await prismaModel.update({
            where: { id: parseInt(id, 10) },
            data: { isDeleted: false }
        });
        await logActivity(req, 'RESTORE', modelName, doc.id.toString());
        res.json({ message: `${modelName} restored successfully`, data: doc });
    } catch (err) {
        if (err.code === 'P2025') {
            return next(new AppError(`${modelName} not found`, 404));
        }
        return next(err);
    }
};

module.exports = { softDelete, restore };
