import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moved from experimental.serverComponentsExternalPackages (deprecated in Next.js 16)
  serverExternalPackages: ["canvas", "@imgly/background-removal-node", "@resvg/resvg-js", "sharp"],

  // Add empty turbopack config to silence the error
  turbopack: {},

  // Output standalone for better Netlify compatibility
  output: "standalone",
};

export default nextConfig;