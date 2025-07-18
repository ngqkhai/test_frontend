/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable compression for better performance
  compress: true,
  // Optimize for production
  poweredByHeader: false,
  async rewrites() {
    // Only enable API proxy in development
    if (process.env.NODE_ENV === 'development') {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      return [
        {
          source: '/api/:path*',
          destination: `${apiBaseUrl}/api/:path*`,
        },
      ];
    }
    
    // No rewrites in production - let the frontend handle missing API gracefully
    return [];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig
