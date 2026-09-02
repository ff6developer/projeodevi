"use client"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "./ToastProvider"
import { Button, Card, Input, PasswordInput } from "./ui"

interface Field {
  id: string
  label: string
  type: string
  autoComplete: string
  placeholder: string
  required: boolean
  hint?: string
}

export type AuthSubmitResult = {
  ok: boolean
  /** Genel hata — toast ile gösterilir. */
  error?: string
  /** Alan bazlı hata — ilgili input altında gösterilir (`error.code`). */
  field?: string
}

interface AuthFormProps {
  title: string
  subtitle: string
  fields: Field[]
  submitButtonText: string
  /** Formu işleyen fonksiyon. Başarıda yönlendirmeyi kendisi yapar. */
  onSubmit: (formData: Record<string, string>) => Promise<AuthSubmitResult>
  links: { text?: string; href: string; label: string }[]
  /** Portföy kolaylığı: tek tıkla demo hesabıyla gir. */
  onDemo?: () => Promise<void>
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitButtonText,
  onSubmit,
  links,
  onDemo,
}: AuthFormProps) {
  const toast = useToast()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const setField = (id: string, value: string) => {
    setFormData((p) => ({ ...p, [id]: value }))
    if (errors[id]) setErrors((p) => ({ ...p, [id]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const next: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && !String(formData[f.id] ?? "").trim()) {
        next[f.id] = `${f.label} zorunludur.`
      }
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const res = await onSubmit(formData)
      if (!res.ok) {
        if (res.field) setErrors({ [res.field]: res.error ?? "Geçersiz." })
        else toast.error(res.error ?? "Bir şeyler ters gitti, tekrar dener misin?")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container container container-narrow">
      <Card pad="lg" elevated className="login-card">
        <h1 className="login-title">{title}</h1>
        <p className="login-sub">{subtitle}</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {fields.map((f) =>
            f.type === "password" ? (
              <PasswordInput
                key={f.id}
                label={f.label}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                hint={f.hint}
                error={errors[f.id]}
                value={formData[f.id] ?? ""}
                onChange={(e) => setField(f.id, e.target.value)}
              />
            ) : (
              <Input
                key={f.id}
                label={f.label}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                hint={f.hint}
                error={errors[f.id]}
                value={formData[f.id] ?? ""}
                onChange={(e) => setField(f.id, e.target.value)}
              />
            ),
          )}

          <Button type="submit" block size="lg" loading={submitting}>
            {submitButtonText}
          </Button>
        </form>

        {onDemo && (
          <>
            <p className="login-divider"><span>ya da</span></p>
            <Button
              type="button"
              variant="secondary"
              block
              size="lg"
              loading={demoLoading}
              onClick={async () => {
                setDemoLoading(true)
                try {
                  await onDemo()
                } finally {
                  setDemoLoading(false)
                }
              }}
            >
              Demo hesabıyla dene
            </Button>
            <p className="login-demo-note">
              Bu bir portföy projesidir; hesaplar yalnızca bu tarayıcıda tutulur.
            </p>
          </>
        )}

        <div className="login-links">
          {links.map((link, i) => (
            <p key={i} className="login-link-row">
              {link.text && <span>{link.text} </span>}
              <Link href={link.href} className="login-link">
                {link.label}
              </Link>
            </p>
          ))}
        </div>
      </Card>
    </div>
  )
}
