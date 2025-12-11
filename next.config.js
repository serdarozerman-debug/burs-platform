/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false, path: false };
    
    // Disable source maps in development
    if (dev) {
      config.devtool = false;
    }
    
    return config;
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable CSS source maps
  sassOptions: {
    sourceMap: false,
  },
  // Headers for security and CSP (only for HTML pages, not API routes)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
              "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
              "frame-src 'self' https://*.supabase.co",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig