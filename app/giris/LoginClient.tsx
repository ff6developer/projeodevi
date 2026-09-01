"use client"

import { useRouter } from "next/navigation"
import AuthForm from "@/components/AuthForm"
import "@/styles/login.css"
import { useToast } from "@/components/ToastProvider"
import { API_BASE_URL } from "@/app/site-config"

export default function LoginClient() {
  const router = useRouter()
  const toast = useToast()

  return (
    <AuthForm
      title="Giriş Yap"
      subtitle="ELMENES COFFEE hesabınıza giriş yapın"
      fields={[
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
          autoComplete: "current-password",
          placeholder: "Şifrenizi girin",
          required: true
        }
      ]}
      submitUrl={`${API_BASE_URL}/api/backend/auth/login`}
      submitMethod="POST"
      submitButtonText="Giriş Yap"
      noValidate={true}
      adminCheck={{
        email: "admin@gmail.com",
        password: "admin123",
        redirect: "/adminpanel",
        alertMessage: "Admin olarak giriş yaptın",
        storageKey: "isAdmin",
        storageValue: "true"
      }}
      onSuccess={(data) => {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("isLoggedIn", "true")
        toast.success(`Hoş geldin, ${data.user.name}!`)
        router.push("/profil")
      }}
      onError={(data) => data.message || "Giriş başarısız"}
      links={[
        {
          href: "#",
          label: "Şifremi Unuttum",
          isExternal: true,
          onClick: () => toast.info("Bu özellik yakında kullanıma sunulacak.")
        },
        { href: "/kayit", label: "Hesap Oluştur" }
      ]}
    />
  )
}