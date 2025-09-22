module.exports = {
  reactStrictMode: false,
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