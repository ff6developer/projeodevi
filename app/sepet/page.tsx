import type { Metadata } from "next"
import SepetClient from "./SepetClient"

export const metadata: Metadata = {
  title: "Sepet",
  robots: { index: false, follow: false },
}

export default function SepetPage() {
  return <SepetClient />
}
