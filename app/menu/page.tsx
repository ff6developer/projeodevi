import type { Metadata } from 'next';
import MenuClient from './MenuClient';

export const metadata: Metadata = {
  title: "Menü",
  description:
    "Elmenes Coffee menüsü: sıcak kahveler, soğuk kahveler ve tatlılar. Espresso, Latte, Cappuccino, Cold Brew ve daha fazlası.",
  alternates: {
    canonical: "/menu",
  },
};

export default function MenuPage() {
  return <MenuClient />;
}
