import type { Metadata } from 'next';
import KahveArenasiClient from './KahveArenasiClient';

export const metadata: Metadata = {
  title: "Kahve Arenası",
  description:
    "Kahveni oluştur, Kahve Arenası'nda paylaş, oy topla ve şampiyonlar ligine katıl. Her ay en çok oy alan tasarım ödül kazanır.",
  alternates: {
    canonical: "/kahvearenasii",
  },
};

export default function KahveArenasiPage() {
  return <KahveArenasiClient />;
}
