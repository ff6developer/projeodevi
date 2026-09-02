import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/adminpanel",
        "/profil",
        "/giris",
        "/kayit",
        "/sepet",
        "/odeme",
        "/siparis",
        "/siparislerim",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
