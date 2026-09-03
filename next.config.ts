import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Yerel görseller /public'ten geliyor; Vercel'in görsel optimizasyonu
    // (yeniden boyutlandırma + modern format) devrede. Uzak kaynak yok.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
