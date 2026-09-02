import type { Metadata } from "next"
import SiparisDetayClient from "./SiparisDetayClient"

export const metadata: Metadata = {
  title: "Sipariş Takibi",
  robots: { index: false, follow: false },
}

export default function SiparisDetayPage() {
  return <SiparisDetayClient />
}
