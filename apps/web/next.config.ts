import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@math/contracts',
    '@math/content-delivery',
    '@math/learning-runtime',
    '@math/assignment-runtime',
    '@math/adult-projections',
    '@math/offline-sync',
  ],
};

export default nextConfig;
