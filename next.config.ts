import type { NextConfig } from 'next';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
const nextConfig: NextConfig = {
  /* config options here */

  // Turbopack configuration
  turbopack: {
    root: __dirname, // Set the correct workspace root
  },

  sassOptions: {
    includePaths: ['./src'],
    prependData: `@import "./src/app/styles/styles.less"`,
  },

  // Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['next/font'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
