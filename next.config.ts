import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel'de `/_next/image` optimize ucu bu projedeki bazı görsellerde
    // (boşluk + Türkçe karakter içeren dosya adları: "türk kahvesi.jpg",
    // "ıceMocha.jpg" vb.) 404 / deploy hatası veriyor. Görseller doğrudan
    // /public'ten servis edilsin diye optimizasyon kapalı.
    // Kalıcı çözüm: bu dosyaları ASCII kebab-case'e taşıyıp optimizasyonu aç.
    unoptimized: true,
  },
};

export default nextConfig;
