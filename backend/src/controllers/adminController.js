const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');
const AppError = require('../utils/AppError');

// POST /api/admin/login
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        console.log(`[AUTH] Login attempt for: ${email} from IP: ${ip}`);

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            console.log(`[AUTH] Failed login (User not found): ${email} from IP: ${ip}`);
            return next(new AppError('Invalid credentials', 400));
        }

        if (admin.status === 'INACTIVE' || admin.isDeleted) {
            console.log(`[AUTH] Failed login (Inactive account): ${email} from IP: ${ip}`);
            return next(new AppError('Account has been deactivated. Contact super admin.', 403));
        }

        const validPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!validPassword) {
            console.log(`[AUTH] Failed login (Invalid password): ${email} from IP: ${ip}`);
            return next(new AppError('Invalid credentials', 400));
        }

        console.log(`[AUTH] Successful login: ${email} from IP: ${ip}`);
        // Log the successful login manually since req.admin isn't set yet
        await logActivity(req, 'LOGIN', 'Admin', admin.id, { adminId: admin.id, adminEmail: admin.email });

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, email: admin.email, status: admin.status });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/logout
const logoutAdmin = (req, res) => {
    res.json({ message: 'Logout successful. Please remove token from client storage.' });
};

// GET /api/admin (Protected)
const getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.admin.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                email: true,
                status: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(admins);
    } catch (error) {
        next(error);
    }
};

// POST /api/admin (Protected)
const createAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) return next(new AppError('Admin with this email already exists', 400));

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = await prisma.admin.create({
            data: {
                email,
                passwordHash,
                status: 'ACTIVE'
            }
        });

        await logActivity(req, 'CREATE', 'Admin', newAdmin.id, { createdEmail: newAdmin.email });

        res.status(201).json({ message: 'Admin created successfully', email: newAdmin.email, status: newAdmin.status });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/:id (Protected) - Soft Delete (Deactivate)
const deactivateAdmin = async (req, res, next) => {
    try {
        if (req.admin && req.admin.id === parseInt(req.params.id, 10)) {
            return next(new AppError('Cannot deactivate your own admin account', 403));
        }
        return softDelete(req, prisma.admin, 'Admin', req.params.id, res, next);
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/:id/restore (Protected) - Restore Admin
const restoreAdmin = async (req, res, next) => {
    return restore(req, prisma.admin, 'Admin', req.params.id, res, next);
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    getAdmins,
    createAdmin,
    deactivateAdmin,
    restoreAdmin
};
