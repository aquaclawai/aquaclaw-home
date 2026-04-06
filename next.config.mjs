// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
  },
  // Bundle content/ files for filesystem fallback when Blob token is not yet configured.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
}

export default nextConfig
