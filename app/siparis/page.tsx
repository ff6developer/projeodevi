import type { Metadata } from 'next';
import SiparisClient from './SiparisClient';

export const metadata: Metadata = {
  title: "Siparişiniz Hazırlanıyor",
  description: "Siparişinizin durumunu görüntüleyin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SiparisPage() {
  return <SiparisClient />;
}
