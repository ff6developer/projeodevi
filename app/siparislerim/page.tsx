import type { Metadata } from "next"
import SiparislerimClient from "./SiparislerimClient"

export const metadata: Metadata = {
  title: "Siparişlerim",
  robots: { index: false, follow: false },
}

export default function SiparislerimPage() {
  return <SiparislerimClient />
}
