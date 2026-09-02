import type { Metadata } from "next"
import LegalDoc from "@/components/LegalDoc"

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Elmenes Coffee üzerinden verilen siparişlere ilişkin mesafeli satış sözleşmesi örneği.",
  alternates: { canonical: "/mesafeli-satis" },
}

export default function Page() {
  return (
    <LegalDoc
      title="Mesafeli Satış Sözleşmesi"
      updated="3 Eylül 2026"
      intro="Bu sözleşme, alıcı ile satıcı arasında elektronik ortamda kurulan satışın taraflarını, konusunu ve koşullarını düzenler."
      sections={[
        {
          heading: "Taraflar",
          body: [
            "SATICI: Elmenes Coffee (portföy/demo). İletişim: merhaba@elmenescoffee.com — İstanbul, Türkiye.",
            "ALICI: Siparişi veren, teslimat ve fatura bilgilerini beyan eden kişi.",
          ],
        },
        {
          heading: "Sözleşmenin konusu",
          body: [
            "Alıcının, satıcıya ait web sitesinden elektronik ortamda sipariş verdiği ürünün satışı ve teslimi ile ilgili tarafların hak ve yükümlülükleridir.",
            "Ürünün temel nitelikleri, satış fiyatı ve teslimat bilgileri sipariş özetinde ve ödeme adımında yer alır.",
          ],
        },
        {
          heading: "Ödeme ve teslimat",
          body: [
            "Bu demo ortamında gerçek ödeme alınmaz; kart bilgisi kaydedilmez ve hiçbir yere iletilmez. Gerçek bir kurulumda ödeme, siparişin onaylanmasıyla tahsil edilir.",
            "Teslimat, alıcının beyan ettiği adrese, seçilen teslimat yöntemine göre yapılır. Süreler İade ve Teslimat sayfasında belirtilmiştir.",
          ],
        },
        {
          heading: "Cayma hakkı",
          body: [
            "Alıcı, teslim tarihinden itibaren 14 gün içinde cayma hakkını kullanabilir. Gıda ürünlerinde ambalajı açılmış ürünler bu hakkın kapsamı dışındadır.",
            "Cayma bildirimi, sipariş numarasıyla birlikte iletişim adresine yapılır.",
          ],
        },
        {
          heading: "Uyuşmazlıklar",
          body: [
            "Taraflar arasındaki uyuşmazlıklarda, ilgili mevzuatın öngördüğü parasal sınırlar dahilinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",
          ],
        },
      ]}
    />
  )
}
