/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@algolens/ui",
    "@algolens/viz-engine",
    "@algolens/algorithms",
    "@algolens/exercises",
    "@algolens/pathways",
  ],
};

export default nextConfig;
