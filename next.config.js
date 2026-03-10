/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb'],
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig