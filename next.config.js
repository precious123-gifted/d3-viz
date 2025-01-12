// next.config.js
module.exports = {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(mp3)$/,
        type: "asset/resource",
        generator: {
          filename: "static/chunks/[path][name].[hash][ext]",
        },
        eslint: {
            // Warning: This will disable ESLint in production.
            ignoreDuringBuilds: true 
          }
      });
  
      return config;
    },
  };