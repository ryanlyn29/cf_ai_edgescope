/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress hydration warnings in development
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787',
  },
};

module.exports = nextConfig;
