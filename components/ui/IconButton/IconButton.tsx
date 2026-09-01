import type { ComponentPropsWithoutRef, ReactNode } from "react"
import styles from "./IconButton.module.css"

export type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "aria-label"> & {
  /** Zorunlu — ekran okuyucu için. */
  label: string
  icon: ReactNode
  size?: "sm" | "md"
  tone?: "default" | "danger"
}

export function IconButton({
  label,
  icon,
  size = "md",
  tone = "default",
  className,
  ...rest
}: IconButtonProps) {
  const cls = [
    styles.iconButton,
    styles[size],
    tone === "danger" ? styles.danger : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button type="button" className={cls} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  )
}
