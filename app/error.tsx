"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="route-state">
      <h1>Bir şeyler ters gitti</h1>
      <p>Beklenmedik bir sorun oluştu. Tekrar denemek ister misin?</p>
      <div className="route-state-actions">
        <button type="button" onClick={reset} className="route-state-btn route-state-btn-primary">
          Tekrar dene
        </button>
        <Link href="/" className="route-state-btn">
          Ana sayfa
        </Link>
      </div>
    </div>
  )
}
