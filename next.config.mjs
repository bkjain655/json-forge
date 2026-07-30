import { dirname } from "path"
import { fileURLToPath } from "url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Pin the trace root to this project; a stray lockfile above it would
  // otherwise make Next infer the parent directory as the workspace root.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default nextConfig
