import type { Metadata } from 'next';
import AdminPanelClient from './AdminPanelClient';

export const metadata: Metadata = {
  title: "Admin Paneli",
  description: "Yönetim paneli.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminPanelPage() {
  return <AdminPanelClient />;
}
