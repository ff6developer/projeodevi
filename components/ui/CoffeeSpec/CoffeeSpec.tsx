import { MapPin } from "lucide-react"
import styles from "./CoffeeSpec.module.css"

const ROAST_LABEL = ["", "Açık", "Açık-Orta", "Orta", "Orta-Koyu", "Koyu"]

export function RoastMeter({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className={styles.roast} title={`Kavurma: ${ROAST_LABEL[level]}`}>
      <span className={styles.roastBars} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`${styles.roastBar}${i <= level ? " " + styles.on : ""}`}
            style={{ height: `${6 + i * 2}px` }}
          />
        ))}
      </span>
      {ROAST_LABEL[level]} kavurma
    </span>
  )
}

export function IntensityDots({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className={styles.dots} aria-label={`Yoğunluk ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`${styles.dot}${i <= value ? " " + styles.on : ""}`} />
      ))}
    </span>
  )
}

export function OriginTag({ origin }: { origin: string }) {
  return (
    <span className={styles.origin}>
      <MapPin size={12} aria-hidden="true" /> {origin}
    </span>
  )
}

export function TastingNotes({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <span className={styles.notes}>
      {notes.map((n) => (
        <span key={n} className={styles.note}>
          {n}
        </span>
      ))}
    </span>
  )
}
