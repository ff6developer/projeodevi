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
      title="Kayıt Ol"
      subtitle="ELMENES COFFEE hesabı oluşturun"
      fields={[
        {
          id: "name",
          label: "Ad Soyad",
          type: "text",
          autoComplete: "name",
          placeholder: "Adınızı girin",
          required: true
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          autoComplete: "email",
          placeholder: "email@example.com",
          required: true
        },
        {
          id: "password",
          label: "Şifre",
          type: "password",
          autoComplete: "new-password",
          placeholder: "Şifre oluşturun",
          required: true
        }
      ]}
      submitUrl={`${API_BASE_URL}/api/backend/auth/register`}
      submitMethod="POST"
      submitButtonText="Kayıt Ol"
      noValidate={true}
      onSuccess={() => {
        toast.success("Kayıt başarılı ✔")
        router.push("/giris")
      }}
      onError={(data) => data.message || "Bir şeyler ters gitti, tekrar dener misin?"}
      links={[
        { text: "Zaten hesabınız var mı?", href: "/giris", label: "Giriş Yap" }
      ]}
    />
  )
}