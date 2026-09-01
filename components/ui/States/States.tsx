import type { ReactNode } from "react"
import styles from "./States.module.css"

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className={styles.state}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.desc}>{label}</p>
    </div>
  )
}

export function ErrorState({
  title = "Bir şeyler ters gitti",
  description = "Beklenmedik bir sorun oluştu.",
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className={styles.state}>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
