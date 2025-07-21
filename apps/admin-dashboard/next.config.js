/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bubblechat/ui', '@bubblechat/database', '@bubblechat/document-processing'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig