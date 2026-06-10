/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add any external image domains here if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true, // Schakel optimalisatie uit (essentieel voor Raspberry Pi prestaties/stabiliteit)
  },
  allowedDevOrigins: ['192.168.50.5', 'localhost'],
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'Media/**/*',
        'public/images/**/*',
        'public/videos/**/*'
      ],
    },
  },
  // Note: For App Router, body size limits are handled in route handlers
  // The upload route already handles 50MB files via FormData
  
  // Production optimizations
  // output: 'standalone', // Uitgecommentarieerd - gebruik 'next start' in plaats van standalone
  compress: true, // Gzip compressie
  poweredByHeader: false, // Verberg X-Powered-By header voor security
};

module.exports = nextConfig;

