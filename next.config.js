/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    emotion: true,
  },
  experimental: {
    scrollRestoration: true,
    serverMinification: false,
    instrumentationHook: true,
  },
  async headers() {
    return [
      {
        // SharedArrayBufferを有効化するためのヘッダーを追加
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
