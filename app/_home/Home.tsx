import Link from "next/link"
import Image from "next/image"
import "@/styles/home.css"
import { BRAND } from "@/app/site-config"
import { Truck, Flame, Mail } from "lucide-react"
import { Button, Card, Price, RoastMeter, OriginTag } from "@/components/ui"

// Öne çıkan ürünler — TASK-107'de lib/products'a taşınacak.
const FEATURED = [
  { name: "Latte", priceKurus: 11000, image: "/latte.jpg", roast: 3 as const, origin: "Brezilya" },
  { name: "Filtre Kahve", priceKurus: 9500, image: "/Filtre.jpg", roast: 2 as const, origin: "Etiyopya" },
  { name: "Mocha", priceKurus: 9500, image: "/mocha.jpg", roast: 4 as const, origin: "Kolombiya" },
  { name: "Türk Kahvesi", priceKurus: 9500, image: "/türk kahvesi.jpg", roast: 5 as const, origin: "Harman" },
]

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero container container-narrow">
        <p className="eyebrow">{BRAND.tagline}</p>
        <h1 className="home-title">Günün kahvesi, senin seçtiğin gibi.</h1>
        <p className="home-lede">
          Nitelikli çekirdek, ustalıkla kavurma. Menüden hazır bir kahve seç ya da
          süt, çekirdek ve şuruba kadar her ayrıntıyı kendin tasarla.
        </p>
        <div className="cluster home-cta-row">
          <Button href="/menu" size="lg">
            Menüye göz at
          </Button>
          <Button href="/kahveniolustur" size="lg" variant="secondary">
            Kendi kahveni tasarla
          </Button>
        </div>
      </section>

      <section className="home-section container">
        <div className="home-section-head">
          <h2>Öne çıkanlar</h2>
          <Link href="/menu" className="home-section-link">
            Tüm menü
          </Link>
        </div>
        <div className="home-product-grid">
          {FEATURED.map((p) => (
            <Card key={p.name} as={Link} href="/menu" interactive pad="sm">
              <span className="home-product-image">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 260px" />
              </span>
              <span className="home-product-name">{p.name}</span>
              <span className="home-product-meta">
                <RoastMeter level={p.roast} />
                <OriginTag origin={p.origin} />
              </span>
              <Price value={p.priceKurus} className="home-product-price" />
            </Card>
          ))}
        </div>
      </section>

      <section className="home-section container home-split">
        <Card pad="lg">
          <h2>Kendi kahveni tasarla</h2>
          <p className="home-split-text">
            Süt tipi, çekirdek, köpük, şurup, baharat… Her seçim tarifini ve fiyatını
            anında güncelliyor. Beğendiğin tarifi sepete ekle.
          </p>
          <Button href="/kahveniolustur">Tasarlamaya başla</Button>
        </Card>
        <Card pad="lg">
          <h2>Topluluk seçkisi</h2>
          <p className="home-split-text">
            Tasarımını toplulukla paylaş, başkalarının tariflerini incele ve oy ver.
            Her ay öne çıkan tasarım ödül kazanır.
          </p>
          <Button href="/topluluk" variant="secondary">
            Seçkiye göz at
          </Button>
        </Card>
      </section>

      <section className="home-trust container">
        <div className="home-trust-item">
          <Truck size={20} aria-hidden="true" />
          <span>Aynı gün hazırlık, hızlı teslimat</span>
        </div>
        <div className="home-trust-item">
          <Flame size={20} aria-hidden="true" />
          <span>Siparişe göre taze kavurma</span>
        </div>
        <div className="home-trust-item">
          <Mail size={20} aria-hidden="true" />
          <span>{BRAND.email}</span>
        </div>
      </section>
    </div>
  )
}
