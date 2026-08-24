import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "ELMENES COFFEE hesabı oluşturun.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
