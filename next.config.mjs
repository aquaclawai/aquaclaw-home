// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
  },
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-pretty-code'],
  },
})

export default withMDX(nextConfig)
