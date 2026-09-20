import type { NextConfig } from "next"

const basePath = process.env.GITHUB_PAGES === "true" ? "/Eyelid" : ""

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
