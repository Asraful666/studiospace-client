
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://studiospace-server-eta.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;