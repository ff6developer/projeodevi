import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

// Herkese açık, indekslenmesi gereken sayfalar. Kullanıcıya özel sayfalar
// (giriş, kayıt, profil, sepet, ödeme, sipariş, admin) kasıtlı olarak dışarıda.
// Ürün sayfaları (/menu/[slug]) ve yasal sayfalar sonraki tasklarda eklenecek.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE_URL}/menu`, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE_URL}/kahveniolustur`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE_URL}/topluluk`, priority: 0.6, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE_URL}/hakkimizda`, priority: 0.5, changeFrequency: "yearly", lastModified: now },
  ];
}
