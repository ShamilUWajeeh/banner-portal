import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moved from experimental.serverComponentsExternalPackages (deprecated in Next.js 16)
  serverExternalPackages: ["@imgly/background-removal-node", "@resvg/resvg-js"],
  
  // Add empty turbopack config to silence the error
  turbopack: {},
};

export default nextConfig;