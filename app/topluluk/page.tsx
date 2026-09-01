import type { Metadata } from 'next';
import ToplulukClient from './ToplulukClient';

export const metadata: Metadata = {
  title: "Kahve Arenası",
  description:
    "Kendi kahveni tasarla, toplulukla paylaş, oy ver. Her ay öne çıkan tasarım ödül kazanır.",
  alternates: {
    canonical: "/topluluk",
  },
};

export default function ToplulukPage() {
  return <ToplulukClient />;
}
