module.exports = {
  reactStrictMode: false,

    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
        },
        {
          protocol: 'https',
          hostname: 'drive.google.com',
        },
      ],
    },
    publicRuntimeConfig: {
      apiUrl: process.env.API_URL,
    },
  };