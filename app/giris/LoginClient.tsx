"use client"

import { useRouter, useSearchParams } from "next/navigation"
import AuthForm from "@/components/AuthForm"
import "@/styles/login.css"
import { useToast } from "@/components/ToastProvider"
import { authService } from "@/lib/services"

/** Yalnızca site içi göreli yolları kabul et (açık yönlendirme koruması). */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/profil"
  return raw
}

export default function LoginClient() {
  const router = useRouter()
  const toast = useToast()
  const nextPath = safeNext(useSearchParams().get("next"))

  return (
    <AuthForm
      title="Giriş yap"
      subtitle="Elmenes Coffee hesabına giriş yap"
      fields={[
        { id: "email", label: "E-posta", type: "email", autoComplete: "email", placeholder: "ornek@eposta.com", required: true },
        { id: "password", label: "Şifre", type: "password", autoComplete: "current-password", placeholder: "Şifreni gir", required: true },
      ]}
      submitButtonText="Giriş yap"
      onSubmit={async ({ email, password }) => {
        const res = await authService.login({ email, password })
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
      links={[{ text: "Hesabın yok mu?", href: "/kayit", label: "Kayıt ol" }]}
    />
  )
}
