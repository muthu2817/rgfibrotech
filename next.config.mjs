/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',             
        destination: 'https://rgf-api.infantsurya.in/api/:path*', 
      },
    ];
  },
};

export default nextConfig;

