import Link from "next/link";
import "../../styles/home.css";
import { BRAND } from "../site-config";

// TASK-019 iskeleti — ürün vitrini, topluluk tanıtımı ve güven şeridi TASK-020'de eklenecek.
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
    </div>
  );
}
