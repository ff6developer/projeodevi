import type { ElementType, ReactNode } from "react"
import styles from "./Card.module.css"

type Pad = "none" | "sm" | "md" | "lg"

export type CardProps = {
  as?: ElementType
  pad?: Pad
  elevated?: boolean
  interactive?: boolean
  className?: string
  children: ReactNode
  [prop: string]: unknown
}

const padClass: Record<Pad, string> = {
  none: styles["pad-none"],
  sm: styles["pad-sm"],
  md: styles["pad-md"],
  lg: styles["pad-lg"],
}

export function Card({
  as,
  pad = "md",
  elevated = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const Comp = (as ?? "div") as ElementType
  const cls = [
    styles.card,
    padClass[pad],
    elevated ? styles.elevated : "",
    interactive ? styles.interactive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Comp className={cls} {...rest}>
      {children}
    </Comp>
  )
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className={styles.header}>{children}</div>
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className={styles.footer}>{children}</div>
}
