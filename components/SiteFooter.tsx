import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BRAND } from "../app/site-config";

const FOOTER_LINKS = [
  { href: "/menu", label: "Menü" },
  { href: "/kahveniolustur", label: "Kahveni Oluştur" },
  { href: "/topluluk", label: "Kahve Arenası" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">{BRAND.name}</p>
        <p className="footer-tagline">{BRAND.tagline}</p>

        <nav className="footer-nav" aria-label="Alt bilgi bağlantıları">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="footer-contact">
          <span>
            <Mail size={15} aria-hidden="true" /> {BRAND.email}
          </span>
          <span>
            <MapPin size={15} aria-hidden="true" /> {BRAND.address}
          </span>
        </div>

        <hr className="footer-rule" />

        <p className="footer-copy">© {year} {BRAND.name}. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
