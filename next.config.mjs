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
  // Permanent redirects for old URLs that changed, so external links and
  // Google's index resolve to the current page instead of 404ing.
  // /about-us was renamed to /about in the July 2026 SEO pass.
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
    ]
  },
}

export default nextConfig
