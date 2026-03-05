import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow images served from the local public directory
    localPatterns: [
      {
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
