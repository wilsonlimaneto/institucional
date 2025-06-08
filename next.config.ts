
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
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // This line is often added to help with pdf.js worker issues in Next.js
    // by ensuring that the worker file is treated as an asset.
    // However, for the simplest approach of setting GlobalWorkerOptions.workerSrc,
    // this might not be necessary if the file is in public/ or served from a CDN.
    // If issues persist, uncommenting and adjusting this might be needed.
    // config.module.rules.push({
    //   test: /pdf\.worker\.(min\.)?js/,
    //   type: 'asset/resource',
    //   generator: {
    //     filename: 'static/chunks/[name].[hash][ext]',
    //   },
    // });
    return config;
  },
};

module.exports = nextConfig;
