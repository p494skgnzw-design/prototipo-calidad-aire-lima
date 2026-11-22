import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El servidor escucha en 0.0.0.0; el navegador entra por 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
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
