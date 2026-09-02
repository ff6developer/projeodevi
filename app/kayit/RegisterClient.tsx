"use client"

import { useRouter, useSearchParams } from "next/navigation"
import AuthForm from "@/components/AuthForm"
import "@/styles/login.css"
import { useToast } from "@/components/ToastProvider"
import { authService } from "@/lib/services"

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/"
  return raw
}

export default function RegisterClient() {
  const router = useRouter()
  const toast = useToast()
  const nextPath = safeNext(useSearchParams().get("next"))

  return (
    <AuthForm
      title="Kayıt ol"
      subtitle="Birkaç saniyede hesabını oluştur"
      fields={[
        { id: "name", label: "Ad Soyad", type: "text", autoComplete: "name", placeholder: "Adını gir", required: true },
        { id: "email", label: "E-posta", type: "email", autoComplete: "email", placeholder: "ornek@eposta.com", required: true },
        {
          id: "password",
          label: "Şifre",
          type: "password",
          autoComplete: "new-password",
          placeholder: "En az 8 karakter",
          required: true,
          hint: "En az 8 karakter.",
        },
      ]}
      submitButtonText="Kayıt ol"
      onSubmit={async ({ name, email, password }) => {
        const res = await authService.register({ name, email, password })
        if (!res.ok) return { ok: false, error: res.error, field: res.code }
        toast.success(`Hoş geldin, ${res.data.name}.`)
        router.push(nextPath)
        return { ok: true }
      }}
      onDemo={async () => {
        const res = await authService.loginDemo()
        if (res.ok) {
          toast.success(`Hoş geldin, ${res.data.name}.`)
          router.push(nextPath)
        }
      }}
      links={[{ text: "Zaten hesabın var mı?", href: "/giris", label: "Giriş yap" }]}
    />
  )
}
