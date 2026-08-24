import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';

export const metadata: Metadata = {
  title: "Profil",
  description: "Profilini yönet, kahvelerini gör ve Kahve Arenası'nda paylaş.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilPage() {
  return <ProfilClient />;
}
