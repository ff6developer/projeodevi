"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "./ToastProvider"

interface Field {
  id: string
  label: string
  type: string
  autoComplete: string
  placeholder: string
  required: boolean
}

interface AuthFormProps {
  title: string
  subtitle: string
  fields: Field[]
  submitUrl: string
  submitMethod: "POST" | "GET"
  submitButtonText: string
  onSuccess: (data: any, formData: Record<string, string>) => void
  onError?: (data: any) => string
  links: {
    text?: string
    href: string
    label: string
    isExternal?: boolean
    onClick?: () => void
  }[]
  adminCheck?: {
    email: string
    password: string
    redirect: string
    alertMessage: string
    storageKey: string
    storageValue: string
  }
  noValidate?: boolean
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
  noValidate = false
}: AuthFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [blur, setBlur] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors: Record<string, string> = {}
    for (const field of fields) {
      if (field.required && !String(formData[field.id] ?? "").trim()) {
        nextErrors[field.id] = `${field.label} zorunludur`
      }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.warning("Lütfen zorunlu alanları doldurun.")
      return
    }

    if (adminCheck) {
      if (formData.email === adminCheck.email && formData.password === adminCheck.password) {
        localStorage.setItem(adminCheck.storageKey, adminCheck.storageValue)
        toast.success(adminCheck.alertMessage)
        router.push(adminCheck.redirect)
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch(submitUrl, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(onError ? onError(data) : (data.message || "Bir hata oluştu"))
        return
      }

      onSuccess(data, formData)

    } catch (err) {
      console.error("Bağlantı Hatası:", err)
      toast.error("Server'a ulaşılamıyor. Lütfen backend terminalini kontrol edin!")
    } finally {
      setSubmitting(false)
    }
  }

  // Sayfanın tek h1'i: site header'ındaki marka adı artık h1 değil (p),
  // bu yüzden her sayfanın kendi h1'ini sağlaması gerekiyor.
  const HeadingTag = "h1"

  return (
    <div className={`login-container ${blur ? "blur-active" : ""}`}>
      <div className="login-card">
        <HeadingTag>{title}</HeadingTag>
        <p className="login-sub">{subtitle}</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate={noValidate}>

          {fields.map(field => {
            const isPassword = field.type === "password"
            const isVisible = visiblePasswords[field.id]

            return (
              <div className="input-group" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <div className={isPassword ? "password-input-wrapper" : undefined}>
                  <input
                    id={field.id}
                    type={isPassword && isVisible ? "text" : field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onFocus={() => setBlur(true)}
                    onBlur={() => setBlur(false)}
                    required={field.required}
                    aria-invalid={Boolean(errors[field.id])}
                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility(field.id)}
                      aria-label={isVisible ? "Şifreyi Gizle" : "Şifreyi Göster"}
                    >
                      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                {errors[field.id] && (
                  <div
                    id={`${field.id}-error`}
                    style={{ marginTop: 6, fontSize: 12, color: "rgba(239, 68, 68, 0.95)" }}
                  >
                    {errors[field.id]}
                  </div>
                )}
              </div>
            )
          })}

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Gönderiliyor..." : submitButtonText}
          </button>

          <div className="login-links">
            {links.map((link, index) => (
              <div key={index} className="login-link-row">
                {link.text && <span>{link.text}</span>}
                {link.href === "#" && link.onClick ? (
                  <button
                    type="button"
                    className="login-link-anchor"
                    onClick={link.onClick}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid transparent",
                      padding: 0,
                      font: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {link.label}
                  </button>
                ) : link.isExternal ? (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.onClick) {
                        e.preventDefault()
                        link.onClick()
                      }
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="login-link-anchor">{link.label}</Link>
                )}
              </div>
            ))}
          </div>

        </form>
      </div>
    </div>
  )
}