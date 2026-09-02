"use client"

import { useRouter, useSearchParams } from "next/navigation"
import AuthForm from "@/components/AuthForm"
import "@/styles/login.css"
import { useToast } from "@/components/ToastProvider"
import { API_BASE_URL } from "@/app/site-config"
import { setUser } from "@/lib/session"

/** Yalnızca site içi göreli yolları kabul et (açık yönlendirme koruması). */
function safeNext(raw: string | null): string | null {
  if (!raw) return null
  if (!raw.startsWith("/") || raw.startsWith("//")) return null
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
      submitUrl={`${API_BASE_URL}/api/backend/auth/login`}
      submitMethod="POST"
      submitButtonText="Giriş yap"
      adminCheck={{
        email: "admin@gmail.com",
        password: "admin123",
        redirect: "/adminpanel",
        message: "Admin olarak giriş yapıldı.",
      }}
      onSuccess={(data) => {
        const u = (data as { user: { name: string; email: string } }).user
        setUser(u)
        toast.success(`Hoş geldin, ${u.name}.`)
        router.push(nextPath ?? "/profil")
      }}
      onError={(data) => data.message || "Giriş yapılamadı."}
      links={[{ text: "Hesabın yok mu?", href: "/kayit", label: "Kayıt ol" }]}
    />
  )
}
