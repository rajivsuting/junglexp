/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "plus.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
      {
        hostname: "www.manumaharaniresorts.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
