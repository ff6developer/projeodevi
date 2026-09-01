import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

// Herkese açık, indekslenmesi gereken sayfalar. Kullanıcıya özel sayfalar
// (giriş, kayıt, profil, sipariş, admin) kasıtlı olarak dışarıda.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/menu", "/kahveniolustur", "/topluluk", "/hakkimizda"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" || route === "/menu" ? 1 : 0.8,
  }));
}
