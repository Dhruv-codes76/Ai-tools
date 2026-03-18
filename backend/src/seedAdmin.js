require('dotenv').config();
const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    console.log('Starting seed process...');
    console.log('Has DATABASE_URL from env:', !!process.env.DATABASE_URL);
    try {
        console.log('Connecting to PostgreSQL...');
        await prisma.$connect();
        console.log('Connected to Database');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        // Upsert admin (creates if missing, updates password/status if existing)
        await prisma.admin.upsert({
            where: { email: 'admin@example.com' },
            update: {
                passwordHash,
                status: 'ACTIVE'
            },
            create: {
                email: 'admin@example.com',
                passwordHash,
                status: 'ACTIVE'
            }
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
