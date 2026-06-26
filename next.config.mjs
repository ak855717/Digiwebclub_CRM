/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://digiwebclub-crm-backend.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
