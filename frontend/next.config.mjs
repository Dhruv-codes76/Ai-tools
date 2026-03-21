/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', '@mui/icons-material', '@mui/material'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
