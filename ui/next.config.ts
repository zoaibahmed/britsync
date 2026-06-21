import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/main',
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/news-images/:path*',
        destination: '/main/news-images/:path*',
        permanent: true,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
