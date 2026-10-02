import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.run.app',
    '*.google.internal',
    'ais-dev-earr4fxq646ylstpfyzgeg-259545459339.europe-west2.run.app',
    'ais-pre-earr4fxq646ylstpfyzgeg-259545459339.europe-west2.run.app',
  ],
  transpilePackages: [
    '@math/contracts',
    '@math/content-delivery',
    '@math/learning-runtime',
    '@math/assignment-runtime',
    '@math/adult-projections',
    '@math/offline-sync',
    '@math/api-client',
  ],
  turbopack: {},
};

export default nextConfig;
