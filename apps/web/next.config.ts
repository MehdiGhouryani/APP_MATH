import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@math/contracts',
    '@math/content-delivery',
  ],
  turbopack: {},
};

export default nextConfig;
