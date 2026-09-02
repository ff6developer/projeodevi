import { Button, EmptyState } from "@/components/ui"

export default function NotFound() {
  return (
    <div className="route-state">
      <EmptyState
        title="Bu sayfa bulunamadı"
        description="Aradığın sayfa taşınmış ya da hiç var olmamış olabilir."
        action={
          <div className="cluster">
            <Button href="/">Ana sayfa</Button>
            <Button href="/menu" variant="secondary">
              Menüye göz at
            </Button>
          </div>
        }
      />
    </div>
  )
}
