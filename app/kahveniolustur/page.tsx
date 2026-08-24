import type { Metadata } from 'next';
import KahveniOlusturClient from './KahveniOlusturClient';

export const metadata: Metadata = {
  title: "Kahveni Oluştur",
  description:
    "Süt, çekirdek, şurup ve baharat seçimlerinle kendi özel kahveni tasarla. Yaratıcılık puanını artır ve Kahve Arenası'nda paylaşmaya hazır ol.",
  alternates: {
    canonical: "/kahveniolustur",
  },
};

export default function KahveniOlusturPage() {
  return <KahveniOlusturClient />;
}
