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
        "/siparis",
        "/giris",
        "/kayit",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
