/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://2.img-dpreview.com/files/**")],
  },
};

export default nextConfig;
