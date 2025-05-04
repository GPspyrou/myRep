import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',    
      'lh3.googleusercontent.com',     
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',                   
      },
    ],
  },
};

export default nextConfig;
