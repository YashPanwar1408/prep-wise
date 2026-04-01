import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  webpack: (config) => {
    // pdfjs-dist optionally requires 'canvas' for server-side rendering.
    // We don't need it (PDF extraction is client-side only), so alias it to
    // false to prevent "Module not found: Can't resolve 'canvas'" build errors.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
