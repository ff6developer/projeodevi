import Link from "next/link";
import Image from "next/image";
import "../../styles/home.css";
import { BRAND } from "../site-config";
import { Truck, Flame, MessageCircle } from "lucide-react";

// Öne çıkan ürünler — TASK-107'de lib/products'a taşınacak.
const FEATURED = [
  { name: "Latte", priceKurus: 11000, image: "/latte.jpg" },
  { name: "Filtre Kahve", priceKurus: 9500, image: "/Filtre.jpg" },
  { name: "Mocha", priceKurus: 9500, image: "/mocha.jpg" },
  { name: "Türk Kahvesi", priceKurus: 9500, image: "/türk kahvesi.jpg" },
];

const fmtTRY = (kurus: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(
    kurus / 100,
  );

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-eyebrow">{BRAND.tagline}</p>
        <h1 className="home-title">Günün kahvesi, senin seçtiğin gibi.</h1>
        <p className="home-lede">
          Nitelikli çekirdek, ustalıkla kavurma. Menüden hazır bir kahve seç ya da
          süt, çekirdek ve şuruba kadar her ayrıntıyı kendin tasarla.
        </p>
        <div className="home-cta-row">
          <Link href="/menu" className="home-btn home-btn-primary">
            Menüye göz at
          </Link>
          <Link href="/kahveniolustur" className="home-btn">
            Kendi kahveni tasarla
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>Öne çıkanlar</h2>
          <Link href="/menu" className="home-section-link">
            Tüm menü
          </Link>
        </div>
        <div className="home-product-grid">
          {FEATURED.map((p) => (
            <Link href="/menu" key={p.name} className="home-product">
              <span className="home-product-image">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 260px" />
              </span>
              <span className="home-product-name">{p.name}</span>
              <span className="home-product-price">{fmtTRY(p.priceKurus)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-split">
        <div className="home-split-card">
          <h2>Kendi kahveni tasarla</h2>
          <p>
            Süt tipi, çekirdek, köpük, şurup, baharat… Her seçim tarifini ve fiyatını
            anında güncelliyor. Beğendiğin tarifi sepete ekle.
          </p>
          <Link href="/kahveniolustur" className="home-btn home-btn-primary">
            Tasarlamaya başla
          </Link>
        </div>
        <div className="home-split-card">
          <h2>Topluluk seçkisi</h2>
          <p>
            Tasarımını toplulukla paylaş, başkalarının tariflerini incele ve oy ver.
            Her ay öne çıkan tasarım ödül kazanır.
          </p>
          <Link href="/topluluk" className="home-btn">
            Seçkiye göz at
          </Link>
        </div>
      </section>

      <section className="home-trust">
        <div className="home-trust-item">
          <Truck size={20} aria-hidden="true" />
          <span>Aynı gün hazırlık, hızlı teslimat</span>
        </div>
        <div className="home-trust-item">
          <Flame size={20} aria-hidden="true" />
          <span>Siparişe göre taze kavurma</span>
        </div>
        <div className="home-trust-item">
          <MessageCircle size={20} aria-hidden="true" />
          <span>{BRAND.email}</span>
        </div>
      </section>
    </div>
  );
}
