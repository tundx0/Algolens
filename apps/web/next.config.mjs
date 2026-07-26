/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@algolens/ui",
    "@algolens/viz-engine",
    "@algolens/algorithms",
    "@algolens/exercises",
  ],
};

export default nextConfig;
