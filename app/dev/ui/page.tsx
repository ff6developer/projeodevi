import type { Metadata } from "next"
import DevUiClient from "./DevUiClient"

export const metadata: Metadata = {
  title: "UI Demo",
  robots: { index: false, follow: false },
}

export default function DevUiPage() {
  return <DevUiClient />
}
