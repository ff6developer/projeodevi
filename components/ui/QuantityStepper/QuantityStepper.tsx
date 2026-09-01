"use client"

import { Minus, Plus } from "lucide-react"
import styles from "./QuantityStepper.module.css"

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  label = "Adet",
}: {
  value: number
  min?: number
  max?: number
  onChange: (next: number) => void
  label?: string
}) {
  const set = (n: number) => onChange(Math.max(min, Math.min(max, n)))
  return (
    <div className={styles.qty} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => set(value - 1)}
        disabled={value <= min}
        aria-label="Bir azalt"
      >
        <Minus size={16} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label="Bir artır"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
