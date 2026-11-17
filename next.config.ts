import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static site: deployable to any free static host.
  output: "export",
  trailingSlash: true,
  images: {
    // Images are pre-optimised to WebP by `npm run images`.
    unoptimized: true,
  },
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
