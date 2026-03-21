require('dotenv').config();
const dns = require('dns');
const https = require('https');
dns.setDefaultResultOrder('ipv4first');
https.globalAgent = new https.Agent({ family: 4 });
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.set('trust proxy', 1); // Trust first proxy for rate limiters backing onto Render/Nginx
app.use(morgan('dev')); // HTTP request logger
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const newsRoutes = require('./routes/newsRoutes');
const toolRoutes = require('./routes/toolRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const searchRoutes = require('./routes/searchRoutes');
const commentRoutes = require('./routes/commentRoutes');


// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/logs', activityLogRoutes);

// Initialize Prisma Connection
const prisma = require('./config/prisma');
prisma.$connect()
    .then(() => console.log('Prisma disconnected nicely... just kidding, Prisma PostgreSQL Connected!'))
    .catch(err => console.log('Prisma Connection Error:', err));

const errorHandler = require('./middleware/errorHandler');

// Fallback for 404 Routes
app.use((req, res, next) => {
    next(new (require('./utils/AppError'))(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});