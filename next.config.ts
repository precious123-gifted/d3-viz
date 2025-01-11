import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, options) {
    const { isServer } = options;

    // Add rule for audio files
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit, // Inline small files as data URIs
            fallback: require.resolve("file-loader"), // Use file-loader for larger files
            publicPath: `${config.assetPrefix}/_next/static/media/`, // Path for public assets
            outputPath: `${isServer ? "../" : ""}static/media/`, // Output path for assets
            name: "[name]-[hash].[ext]", // Naming convention
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig; // Export Next.js configuration
