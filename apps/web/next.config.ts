import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@mentor-esgi/sdk", "@nestia/fetcher"],
};

export default nextConfig;
