/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.geojson$/,
      use: ["json-loader"],
    });

    return config;
  },
};

module.exports = nextConfig
