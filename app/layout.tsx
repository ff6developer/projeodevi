import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/layout.css";
import { ToastProvider } from "../components/ToastProvider";
import HeaderNav from "../components/HeaderNav";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./site-config";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
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
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <ToastProvider>
          <div className="layout">

            <HeaderNav />

            <main className="main">
              {children}
            </main>

            <footer className="footer" style={{
              marginTop: "40px",
              padding: "30px 20px",
              color: "white"
            }}>
              <div style={{
                maxWidth: "1000px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                textAlign: "center"
              }}>

                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                  ELMENES COFFEE
                </h2>

                <p style={{ opacity: 0.7 }}>
                  Özel kahve deneyimini dijital dünyaya taşıyoruz.
                </p>

                <nav style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }} aria-label="Alt bilgi bağlantıları">
                  <a href="/menu">Menü</a>
                  <a href="/hakkimizda">Hakkımızda</a>
                  <a href="/profil">Profil</a>
                  <a href="/kahveniolustur">Kahveni Oluştur</a>
                </nav>

                <div style={{
                  display: "flex",
                  gap: "15px"
                }}>
                  <span>📧 info@elmenes.com</span>
                  <span>📍 Türkiye</span>
                </div>

                <hr style={{ width: "100%", opacity: 0.1 }} />

                <p style={{ fontSize: "14px", opacity: 0.6 }}>
                  © 2026 ELMENES COFFEE. Tüm hakları saklıdır.
                </p>

              </div>
            </footer>

          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
