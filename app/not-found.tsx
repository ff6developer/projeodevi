import Link from "next/link"

export default function NotFound() {
  return (
    <div className="route-state">
      <h1>Bu sayfa bulunamadı</h1>
      <p>Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <div className="route-state-actions">
        <Link href="/" className="route-state-btn route-state-btn-primary">
          Ana sayfa
        </Link>
        <Link href="/menu" className="route-state-btn">
          Menüye göz at
        </Link>
      </div>
    </div>
  )
}
