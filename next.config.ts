import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export" as const,
        basePath: "/prototipo-calidad-aire-lima",
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: pages ? "/prototipo-calidad-aire-lima" : "",
  },
  images: { unoptimized: true },
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
