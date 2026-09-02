import type { Metadata } from "next"
import LegalDoc from "@/components/LegalDoc"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Elmenes Coffee kişisel verilerin işlenmesine ilişkin aydınlatma metni örneği.",
  alternates: { canonical: "/kvkk" },
}

export default function Page() {
  return (
    <LegalDoc
      title="KVKK Aydınlatma Metni"
      updated="3 Eylül 2026"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, verilerinin hangi amaçla işlendiği aşağıda açıklanmıştır."
      sections={[
        {
          heading: "İşlenen veriler",
          body: [
            "Kimlik ve iletişim bilgileri (ad soyad, e-posta, telefon), teslimat adresi, sipariş geçmişi ve site kullanım kayıtları.",
            "Ödeme kartı bilgileri bu demo ortamında hiçbir şekilde toplanmaz veya saklanmaz.",
          ],
        },
        {
          heading: "İşleme amaçları",
          body: [
            "Siparişin oluşturulması, hazırlanması ve teslimi; müşteri hizmetleri; yasal yükümlülüklerin yerine getirilmesi.",
            "Açık rızan olması halinde, kampanya ve bilgilendirme iletileri gönderilmesi.",
          ],
        },
        {
          heading: "Saklama ve aktarım",
          body: [
            "Veriler, işleme amacının gerektirdiği ve mevzuatın öngördüğü süre boyunca saklanır; süre sonunda silinir veya anonim hale getirilir.",
            "Veriler yalnızca kargo ve ödeme altyapısı gibi hizmetin gerektirdiği taraflarla, gerekli olduğu ölçüde paylaşılır.",
          ],
        },
        {
          heading: "Haklarınız",
          body: [
            "Verilerine erişme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve zararın giderilmesini talep etme hakların vardır.",
            "Taleplerini merhaba@elmenescoffee.com adresine iletebilirsin.",
          ],
        },
      ]}
    />
  )
}
