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
      domains: ['utfs.io'],
    },
    publicRuntimeConfig: {
      apiUrl: process.env.API_URL,
    },
  };