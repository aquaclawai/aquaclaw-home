// lib/content/mdx.tsx
// Shared runtime MDX compiler for detail pages.
// Replaces build-time import(...mdx) with on-demand compilation from Blob content.
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

export async function renderMDX(source: string): Promise<React.ReactElement> {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
      },
    },
  })
  return content
}
