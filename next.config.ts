import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow these libraries to run on the server
    serverComponentsExternalPackages: ["@imgly/background-removal-node", "@resvg/resvg-js"],
  },
  webpack: (config) => {
    // We don't need the canvas externals anymore
    return config;
  },
};

export default nextConfig;