/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Required because tokeninfo.js uses dynamic() and Canvas
  experimental: {
    esmExternals: false,
  },

  images: {
    unoptimized: true, // Important for static export + Firebase Hosting
  },

  // Ensure static export works cleanly
  output: "export",
};

module.exports = nextConfig;
