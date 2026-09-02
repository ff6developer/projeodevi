import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/typography.css";
import "@/styles/utilities.css";
import "@/styles/layout.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { CartProvider } from "@/components/CartProvider";
import HeaderNav from "@/components/HeaderNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./site-config";

// Display: karakterli modern serif (başlıklar, ürün adları, fiyatlar)
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

// Metin / UI: humanist sans, tam Türkçe desteği
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Veri: sipariş no, fiyat kolonları, origin/kavurma etiketleri
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // Görsel: app/opengraph-image.tsx (build sırasında üretilir)
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // --paper (koyu tema zemini) ile hizalı.
  themeColor: "#17140f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <ToastProvider>
          <ConfirmProvider>
          <CartProvider>
          <a href="#main" className="skip-link">İçeriğe geç</a>
          <div className="layout">

            <HeaderNav />

            <main id="main" className="main">
              {children}
            </main>

            <SiteFooter />

          </div>
          </CartProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
