/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    emotion: true,
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
