import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Treat the frontend project folder as the workspace root so it properly
    // resolves local node_modules instead of jumping to the user's home folder.
    root: process.cwd(),
  },
  serverExternalPackages: [],
};

export default nextConfig;
