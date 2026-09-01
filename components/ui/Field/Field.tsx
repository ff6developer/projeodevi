"use client"

import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import { Eye, EyeOff } from "lucide-react"
import styles from "./Field.module.css"

type FieldShellProps = {
  label: string
  hint?: string
  error?: string
  htmlFor: string
  children: ReactNode
}

function FieldShell({ label, hint, error, htmlFor, children }: FieldShellProps) {
  const hintId = `${htmlFor}-hint`
  const errId = `${htmlFor}-err`
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className={styles.error} id={errId} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

type BaseProps = { label: string; hint?: string; error?: string }

export function Input({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"input">) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
      <input
        id={fieldId}
        className={[styles.control, className ?? ""].filter(Boolean).join(" ")}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

export function PasswordInput({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: BaseProps & Omit<ComponentPropsWithoutRef<"input">, "type">) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const [visible, setVisible] = useState(false)
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
      <span className={styles.passwordWrap}>
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={[styles.control, className ?? ""].filter(Boolean).join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined}
          {...rest}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </FieldShell>
  )
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"textarea">) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        className={[styles.control, className ?? ""].filter(Boolean).join(" ")}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

export function Select({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"select">) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId}>
      <select
        id={fieldId}
        className={[styles.control, className ?? ""].filter(Boolean).join(" ")}
        aria-invalid={error ? "true" : undefined}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  )
}
