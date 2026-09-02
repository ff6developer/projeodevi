"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "./ToastProvider"
import { Button, Card, Input, PasswordInput } from "./ui"
import { setUser, setAdmin } from "@/lib/session"

interface Field {
  id: string
  label: string
  type: string
  autoComplete: string
  placeholder: string
  required: boolean
  hint?: string
}

interface AuthFormProps {
  title: string
  subtitle: string
  fields: Field[]
  submitUrl: string
  submitMethod: "POST" | "GET"
  submitButtonText: string
  onSuccess: (data: unknown, formData: Record<string, string>) => void
  onError?: (data: { message?: string }) => string
  links: { text?: string; href: string; label: string; onClick?: () => void }[]
  adminCheck?: { email: string; password: string; redirect: string; message: string }
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitUrl,
  submitMethod,
  submitButtonText,
  onSuccess,
  onError,
  links,
  adminCheck,
}: AuthFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

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

    if (adminCheck && formData.email === adminCheck.email && formData.password === adminCheck.password) {
      setAdmin(true)
      toast.success(adminCheck.message)
      router.push(adminCheck.redirect)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(submitUrl, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(onError ? onError(data) : data.message || "Bir şeyler ters gitti, tekrar dener misin?")
        return
      }
      onSuccess(data, formData)
    } catch (err) {
      console.error("Bağlantı hatası:", err)
      toast.error("Şu an işlem tamamlanamadı. Lütfen birazdan tekrar dene.")
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

        <div className="login-links">
          {links.map((link, i) => (
            <p key={i} className="login-link-row">
              {link.text && <span>{link.text} </span>}
              {link.onClick ? (
                <button type="button" className="login-link" onClick={link.onClick}>
                  {link.label}
                </button>
              ) : (
                <Link href={link.href} className="login-link">
                  {link.label}
                </Link>
              )}
            </p>
          ))}
        </div>
      </Card>
    </div>
  )
}

export { setUser }
