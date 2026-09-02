import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BRAND } from "@/app/site-config";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Keşfet",
    links: [
      { href: "/menu", label: "Menü" },
      { href: "/kahveniolustur", label: "Kahveni Oluştur" },
      { href: "/topluluk", label: "Topluluk" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iade-teslimat", label: "İade ve Teslimat" },
      { href: "/mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
      { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
      { href: "/gizlilik", label: "Gizlilik ve Çerezler" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <p className="footer-brand">{BRAND.name}</p>
          <p className="footer-tagline">{BRAND.tagline}</p>
          <div className="footer-contact">
            <a href={`mailto:${BRAND.email}`}>
              <Mail size={15} aria-hidden="true" /> {BRAND.email}
            </a>
            <span>
              <MapPin size={15} aria-hidden="true" /> {BRAND.address}
            </span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className="footer-col" aria-label={col.title}>
            <p className="footer-col-title">{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© {year} {BRAND.name}. Tüm hakları saklıdır.</p>
        {BRAND.isDemo && <p>Bu bir portföy / demo projesidir.</p>}
      </div>
    </footer>
  );
}
