import type { Metadata } from "next"
import OdemeClient from "./OdemeClient"

export const metadata: Metadata = {
  title: "Ödeme",
  robots: { index: false, follow: false },
}

export default function OdemePage() {
  return <OdemeClient />
}
