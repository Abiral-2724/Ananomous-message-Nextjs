import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
    
  },
  env: {
    // Expose the MongoDB URI as an environment variable for server-side usage
    MONGODB_URI: process.env.MONGODB_URI || "",
  },
};

export default nextConfig;
