/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ← هذا هو التعديل الأساسي
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
