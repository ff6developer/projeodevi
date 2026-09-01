import { formatPrice } from "@/lib/format"
import styles from "./Price.module.css"

export function Price({
  value,
  original,
  className,
}: {
  /** Kuruş */
  value: number
  /** İndirim öncesi kuruş — verilirse üstü çizili gösterilir. */
  original?: number
  className?: string
}) {
  return (
    <span className={[styles.price, className ?? ""].filter(Boolean).join(" ")}>
      {formatPrice(value)}
      {original !== undefined && original > value && (
        <span className={styles.strike}>{formatPrice(original)}</span>
      )}
    </span>
  )
}
