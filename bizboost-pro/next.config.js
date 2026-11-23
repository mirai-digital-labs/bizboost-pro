/** @type {import('next').NextConfig} */

// Clean up empty string env vars so they never cause URL parsing exceptions
['NEXTAUTH_URL', 'NEXT_PUBLIC_APP_URL', 'DATABASE_URL', 'GEMINI_API_KEY'].forEach((key) => {
  if (process.env[key] !== undefined && process.env[key].trim() === '') {
    delete process.env[key];
  }
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'BizBoost Pro',
  },
};

module.exports = nextConfig;
