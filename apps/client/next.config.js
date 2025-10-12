/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // Disable static optimization to prevent build-time data fetching
    // staticGenerationRetryCount: 0,
  },
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://lh3.googleusercontent.com/**"),
      new URL("https://static.wixstatic.com/**"),
      new URL("https://a0.muscache.com/**"),
      new URL("https://storage.googleapis.com/etrouper-image-bucket/**"),
      new URL("https://ik.imagekit.io/**"),
    ],
  },
};

export default nextConfig;
