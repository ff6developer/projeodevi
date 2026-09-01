export default function Loading() {
  return (
    <div className="route-state" role="status" aria-live="polite">
      <span className="route-state-spinner" aria-hidden="true" />
      <p>Yükleniyor…</p>
    </div>
  )
}
