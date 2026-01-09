/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://2.img-dpreview.com/files/**")],
  },
  output: "standalone",
  experimental: {
    proxyClientMaxBodySize: "60MB",
    serverActions: {
      bodySizeLimit: "60MB",
    },
  },
};

export default nextConfig;
