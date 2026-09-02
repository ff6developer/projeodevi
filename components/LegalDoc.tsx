import "@/styles/legal.css"
import { Info } from "lucide-react"

export type LegalSection = { heading: string; body: string[] }

export default function LegalDoc({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro?: string
  sections: LegalSection[]
}) {
  return (
    <article className="legal container container-narrow">
      <p className="eyebrow">Kurumsal</p>
      <h1>{title}</h1>
      <p className="legal-updated">Son güncelleme: {updated}</p>

      <p className="legal-note" role="note">
        <Info size={16} aria-hidden="true" />
        <span>
          Elmenes Coffee bir portföy / demo projesidir. Aşağıdaki metin gerçek bir
          e-ticaret sitesinin belge yapısını örneklemek için hazırlanmıştır;
          bağlayıcı bir sözleşme veya hukuki metin değildir.
        </span>
      </p>

      {intro && <p className="legal-intro">{intro}</p>}

      {sections.map((s, i) => (
        <section key={i} className="legal-section">
          <h2>
            {i + 1}. {s.heading}
          </h2>
          {s.body.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  )
}
