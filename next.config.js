/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js server mode for Vercel / Node.js full-stack hosting
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'BizBoost Pro',
  },
};

module.exports = nextConfig;
