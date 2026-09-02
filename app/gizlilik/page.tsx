import type { Metadata } from "next"
import LegalDoc from "@/components/LegalDoc"

export const metadata: Metadata = {
  title: "Gizlilik ve Çerezler",
  description:
    "Elmenes Coffee gizlilik ilkeleri ve çerez kullanımı hakkında bilgilendirme örneği.",
  alternates: { canonical: "/gizlilik" },
}

export default function Page() {
  return (
    <LegalDoc
      title="Gizlilik ve Çerezler"
      updated="3 Eylül 2026"
      intro="Bu sayfa, bilgilerinin nasıl kullanıldığını ve sitede hangi çerezlerin çalıştığını özetler."
      sections={[
        {
          heading: "Toplanan bilgiler",
          body: [
            "Hesap ve sipariş için verdiğin bilgiler; siteyi kullanırken oluşan teknik kayıtlar (tarayıcı, cihaz türü, ziyaret edilen sayfalar).",
            "Bu demo sürümünde hesap, sepet ve sipariş verileri yalnızca senin tarayıcının yerel depolamasında tutulur; bir sunucuya gönderilmez.",
          ],
        },
        {
          heading: "Çerezler",
          body: [
            "Zorunlu çerezler oturumun ve sepetin çalışması için gereklidir. Ölçüm veya reklam çerezi kullanılmaz.",
            "Tarayıcı ayarlarından çerezleri temizleyebilir veya engelleyebilirsin; bu durumda sepet ve oturum sıfırlanır.",
          ],
        },
        {
          heading: "Üçüncü taraflar",
          body: [
            "Gerçek bir kurulumda ödeme ve kargo hizmetleri için harici sağlayıcılar kullanılır ve yalnızca hizmetin gerektirdiği veriler paylaşılır. Bu demo sürümünde harici bir servise veri aktarımı yapılmaz.",
          ],
        },
        {
          heading: "İletişim",
          body: [
            "Gizlilikle ilgili sorularını merhaba@elmenescoffee.com adresine iletebilirsin.",
          ],
        },
      ]}
    />
  )
}
