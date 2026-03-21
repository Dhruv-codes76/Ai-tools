const fs = require('fs');
const file = 'frontend/next.config.mjs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('compress: true,', `compress: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', '@mui/icons-material', '@mui/material'],
    },`);

fs.writeFileSync(file, content);
