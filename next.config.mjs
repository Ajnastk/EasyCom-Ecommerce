/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["res.cloudinary.com"], // Add your Cloudinary domain here
    // You can also use a more flexible pattern if needed:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '**',
    //   },
    // ],
  },
};

export default nextConfig;
