import { Check } from "lucide-react"
import styles from "./Stepper.module.css"

export function Stepper({
  steps,
  current,
}: {
  steps: string[]
  /** 0-tabanlı aktif adım indeksi. */
  current: number
}) {
  return (
    <ol className={styles.stepper}>
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming"
        return (
          <li
            key={label}
            className={styles.step}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className={styles.marker} aria-hidden="true">
              {state === "done" ? <Check size={14} /> : i + 1}
            </span>
            <span className={styles.label}>{label}</span>
            {i < steps.length - 1 && <span className={styles.sep} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
