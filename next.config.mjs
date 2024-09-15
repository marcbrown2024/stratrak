/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/512/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/monitoringLogs',
        permanent: true, // Use true for a permanent redirect or false for a temporary redirect
      },
    ];
  },
};

export default nextConfig;
