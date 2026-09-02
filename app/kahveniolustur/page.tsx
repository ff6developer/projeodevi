import type { Metadata } from 'next';
import KahveniOlusturClient from './KahveniOlusturClient';

export const metadata: Metadata = {
  title: "Kahveni Oluştur",
  description:
    "Süt, çekirdek, şurup ve baharat seçimlerinle kendi kahveni tasarla, sepete ekle ve toplulukla paylaş.",
  alternates: {
    canonical: "/kahveniolustur",
  },
};

export default function KahveniOlusturPage() {
  return <KahveniOlusturClient />;
}
