import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel dağıtımında /_next/image optimize ucu 404 dönüyor; görseller
    // doğrudan /public'ten servis edilsin diye optimizasyonu kapatıyoruz.
    unoptimized: true,
  },
};

export default nextConfig;
