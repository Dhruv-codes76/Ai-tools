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

// CORS configuration
const rawOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ];

const allowedOrigins = new Set();
rawOrigins.forEach(origin => {
    let cleanOrigin = origin.trim().replace(/\/$/, ''); // Remove trailing slash
    allowedOrigins.add(cleanOrigin);

    // If it's a production domain without www., allow the www. version too
    if (cleanOrigin.startsWith('https://') && !cleanOrigin.startsWith('https://www.')) {
        allowedOrigins.add(cleanOrigin.replace('https://', 'https://www.'));
    } 
    // If it's a production domain WITH www., allow the bare version too
    else if (cleanOrigin.startsWith('https://www.')) {
        allowedOrigins.add(cleanOrigin.replace('https://www.', 'https://'));
    }
});

app.use(cors({
    origin: (origin, callback) => {
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps/postman)

        const requestOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.has(requestOrigin) || allowedOrigins.has('*');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}. Allowed origins are: ${Array.from(allowedOrigins).join(', ')}`);
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const newsRoutes = require('./routes/newsRoutes');
const toolRoutes = require('./routes/toolRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const searchRoutes = require('./routes/searchRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { optimizeSEO } = require('./controllers/seoController');


// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/logs', activityLogRoutes);
app.post('/api/seo/optimize', optimizeSEO);

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

const initCronJobs = require('./jobs/cronJobs');
initCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});