import type { Metadata } from 'next';
import { Suspense } from 'react';
import SiparisClient from './SiparisClient';

export const metadata: Metadata = {
  title: "Sipariş Onayı",
  description: "Siparişinin özetini ve durumunu görüntüle.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SiparisPage() {
  return (
    <Suspense fallback={null}>
      <SiparisClient />
    </Suspense>
  );
}
