import type { NextConfig } from "next";

// @ts-ignore
const nextConfig: NextConfig = {
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : 'standalone',
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
