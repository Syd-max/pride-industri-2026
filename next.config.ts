import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.prideindustri.web.id' }],
        destination: 'https://prideindustri.web.id/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pride-industri-2026.vercel.app' }],
        destination: 'https://prideindustri.web.id/:path*',
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  serverExternalPackages: ['sharp'],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
