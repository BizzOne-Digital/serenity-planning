/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add explicitly trusted external domains here only if needed, e.g.:
      // { protocol: 'https', hostname: 'images.example.com' }
    ],
  },
};

module.exports = nextConfig;
