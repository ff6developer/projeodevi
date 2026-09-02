"use client"

import { useRouter } from "next/navigation"
import AuthForm from "@/components/AuthForm"
import "@/styles/login.css"
import { useToast } from "@/components/ToastProvider"
import { API_BASE_URL } from "@/app/site-config"

export default function RegisterClient() {
  const router = useRouter()
  const toast = useToast()

  return (
    <AuthForm
      title="Kayıt ol"
      subtitle="Elmenes Coffee hesabı oluştur"
      fields={[
        { id: "name", label: "Ad Soyad", type: "text", autoComplete: "name", placeholder: "Adını gir", required: true },
        { id: "email", label: "E-posta", type: "email", autoComplete: "email", placeholder: "ornek@eposta.com", required: true },
        {
          id: "password",
          label: "Şifre",
          type: "password",
          autoComplete: "new-password",
          placeholder: "Bir şifre belirle",
          required: true,
          hint: "En az 8 karakter.",
        },
      ]}
      submitUrl={`${API_BASE_URL}/api/backend/auth/register`}
      submitMethod="POST"
      submitButtonText="Kayıt ol"
      onSuccess={() => {
        toast.success("Kaydın oluşturuldu. Şimdi giriş yapabilirsin.")
        router.push("/giris")
      }}
      onError={(data) => data.message || "Bir şeyler ters gitti, tekrar dener misin?"}
      links={[{ text: "Zaten hesabın var mı?", href: "/giris", label: "Giriş yap" }]}
    />
  )
}
