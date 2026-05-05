"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [blur, setBlur] = useState(false)

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (adminCheck) {
      if (formData.email === adminCheck.email && formData.password === adminCheck.password) {
        localStorage.setItem(adminCheck.storageKey, adminCheck.storageValue)
        alert(adminCheck.alertMessage)
        router.push(adminCheck.redirect)
        return
      }
    }

    try {
      const res = await fetch(submitUrl, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(onError ? onError(data) : (data.message || "Bir hata oluştu"))
        return
      }

      onSuccess(data, formData)

    } catch (err) {
      console.error("Bağlantı Hatası:", err)
      alert("Server'a ulaşılamıyor. Lütfen backend terminalini kontrol edin!")
    }
  }

  const HeadingTag = title === "Giriş Yap" ? "h2" : "h1"

  return (
    <div className={`login-container ${blur ? "blur-active" : ""}`}>
      <div className="login-card">
        <HeadingTag>{title}</HeadingTag>
        <p className="login-sub">{subtitle}</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate={noValidate}>

          {fields.map(field => (
            <div className="input-group" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onFocus={() => setBlur(true)}
                onBlur={() => setBlur(false)}
                required={field.required}
              />
            </div>
          ))}

          <button type="submit" className="login-button">
            {submitButtonText}
          </button>

          <div className="login-links">
            {links.map((link, index) => (
              <div key={index} className="login-links">
                {link.text && <span>{link.text}</span>}
                {link.isExternal ? (
                  <a href={link.href}>{link.label}</a>
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