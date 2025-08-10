/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://lh3.googleusercontent.com/**"),
      new URL("https://static.wixstatic.com/**"),
      new URL("https://a0.muscache.com/**"),
    ],
  },
};

export default nextConfig;
