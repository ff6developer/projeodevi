import type { Metadata } from "next"
import LegalDoc from "@/components/LegalDoc"

export const metadata: Metadata = {
  title: "İade ve Teslimat",
  description:
    "Elmenes Coffee teslimat süreleri, kargo ücretleri, iade ve değişim koşulları.",
  alternates: { canonical: "/iade-teslimat" },
}

export default function Page() {
  return (
    <LegalDoc
      title="İade ve Teslimat"
      updated="3 Eylül 2026"
      intro="Siparişinin sana ulaşması ve gerektiğinde iade sürecinin nasıl işlediği aşağıda özetlenmiştir."
      sections={[
        {
          heading: "Teslimat süresi",
          body: [
            "Standart teslimat 2–3 iş günü, hızlı teslimat 1 iş günü içinde gerçekleşir. Kahveler siparişin alındığında taze kavrulur; bu yüzden hazırlık süresi teslimat süresine dahildir.",
            "Resmi tatil ve yoğun dönemlerde süreler 1 iş günü uzayabilir.",
          ],
        },
        {
          heading: "Kargo ücreti",
          body: [
            "300 TL ve üzeri siparişlerde standart teslimat ücretsizdir. Alt tutarlarda standart teslimat 30 TL, hızlı teslimat 60 TL'dir.",
            "Kargo ücreti ödeme adımında, seçtiğin teslimat yöntemine göre net olarak gösterilir.",
          ],
        },
        {
          heading: "İade ve değişim",
          body: [
            "Gıda ürünlerinde hijyen gereği, ambalajı açılmamış ürünler teslimden itibaren 7 gün içinde iade edilebilir. Ambalajı açılmış kahveler, ayıplı olmadıkça iade alınmaz.",
            "Ayıplı, hasarlı ya da yanlış gönderilen ürünlerde kargo masrafı bize aittir; ürünü değiştirir veya ücretini iade ederiz.",
          ],
        },
        {
          heading: "İade nasıl başlatılır",
          body: [
            "Sipariş numaran ve iade nedeninle birlikte iletişim adresimize yazman yeterli. Onay sonrası ürünü anlaşmalı kargoyla göndermen için bir kod paylaşılır.",
            "İade tutarı, ürün bize ulaştıktan sonra 3–10 iş günü içinde ödeme yaptığın yönteme geri yansıtılır.",
          ],
        },
      ]}
    />
  )
}
