
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Add rule for pdf.js module worker to be treated as an asset
    // This is crucial for pdfjs-dist to correctly load its module worker
    if (!isServer) { // Only apply this rule on the client side
      config.module.rules.push({
        test: /pdf\.worker\.min\.mjs$/, // Target the .mjs module worker
        type: 'asset/resource',
        generator: {
          // Output to a predictable, non-hashed filename
          filename: 'static/chunks/pdf.worker.min.mjs',
        },
      });
    }
    return config;
  },
};

module.exports = nextConfig;
