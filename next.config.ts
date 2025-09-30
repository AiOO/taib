import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        graphql: './node_modules/graphql/index.js',
      },
    },
  },
};

export default nextConfig;
