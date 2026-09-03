import type { Metadata } from "next";
import "@/styles/hakkimizda.css";
import { Card } from "@/components/ui";
import { BRAND } from "@/app/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Elmenes Coffee; tek origin ve harman çekirdekleri küçük partiler hâlinde kavuran, siparişe göre taze hazırlayıp kapıya gönderen bir kahve dükkânı.",
  alternates: { canonical: "/hakkimizda" },
};

const VALUES = [
  {
    title: "Nitelikli çekirdek",
    body: "Etiyopya, Kolombiya ve Brezilya'nın seçkin bölgelerinden, izlenebilir tek origin ve harman çekirdekleriyle çalışıyoruz.",
  },
  {
    title: "Küçük parti kavurma",
    body: "Her partiyi elde takip ediyoruz; çekirdeğin karakterini öne çıkaran, günlük içim için dengeli profiller hedefliyoruz.",
  },
  {
    title: "Taze teslim",
    body: "Kahveni siparişinden hemen sonra hazırlıyor, aynı gün yola çıkarıyoruz. Amaç, en taze haliyle fincanına ulaşması.",
  },
  {
    title: "Sade deneyim",
    body: "Menüden hazır bir seçim ya da adım adım kendi tarifin. Karmaşa yok; sadece iyi kahve ve net bir yol.",
  },
];

export default function About() {
  return (
    <section className="about container">
      <header className="about-head">
        <p className="eyebrow">Hikâyemiz</p>
        <h1>Hakkımızda</h1>
        <p className="about-lede">
          {BRAND.name}, İstanbul&apos;da küçük partiler hâlinde kahve kavuran bir dükkân.
          Menüde hazır seçenekler var; istersen sütü, çekirdeği ve şurubu kendin ayarlayıp
          kendi tarifini kuruyorsun. Her sipariş verildikten sonra taze hazırlanır.
        </p>
      </header>

      <p className="about-demo-note" role="note">
        Elmenes Coffee bir portföy / demo projesidir. Sipariş, ödeme ve teslimat akışları
        gerçek değildir.
      </p>

      <div className="about-media" aria-hidden="true">
        <span className="about-media-block">{BRAND.shortName}</span>
        <span className="about-media-block about-media-block--alt">Kavurma</span>
      </div>

      <div className="about-body">
        <p>
          Bizim için kahve; doğru öğütme, ideal su sıcaklığı ve sabırlı bir demlemeyle
          ortaya çıkan bir zanaat. Menüdeki her içecek bu özenle hazırlanıyor; kendi
          kahveni tasarladığında da aynı çekirdekler ve aynı standart geçerli.
        </p>
        <p className="about-tagline">{`“${BRAND.tagline}”`}</p>
      </div>

      <div className="about-values">
        {VALUES.map((v) => (
          <Card key={v.title} pad="md">
            <h2>{v.title}</h2>
            <p>{v.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
