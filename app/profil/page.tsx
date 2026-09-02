import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';

export const metadata: Metadata = {
  title: "Profil",
  description: "Profilini yönet, tasarladığın kahveleri ve siparişlerini gör.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilPage() {
  return <ProfilClient />;
}
