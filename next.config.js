// ./nextjs-pages/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
    // async redirects() {
    // return [
    //       {
    //     source: '/en/studio',
    //     destination: '/studio/desk',
    //     permanent: true,
    //   },
    //     {
    //     source: '/nl/studio',
    //     destination: '/studio/desk',
    //     permanent: true,
    //   }
    //   ]
    // },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
        },
      ],
    },
    // ...other config settings
  };
  
  module.exports = nextConfig;