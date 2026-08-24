import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

// Sadece herkese açık, gerçekten indekslenmesi gereken sayfalar.
// "/" bir yönlendirme (redirect) sayfasıdır, kullanıcıya özel sayfalar
// (giriş, kayıt, profil, sipariş, admin paneli) kasıtlı olarak dışarıda
// bırakılmıştır.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/hakkimizda", "/menu", "/kahvearenasii", "/kahveniolustur"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "/menu" ? 1 : 0.8,
  }));
}
