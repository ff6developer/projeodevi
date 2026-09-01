import Link from "next/link"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import styles from "./Button.module.css"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "md" | "lg"

type CommonProps = {
  variant?: Variant
  size?: Size
  block?: boolean
  loading?: boolean
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined }

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    children,
    className,
    ...rest
  } = props

  const cls = [
    styles.button,
    styles[variant],
    styles[size],
    block ? styles.block : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </>
  )

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ComponentPropsWithoutRef<typeof Link>
    return (
      <Link href={href} className={cls} {...linkRest}>
        {content}
      </Link>
    )
  }

  const btnRest = rest as ComponentPropsWithoutRef<"button">
  return (
    <button
      className={cls}
      disabled={btnRest.disabled || loading}
      {...btnRest}
    >
      {content}
    </button>
  )
}
