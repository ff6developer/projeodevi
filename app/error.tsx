"use client"

import { useEffect } from "react"
import { Button, ErrorState } from "@/components/ui"

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
      <ErrorState
        title="Bir şeyler ters gitti"
        description="Beklenmedik bir sorun oluştu. Tekrar denemek ister misin?"
        action={
          <div className="cluster">
            <Button onClick={reset}>Tekrar dene</Button>
            <Button href="/" variant="secondary">
              Ana sayfa
            </Button>
          </div>
        }
      />
    </div>
  )
}
